import Stripe from "stripe";
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

type StripeCheckoutRequest = {
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
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured yet" },
      { status: 500 }
    );
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  let body: StripeCheckoutRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

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

  // Validate required fields
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

  if (researchConfirmed !== true) {
    return NextResponse.json(
      { error: "Research use must be confirmed" },
      { status: 400 }
    );
  }

  for (const item of items) {
    if (!item.productId || !item.productName || !item.quantity || !item.unitPrice) {
      return NextResponse.json(
        { error: "Each item must have productId, productName, quantity, and unitPrice" },
        { status: 400 }
      );
    }
  }

  const supabase = createAdminSupabase();

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
      subtotal,
      shipping_cost: shippingCost,
      total,
      currency,
      locale,
      payment_method: "stripe",
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
      metadata: { orderId: order.id },
      success_url: `${siteUrl}/${locale}/checkout/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${locale}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    );
  }
}
