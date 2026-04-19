import type { NextRequest } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ok, fail } from "@/lib/api/response";
import { isAdmin } from "@/lib/auth/guard";

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return fail("Unauthorized", 401, "UNAUTHORIZED");
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
    const msg = JSON.stringify({ msg: error.message, code: error.code, url: process.env.NEXT_PUBLIC_SUPABASE_URL, keyLen: process.env.SUPABASE_SERVICE_ROLE_KEY?.length });
    console.error("[orders-debug]", msg);
    return fail(msg, 500, "DB_ERROR");
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

  return ok(ordersWithItems);
}
