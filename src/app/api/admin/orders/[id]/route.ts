import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

function validateAdminToken(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  const token = auth.replace("Bearer ", "");
  return token.startsWith("admin-");
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const VALID_COURIERS = ["econt", "speedy", "international"] as const;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json(
      { error: "Invalid order ID format" },
      { status: 400 }
    );
  }

  const supabase = createAdminSupabase();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);

  return NextResponse.json({
    ...order,
    items: items ?? [],
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json(
      { error: "Invalid order ID format" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const updates: Record<string, unknown> = {};

    if (body.status !== undefined) {
      if (
        !VALID_STATUSES.includes(
          body.status as (typeof VALID_STATUSES)[number]
        )
      ) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }

    if (body.trackingNumber !== undefined) {
      updates.tracking_number = body.trackingNumber;
    }

    if (body.courier !== undefined) {
      if (
        !VALID_COURIERS.includes(
          body.courier as (typeof VALID_COURIERS)[number]
        )
      ) {
        return NextResponse.json(
          { error: "Invalid courier" },
          { status: 400 }
        );
      }
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
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    updates.updated_at = new Date().toISOString();

    const supabase = createAdminSupabase();

    const { data: order, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
