import Stripe from "stripe";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ok, fail, parseBody } from "@/lib/api/response";
import { StripeCheckoutSchema } from "@/lib/api/schemas";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return fail("Stripe is not configured yet", 500, "CONFIG_MISSING");
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return fail("Server configuration error", 500, "CONFIG_MISSING");
  }

  const parsed = await parseBody(request, StripeCheckoutSchema);
  if (!parsed.success) return parsed.response;

  const {
    email,
    phone,
    shippingAddress,
    items,
    shippingCost,
    currency,
    locale,
  } = parsed.data;

  const supabase = createAdminSupabase();

  // Validate prices + reserve stock atomically per item.
  const reservations: { productId: string; quantity: number }[] = [];
  for (const item of items) {
    const { data: product } = await supabase
      .from("products")
      .select("price_eur, status")
      .eq("id", item.productId)
      .single();

    if (!product || product.status !== "published") {
      await rollbackStock(supabase, reservations);
      return fail(
        `Product ${item.productName} is no longer available`,
        400,
        "PRODUCT_UNAVAILABLE"
      );
    }

    if (Math.abs(item.unitPrice - product.price_eur) > 0.01) {
      await rollbackStock(supabase, reservations);
      return fail(
        "Price has changed. Please refresh and try again.",
        400,
        "PRICE_MISMATCH"
      );
    }

    // Atomic decrement — locks the row and checks availability.
    const { data: dec, error: decErr } = await supabase
      .rpc("decrement_product_stock", {
        p_product_id: item.productId,
        p_quantity: item.quantity,
      })
      .single();

    const decResult = dec as
      | { ok: boolean; reason: string; new_stock: number }
      | null;

    if (decErr || !decResult || !decResult.ok) {
      await rollbackStock(supabase, reservations);
      return fail(
        `Insufficient stock for ${item.productName}`,
        400,
        "INSUFFICIENT_STOCK"
      );
    }
    reservations.push({ productId: item.productId, quantity: item.quantity });
  }

  // Recalculate totals from validated prices
  const validatedSubtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const validatedTotal = validatedSubtotal + shippingCost;

  // Create order in Supabase
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      email,
      phone,
      shipping_name: shippingAddress.name,
      shipping_address: shippingAddress.address,
      shipping_address_line2: shippingAddress.addressLine2 || null,
      shipping_city: shippingAddress.city,
      shipping_postal_code: shippingAddress.postalCode,
      shipping_country: shippingAddress.country,
      subtotal: validatedSubtotal,
      shipping_cost: shippingCost,
      total: validatedTotal,
      currency,
      locale,
      payment_method: "stripe",
      status: "pending",
    })
    .select("id")
    .single();

  if (orderError) {
    await rollbackStock(supabase, reservations);
    console.error("Failed to create order:", orderError);
    return fail("Failed to create order", 500, "DB_ERROR");
  }

  // Create order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    await cancelOrder(supabase, order.id, reservations, "items_insert_failed");
    return fail("Failed to create order items", 500, "DB_ERROR");
  }

  // Build Stripe line items
  const lineItems = items.map((item) => ({
    price_data: {
      currency: currency.toLowerCase(),
      product_data: { name: item.productName },
      unit_amount: Math.round(item.unitPrice * 100),
    },
    quantity: item.quantity,
  }));

  if (shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: { name: "Shipping" },
        unit_amount: Math.round(shippingCost * 100),
      },
      quantity: 1,
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: email,
        currency: currency.toLowerCase(),
        line_items: lineItems,
        metadata: { orderId: order.id, phone, locale },
        payment_intent_data: { metadata: { orderId: order.id } },
        client_reference_id: order.id,
        success_url: `${siteUrl}/${locale}/checkout/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/${locale}/checkout`,
      },
      {
        // Idempotency key — prevents duplicate Stripe sessions if the
        // client retries the request with the same order id.
        idempotencyKey: `stripe-session:${order.id}`,
      }
    );

    if (!session.url) {
      await cancelOrder(supabase, order.id, reservations, "stripe_no_url");
      return fail("Stripe session missing redirect URL", 500, "STRIPE_ERROR");
    }

    // Persist the Stripe session id so the webhook can reconcile.
    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return ok({ url: session.url, orderId: order.id });
  } catch (err) {
    await cancelOrder(supabase, order.id, reservations, "stripe_exception");
    console.error("Stripe session creation failed:", err);
    return fail("Failed to create payment session", 500, "STRIPE_ERROR");
  }
}

/** Release reserved stock when the flow aborts before payment. */
async function rollbackStock(
  supabase: ReturnType<typeof createAdminSupabase>,
  reservations: { productId: string; quantity: number }[]
): Promise<void> {
  for (const r of reservations) {
    await supabase.rpc("restore_product_stock", {
      p_product_id: r.productId,
      p_quantity: r.quantity,
    });
  }
}

/** Mark the order cancelled AND restore stock. */
async function cancelOrder(
  supabase: ReturnType<typeof createAdminSupabase>,
  orderId: string,
  reservations: { productId: string; quantity: number }[],
  reason: string
): Promise<void> {
  await supabase
    .from("orders")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason,
    })
    .eq("id", orderId);
  await rollbackStock(supabase, reservations);
}
