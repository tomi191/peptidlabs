import type { NextRequest } from "next/server";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ok, fail, parseBody } from "@/lib/api/response";
import { isAdmin } from "@/lib/auth/guard";

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return fail("Unauthorized", 401, "UNAUTHORIZED");
  }

  const supabase = createAdminSupabase();

  const { data, error } = await supabase
    .from("waitlist_subscribers")
    .select(
      "id, email, locale, interested_peptide_slugs, source_page, confirmed, is_test, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) {
    return fail("Failed to load waitlist", 500, "DB_ERROR");
  }

  return ok({
    subscribers: data ?? [],
    total: data?.length ?? 0,
  });
}

const PatchSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(2000).optional(),
  emails: z.array(z.string().email()).min(1).max(2000).optional(),
  isTest: z.boolean(),
});

const PATCH_CHUNK = 500;

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return fail("Unauthorized", 401, "UNAUTHORIZED");
  }

  const parsed = await parseBody(req, PatchSchema);
  if (!parsed.success) return parsed.response;

  const { ids, emails, isTest } = parsed.data;
  if (!ids && !emails) {
    return fail("Provide either ids[] or emails[]", 400, "BAD_REQUEST");
  }

  const supabase = createAdminSupabase();
  const targets = ids ?? emails!;
  const column = ids ? "id" : "email";

  let updated = 0;
  for (let i = 0; i < targets.length; i += PATCH_CHUNK) {
    const slice = targets.slice(i, i + PATCH_CHUNK);
    const { data, error } = await supabase
      .from("waitlist_subscribers")
      .update({ is_test: isTest })
      .in(column, slice)
      .select("id");

    if (error) {
      return fail(error.message, 500, "DB_ERROR", { updated });
    }
    updated += data?.length ?? 0;
  }

  return ok({ updated, isTest });
}

const DeleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(2000),
});

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return fail("Unauthorized", 401, "UNAUTHORIZED");
  }

  const parsed = await parseBody(req, DeleteSchema);
  if (!parsed.success) return parsed.response;

  const supabase = createAdminSupabase();
  const { ids } = parsed.data;

  let deleted = 0;
  for (let i = 0; i < ids.length; i += PATCH_CHUNK) {
    const slice = ids.slice(i, i + PATCH_CHUNK);
    const { data, error } = await supabase
      .from("waitlist_subscribers")
      .delete()
      .in("id", slice)
      .select("id");

    if (error) {
      return fail(error.message, 500, "DB_ERROR", { deleted });
    }
    deleted += data?.length ?? 0;
  }

  return ok({ deleted });
}
