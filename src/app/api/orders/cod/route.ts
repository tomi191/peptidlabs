import { createAdminSupabase } from "@/lib/supabase/admin";
import { ok, fail, parseBody } from "@/lib/api/response";
import { CodOrderSchema } from "@/lib/api/schemas";
import { sendOrderConfirmation } from "@/lib/email/send";

export async function POST(request: Request) {
  // Check service role key is configured
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return fail("Server configuration error", 500, "CONFIG_MISSING");
  }

  const parsed = await parseBody(request, CodOrderSchema);
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

  // Validate country is Bulgaria for COD
  if (
    shippingAddress.country !== "BG" &&
    shippingAddress.country !== "Bulgaria"
  ) {
    return fail(
      "Cash on delivery is only available for Bulgaria",
      400,
      "COD_UNAVAILABLE"
    );
  }

  const supabase = createAdminSupabase();

  // Validate prices + atomically reserve stock per item.
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

  // Create the order
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
      payment_method: "cod",
      status: "pending",
    })
    .select("*")
    .single();

  if (orderError) {
    await rollbackStock(supabase, reservations);
    console.error("Failed to create order:", orderError);
    return fail("Failed to create order", 500, "DB_ERROR");
  }

  // Create order items
  const orderItemsInsert = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
  }));

  const { data: insertedItems, error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsInsert)
    .select("*");

  if (itemsError) {
    await supabase
      .from("orders")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancellation_reason: "items_insert_failed",
      })
      .eq("id", order.id);
    await rollbackStock(supabase, reservations);
    console.error("Failed to create order items:", itemsError);
    return fail("Failed to create order items", 500, "DB_ERROR");
  }

  // Fire-and-forget email (never block the response)
  sendOrderConfirmation(order, insertedItems ?? [], locale).catch((err) =>
    console.error("[email] confirmation failed:", err)
  );

  return ok({ orderId: order.id, status: "pending" as const }, { status: 201 });
}

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
