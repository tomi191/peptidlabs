import type { NextRequest } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ok, fail, parseBody } from "@/lib/api/response";
import { AdminProductUpdateSchema } from "@/lib/api/schemas";
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
    return fail("Invalid product ID format", 400, "INVALID_ID");
  }

  const supabase = createAdminSupabase();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    return fail("Product not found", 404, "NOT_FOUND");
  }

  const { data: links } = await supabase
    .from("product_categories")
    .select("category_id, categories(slug)")
    .eq("product_id", id);

  const category_slugs = (links ?? [])
    .map((l) => (l.categories as unknown as { slug: string } | null)?.slug)
    .filter((s): s is string => Boolean(s));

  return ok({ ...product, category_slugs });
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
    return fail("Invalid product ID format", 400, "INVALID_ID");
  }

  const parsed = await parseBody(req, AdminProductUpdateSchema);
  if (!parsed.success) return parsed.response;

  const body = parsed.data;
  const updates: Record<string, unknown> = {};

  const directFields = [
    "name",
    "name_bg",
    "slug",
    "sku",
    "description_bg",
    "description_en",
    "summary_bg",
    "summary_en",
    "use_case_tag_bg",
    "use_case_tag_en",
    "sequence",
    "coa_url",
    "price_bgn",
    "price_eur",
    "purity_percent",
    "stock",
    "vial_size_mg",
    "molecular_weight",
    "weight_grams",
    "form",
    "status",
    "is_bestseller",
    "is_blend",
    "images",
    "scientific_data",
  ] as const;

  for (const field of directFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  const supabase = createAdminSupabase();

  // Sync category links if provided (separate junction table)
  if (body.category_slugs !== undefined) {
    const { data: cats } = await supabase
      .from("categories")
      .select("id, slug")
      .in("slug", body.category_slugs);
    const newCategoryIds = (cats ?? []).map((c) => c.id);

    await supabase.from("product_categories").delete().eq("product_id", id);
    if (newCategoryIds.length > 0) {
      await supabase.from("product_categories").insert(
        newCategoryIds.map((cid) => ({ product_id: id, category_id: cid }))
      );
    }
  }

  if (Object.keys(updates).length === 0 && body.category_slugs === undefined) {
    return fail("No valid fields to update", 400, "NO_UPDATES");
  }

  if (Object.keys(updates).length > 0) {
    updates.updated_at = new Date().toISOString();
    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id);
    if (error) {
      console.error("Failed to update product:", error);
      return fail("Failed to update product", 500, "DB_ERROR");
    }
  }

  // Re-fetch with current data
  const { data: product, error: fetchErr } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr) {
    return fail("Failed to fetch updated product", 500, "DB_ERROR");
  }

  return ok(product);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(req))) {
    return fail("Unauthorized", 401, "UNAUTHORIZED");
  }

  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return fail("Invalid product ID format", 400, "INVALID_ID");
  }

  const supabase = createAdminSupabase();

  const { data: product, error } = await supabase
    .from("products")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to archive product:", error);
    return fail("Failed to archive product", 500, "DB_ERROR");
  }

  return ok(product);
}
