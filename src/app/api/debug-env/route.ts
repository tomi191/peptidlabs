import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "MISSING";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "MISSING";

  const supabase = createAdminSupabase();
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  let anonRef = "cannot-decode";
  try {
    const payload = anonKey.split(".")[1];
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    anonRef = Buffer.from(padded, "base64").toString("utf8").slice(0, 80);
  } catch {}

  return NextResponse.json({
    url_prefix: url.slice(0, 50),
    anon_prefix: anonKey.slice(0, 30),
    anon_payload: anonRef,
    admin_count: count,
  });
}
