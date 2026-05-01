import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

/**
 * Unified search payload — products + peptides (encyclopedia) + blog posts
 * fetched in parallel and returned as ONE JSON. The Cmd+K command palette
 * loads this once on first open, then filters client-side as the user types
 * (so the UX is instant and there is no per-keystroke roundtrip).
 *
 * Total payload for the catalog (~72 products + 49 peptides + 3 blogs)
 * is ~50KB gzipped.
 */
export const runtime = "nodejs";
export const revalidate = 60; // 1-minute edge cache

export async function GET() {
  const supabase = createAdminSupabase();

  const [productsRes, peptidesRes, blogRes] = await Promise.all([
    supabase
      .from("products")
      .select(
        "name, name_bg, slug, vial_size_mg, price_bgn, price_eur, form, purity_percent, use_case_tag_bg, use_case_tag_en, images",
      )
      .eq("status", "published")
      .order("name"),

    supabase
      .from("peptides")
      .select("name, slug, full_name_bg, full_name_en, summary_bg, summary_en")
      .order("name"),

    supabase
      .from("blog_posts")
      .select("slug, title_bg, title_en, tags, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false }),
  ]);

  return NextResponse.json({
    products: productsRes.data ?? [],
    peptides: peptidesRes.data ?? [],
    blog: blogRes.data ?? [],
    error:
      productsRes.error?.message ??
      peptidesRes.error?.message ??
      blogRes.error?.message ??
      null,
  });
}
