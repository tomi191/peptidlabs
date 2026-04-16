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

  // Validate prices against database
  for (const item of items) {
    const { data: product } = await supabase
      .from("products")
      .select("price_bgn, price_eur, status, stock")
      .eq("id", item.productId)
      .single();

    if (!product || product.status !== "published") {
      return fail(
        `Product ${item.productName} is no longer available`,
        400,
        "PRODUCT_UNAVAILABLE"
      );
    }

    const expectedPrice = product.price_eur;
    if (Math.abs(item.unitPrice - expectedPrice) > 0.01) {
      return fail(
        "Price has changed. Please refresh and try again.",
        400,
        "PRICE_MISMATCH"
      );
    }

    if (product.stock < item.quantity) {
      return fail(
        `Insufficient stock for ${item.productName}`,
        400,
        "INSUFFICIENT_STOCK"
      );
    }
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
    console.error("Failed to create order items:", itemsError);
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

  // Add shipping as a separate line item if applicable
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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      currency: currency.toLowerCase(),
      line_items: lineItems,
      metadata: { orderId: order.id, phone },
      success_url: `${siteUrl}/${locale}/checkout/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${locale}/checkout`,
    });

    if (!session.url) {
      return fail("Stripe session missing redirect URL", 500, "STRIPE_ERROR");
    }

    return ok({ url: session.url, orderId: order.id });
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    return fail("Failed to create payment session", 500, "STRIPE_ERROR");
  }
}
