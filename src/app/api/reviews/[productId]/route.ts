import type { NextRequest } from "next/server";
import { createStaticSupabase } from "@/lib/supabase/static";
import { ok, fail } from "@/lib/api/response";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;

  if (!UUID_REGEX.test(productId)) {
    return fail("Invalid product ID format", 400, "INVALID_ID");
  }

  const url = new URL(request.url);
  const pageRaw = Number(url.searchParams.get("page") ?? "1");
  const limitRaw = Number(url.searchParams.get("limit") ?? "10");

  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;
  const limit =
    Number.isFinite(limitRaw) && limitRaw >= 1 && limitRaw <= 50
      ? Math.floor(limitRaw)
      : 10;

  const offset = (page - 1) * limit;

  const supabase = createStaticSupabase();

  const { data, error, count } = await supabase
    .from("reviews")
    .select(
      "id, product_id, rating, title, text, author_name, verified_purchase, created_at",
      { count: "exact" }
    )
    .eq("product_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Failed to load reviews:", error);
    return fail("Failed to load reviews", 500, "DB_ERROR");
  }

  const total = count ?? 0;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return ok({
    reviews: data ?? [],
    page,
    limit,
    total,
    totalPages,
  });
}
