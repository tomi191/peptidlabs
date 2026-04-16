import { createAdminSupabase } from "@/lib/supabase/admin";
import { ok, fail, parseBody } from "@/lib/api/response";
import { CodOrderSchema } from "@/lib/api/schemas";

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

  return ok({ orderId: order.id, status: "pending" as const }, { status: 201 });
}
