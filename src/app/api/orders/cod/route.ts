import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

type ShippingAddress = {
  name: string;
  address: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
};

type CodOrderRequest = {
  email: string;
  phone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  locale: string;
  researchConfirmed: boolean;
};

export async function POST(request: Request) {
  // Check service role key is configured
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  let body: CodOrderRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  // Validate required fields
  const {
    email,
    phone,
    shippingAddress,
    items,
    subtotal,
    shippingCost,
    total,
    currency,
    locale,
    researchConfirmed,
  } = body;

  if (
    !email ||
    !phone ||
    !shippingAddress ||
    !items ||
    items.length === 0 ||
    subtotal == null ||
    shippingCost == null ||
    total == null ||
    !currency ||
    !locale
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (
    !shippingAddress.name ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.postalCode ||
    !shippingAddress.country
  ) {
    return NextResponse.json(
      { error: "Missing required shipping address fields" },
      { status: 400 }
    );
  }

  // Validate research confirmed
  if (researchConfirmed !== true) {
    return NextResponse.json(
      { error: "Research use must be confirmed" },
      { status: 400 }
    );
  }

  // Validate country is Bulgaria for COD
  if (
    shippingAddress.country !== "BG" &&
    shippingAddress.country !== "Bulgaria"
  ) {
    return NextResponse.json(
      { error: "Cash on delivery is only available for Bulgaria" },
      { status: 400 }
    );
  }

  // Validate each item has required fields
  for (const item of items) {
    if (!item.productId || !item.productName || !item.quantity || !item.unitPrice) {
      return NextResponse.json(
        { error: "Each item must have productId, productName, quantity, and unitPrice" },
        { status: 400 }
      );
    }
  }

  const supabase = createAdminSupabase();

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
      subtotal,
      shipping_cost: shippingCost,
      total,
      currency,
      locale,
      payment_method: "cod",
      status: "pending",
    })
    .select("id")
    .single();

  if (orderError) {
    console.error("Failed to create order:", orderError);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: "Failed to create order items" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { orderId: order.id, status: "pending" },
    { status: 201 }
  );
}
