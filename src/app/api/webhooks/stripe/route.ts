import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { sendOrderConfirmation } from "@/lib/email/send";
import type { Order, OrderItem } from "@/lib/types";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const stripe = getStripe();

  if (!stripe || !sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminSupabase();

  // Successful checkout — confirm order, award rewards, send confirmation email
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const locale = session.metadata?.locale ?? "bg";

    if (orderId) {
      await supabase
        .from("orders")
        .update({
          status: "confirmed",
          stripe_payment_id: session.payment_intent as string,
        })
        .eq("id", orderId);

      // Award loyalty points (idempotent via orders.rewards_awarded flag).
      const { error: rpcError } = await supabase.rpc("award_order_rewards", {
        p_order_id: orderId,
      });
      if (rpcError) {
        console.error("[stripe webhook] award_order_rewards failed:", rpcError);
      }

      // Send confirmation email — fetch the now-confirmed order + items
      const [{ data: order }, { data: items }] = await Promise.all([
        supabase.from("orders").select("*").eq("id", orderId).single(),
        supabase.from("order_items").select("*").eq("order_id", orderId),
      ]);

      if (order) {
        sendOrderConfirmation(
          order as Order,
          (items as OrderItem[]) ?? [],
          locale
        ).catch((err) =>
          console.error("[stripe webhook] confirmation email failed:", err)
        );
      } else {
        console.error(
          `[stripe webhook] order ${orderId} not found for confirmation email`
        );
      }
    }
  }

  // Failed payment — mark the order so admin can follow up
  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = intent.metadata?.orderId;
    if (orderId) {
      await supabase
        .from("orders")
        .update({
          status: "payment_failed",
          stripe_payment_id: intent.id,
        })
        .eq("id", orderId);
      console.warn(
        `[stripe webhook] payment failed for order ${orderId}: ${intent.last_payment_error?.message ?? "unknown"}`
      );
    }
  }

  // Refund — flip status so admin sees it in the dashboard
  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId =
      typeof charge.payment_intent === "string" ? charge.payment_intent : null;
    if (paymentIntentId) {
      await supabase
        .from("orders")
        .update({ status: "refunded" })
        .eq("stripe_payment_id", paymentIntentId);
    }
  }

  return NextResponse.json({ received: true });
}
