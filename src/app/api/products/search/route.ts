import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminSupabase();

  const { data, error } = await supabase
    .from("products")
    .select("name, slug, vial_size_mg, price_bgn, price_eur, form, purity_percent")
    .eq("status", "published")
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
