import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

function validateAdminToken(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  const token = auth.replace("Bearer ", "");
  return token.startsWith("admin-");
}

export async function GET(req: NextRequest) {
  if (!validateAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const supabase = createAdminSupabase();

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: orders, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }

  // Fetch items for all orders
  const orderIds = (orders ?? []).map((o) => o.id);

  let items: Record<string, unknown>[] = [];
  if (orderIds.length > 0) {
    const { data: allItems } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);
    items = allItems ?? [];
  }

  // Attach items to each order
  const ordersWithItems = (orders ?? []).map((order) => ({
    ...order,
    items: items.filter(
      (item) => (item as { order_id: string }).order_id === order.id
    ),
  }));

  return NextResponse.json(ordersWithItems);
}
