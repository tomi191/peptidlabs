import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }

  return NextResponse.json(products ?? []);
}

const VALID_STATUSES = ["draft", "published", "out_of_stock", "archived"] as const;
const VALID_FORMS = ["lyophilized", "solution", "nasal_spray", "capsule", "accessory"] as const;

export async function POST(req: NextRequest) {
  if (!validateAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    if (body.form && !VALID_FORMS.includes(body.form)) {
      return NextResponse.json(
        { error: "Invalid form" },
        { status: 400 }
      );
    }

    const slug = body.slug?.trim() || slugify(body.name);
    const sku = body.sku?.trim() || "";

    const product = {
      name: body.name,
      name_bg: body.name_bg || null,
      slug,
      sku,
      description_bg: body.description_bg || null,
      description_en: body.description_en || null,
      price_bgn: Number(body.price_bgn) || 0,
      price_eur: Number(body.price_eur) || 0,
      images: body.images || [],
      vial_size_mg: body.vial_size_mg ? Number(body.vial_size_mg) : null,
      form: body.form || "lyophilized",
      purity_percent: Number(body.purity_percent) || 98,
      molecular_weight: body.molecular_weight ? Number(body.molecular_weight) : null,
      sequence: body.sequence || null,
      scientific_data: body.scientific_data || {},
      coa_url: body.coa_url || null,
      is_bestseller: Boolean(body.is_bestseller),
      is_blend: Boolean(body.is_blend),
      status: body.status || "draft",
      stock: Number(body.stock) || 0,
      weight_grams: body.weight_grams ? Number(body.weight_grams) : null,
    };

    const supabase = createAdminSupabase();

    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Failed to create product: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
