import type { NextRequest } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ok, fail } from "@/lib/api/response";
import { isAdmin } from "@/lib/auth/guard";

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return fail("Unauthorized", 401, "UNAUTHORIZED");
  }

  const supabase = createAdminSupabase();

  const { data, error } = await supabase
    .from("waitlist_subscribers")
    .select(
      "id, email, locale, interested_peptide_slugs, source_page, confirmed, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return fail("Failed to load waitlist", 500, "DB_ERROR");
  }

  return ok({
    subscribers: data ?? [],
    total: data?.length ?? 0,
  });
}
