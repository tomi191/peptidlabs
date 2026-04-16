import type { NextRequest } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ok, fail, parseBody } from "@/lib/api/response";
import { AdminProductCreateSchema } from "@/lib/api/schemas";

function validateAdminToken(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  const token = auth.replace("Bearer ", "");
  return token.startsWith("admin-");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(req: NextRequest) {
  if (!validateAdminToken(req)) {
    return fail("Unauthorized", 401, "UNAUTHORIZED");
  }

  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status");

  const supabase = createAdminSupabase();

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: products, error } = await query;

  if (error) {
    return fail("Failed to fetch products", 500, "DB_ERROR");
  }

  return ok(products ?? []);
}

export async function POST(req: NextRequest) {
  if (!validateAdminToken(req)) {
    return fail("Unauthorized", 401, "UNAUTHORIZED");
  }

  const parsed = await parseBody(req, AdminProductCreateSchema);
  if (!parsed.success) return parsed.response;

  const body = parsed.data;

  const slug = body.slug?.trim() || slugify(body.name);
  const sku = body.sku?.trim() || "";

  const product = {
    name: body.name,
    name_bg: body.name_bg ?? null,
    slug,
    sku,
    description_bg: body.description_bg ?? null,
    description_en: body.description_en ?? null,
    price_bgn: body.price_bgn,
    price_eur: body.price_eur,
    images: body.images ?? [],
    vial_size_mg: body.vial_size_mg ?? null,
    form: body.form,
    purity_percent: body.purity_percent,
    molecular_weight: body.molecular_weight ?? null,
    sequence: body.sequence ?? null,
    scientific_data: body.scientific_data ?? {},
    coa_url: body.coa_url ?? null,
    is_bestseller: body.is_bestseller ?? false,
    is_blend: body.is_blend ?? false,
    status: body.status ?? "draft",
    stock: body.stock ?? 0,
    weight_grams: body.weight_grams ?? null,
  };

  const supabase = createAdminSupabase();

  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error("Failed to create product:", error);
    return fail(
      `Failed to create product: ${error.message}`,
      500,
      "DB_ERROR"
    );
  }

  return ok(data, { status: 201 });
}
