import type { NextRequest } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ok, fail } from "@/lib/api/response";
import { isAdmin } from "@/lib/auth/guard";

export const runtime = "nodejs";

/**
 * Aggregated counts + top peptides + top sources for the admin dashboard.
 * Computed in a single round-trip via parallel queries so it stays cheap
 * even at 10K+ subscribers.
 *
 * Top-peptide aggregation requires scanning every row's text[] column,
 * which Postgres can't push down to a single COUNT GROUP BY without
 * unnest. We use a small RPC fallback path: fetch only the slug arrays
 * (one column) and aggregate in memory. At 10K rows this is a ~150KB
 * read that runs in well under a second.
 */
export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return fail("Unauthorized", 401, "UNAUTHORIZED");
  }

  const supabase = createAdminSupabase();

  const [totalRes, realRes, testRes, bgRes, enRes, sourcesRes, peptidesRes] =
    await Promise.all([
      supabase.from("waitlist_subscribers").select("id", { count: "exact", head: true }),
      supabase
        .from("waitlist_subscribers")
        .select("id", { count: "exact", head: true })
        .eq("is_test", false),
      supabase
        .from("waitlist_subscribers")
        .select("id", { count: "exact", head: true })
        .eq("is_test", true),
      supabase
        .from("waitlist_subscribers")
        .select("id", { count: "exact", head: true })
        .eq("is_test", false)
        .eq("locale", "bg"),
      supabase
        .from("waitlist_subscribers")
        .select("id", { count: "exact", head: true })
        .eq("is_test", false)
        .eq("locale", "en"),
      supabase
        .from("waitlist_subscribers")
        .select("source_page")
        .eq("is_test", false)
        .limit(20000),
      supabase
        .from("waitlist_subscribers")
        .select("interested_peptide_slugs")
        .eq("is_test", false)
        .not("interested_peptide_slugs", "is", null)
        .limit(20000),
    ]);

  const errs = [
    totalRes.error,
    realRes.error,
    testRes.error,
    bgRes.error,
    enRes.error,
    sourcesRes.error,
    peptidesRes.error,
  ].filter(Boolean);
  if (errs.length > 0) {
    return fail("Stats failed", 500, "DB_ERROR", errs[0]?.message);
  }

  const bySource: Record<string, number> = {};
  for (const row of sourcesRes.data ?? []) {
    const k = row.source_page ?? "(unknown)";
    bySource[k] = (bySource[k] ?? 0) + 1;
  }
  const topSources = Object.entries(bySource)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const peptideCounts: Record<string, number> = {};
  for (const row of peptidesRes.data ?? []) {
    for (const slug of row.interested_peptide_slugs ?? []) {
      if (!slug) continue;
      peptideCounts[slug] = (peptideCounts[slug] ?? 0) + 1;
    }
  }
  const topPeptides = Object.entries(peptideCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return ok({
    total: totalRes.count ?? 0,
    real: realRes.count ?? 0,
    test: testRes.count ?? 0,
    realByLocale: { bg: bgRes.count ?? 0, en: enRes.count ?? 0 },
    topSources,
    topPeptides,
  });
}
