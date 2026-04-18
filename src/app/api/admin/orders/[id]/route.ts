import type { NextRequest } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ok, fail, parseBody } from "@/lib/api/response";
import { AdminOrderUpdateSchema } from "@/lib/api/schemas";
import { sendShippingUpdate } from "@/lib/email/send";
import { isAdmin } from "@/lib/auth/guard";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(req))) {
    return fail("Unauthorized", 401, "UNAUTHORIZED");
  }

  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return fail("Invalid order ID format", 400, "INVALID_ID");
  }

  const supabase = createAdminSupabase();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    return fail("Order not found", 404, "NOT_FOUND");
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);

  return ok({ ...order, items: items ?? [] });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(req))) {
    return fail("Unauthorized", 401, "UNAUTHORIZED");
  }

  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return fail("Invalid order ID format", 400, "INVALID_ID");
  }

  const parsed = await parseBody(req, AdminOrderUpdateSchema);
  if (!parsed.success) return parsed.response;

  const body = parsed.data;
  const updates: Record<string, unknown> = {};

  if (body.status !== undefined) {
    updates.status = body.status;
  }

  if (body.trackingNumber !== undefined) {
    updates.tracking_number = body.trackingNumber;
  }

  if (body.courier !== undefined) {
    // Build tracking URL based on courier
    const trackingNumber = body.trackingNumber ?? "";
    let trackingUrl = "";
    if (body.courier === "econt") {
      trackingUrl = `https://www.econt.com/services/shipment-tracking?shipmentNumber=${trackingNumber}`;
    } else if (body.courier === "speedy") {
      trackingUrl = `https://www.speedy.bg/en/track-shipment/${trackingNumber}`;
    }
    if (trackingUrl) {
      updates.tracking_url = trackingUrl;
    }
  }

  if (Object.keys(updates).length === 0) {
    return fail("No valid fields to update", 400, "NO_UPDATES");
  }

  updates.updated_at = new Date().toISOString();

  const supabase = createAdminSupabase();

  // Read previous status so we know whether to fire the shipping email
  const { data: previous } = await supabase
    .from("orders")
    .select("status")
    .eq("id", id)
    .single();

  const { data: order, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return fail("Failed to update order", 500, "DB_ERROR");
  }

  // Fire shipping notification when status first transitions to "shipped"
  if (
    order.status === "shipped" &&
    previous?.status !== "shipped" &&
    order.tracking_number
  ) {
    const locale =
      (order as { locale?: string }).locale === "en" ? "en" : "bg";
    sendShippingUpdate(order, locale).catch((err) =>
      console.error("[email] shipping update failed:", err)
    );
  }

  // Award loyalty points when order first becomes payable (confirmed/shipped/delivered).
  // The DB-side RPC is idempotent via orders.rewards_awarded — safe to call
  // multiple times through status transitions.
  const earningStatuses = new Set(["confirmed", "shipped", "delivered"]);
  if (
    earningStatuses.has(order.status) &&
    !earningStatuses.has(previous?.status ?? "")
  ) {
    const { error: rpcError } = await supabase.rpc("award_order_rewards", {
      p_order_id: id,
    });
    if (rpcError) {
      console.error("[rewards] award_order_rewards failed:", rpcError);
    }
  }

  return ok(order);
}
