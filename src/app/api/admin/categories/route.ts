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
    .from("categories")
    .select("id, slug, name_bg, name_en")
    .order("sort_order");

  if (error) {
    return fail("Failed to fetch categories", 500, "DB_ERROR");
  }

  return ok(data ?? []);
}
