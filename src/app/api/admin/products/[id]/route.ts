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
      { error: "Invalid product ID format" },
      { status: 400 }
    );
  }

  const supabase = createAdminSupabase();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

const VALID_STATUSES = ["draft", "published", "out_of_stock", "archived"] as const;
const VALID_FORMS = ["lyophilized", "solution", "nasal_spray", "capsule", "accessory"] as const;

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
      { error: "Invalid product ID format" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const updates: Record<string, unknown> = {};

    const stringFields = [
      "name", "name_bg", "slug", "sku",
      "description_bg", "description_en",
      "sequence", "coa_url",
    ] as const;

    for (const field of stringFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field] || null;
      }
    }

    // Name is required — don't null it
    if (body.name !== undefined) {
      updates.name = body.name;
    }

    const numberFields = [
      "price_bgn", "price_eur", "purity_percent", "stock",
    ] as const;

    for (const field of numberFields) {
      if (body[field] !== undefined) {
        updates[field] = Number(body[field]);
      }
    }

    const nullableNumberFields = [
      "vial_size_mg", "molecular_weight", "weight_grams",
    ] as const;

    for (const field of nullableNumberFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field] ? Number(body[field]) : null;
      }
    }

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status as (typeof VALID_STATUSES)[number])) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }

    if (body.form !== undefined) {
      if (!VALID_FORMS.includes(body.form as (typeof VALID_FORMS)[number])) {
        return NextResponse.json(
          { error: "Invalid form" },
          { status: 400 }
        );
      }
      updates.form = body.form;
    }

    if (body.is_bestseller !== undefined) {
      updates.is_bestseller = Boolean(body.is_bestseller);
    }

    if (body.is_blend !== undefined) {
      updates.is_blend = Boolean(body.is_blend);
    }

    if (body.images !== undefined) {
      updates.images = body.images;
    }

    if (body.scientific_data !== undefined) {
      updates.scientific_data = body.scientific_data;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: "Failed to update product" },
        { status: 500 }
      );
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json(
      { error: "Invalid product ID format" },
      { status: 400 }
    );
  }

  const supabase = createAdminSupabase();

  const { data: product, error } = await supabase
    .from("products")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to archive product" },
      { status: 500 }
    );
  }

  return NextResponse.json(product);
}
