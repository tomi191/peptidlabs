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

  return ok(product);
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

  // Map camelCase/exact schema fields to DB columns (all match 1:1 here).
  const directFields = [
    "name",
    "name_bg",
    "slug",
    "sku",
    "description_bg",
    "description_en",
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

  if (Object.keys(updates).length === 0) {
    return fail("No valid fields to update", 400, "NO_UPDATES");
  }

  updates.updated_at = new Date().toISOString();

  const supabase = createAdminSupabase();

  const { data: product, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update product:", error);
    return fail("Failed to update product", 500, "DB_ERROR");
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
