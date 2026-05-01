import type { NextRequest } from "next/server";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ok, fail, parseBody } from "@/lib/api/response";
import { isAdmin } from "@/lib/auth/guard";

const PAGE_SIZE_DEFAULT = 100;
const PAGE_SIZE_MAX = 500;

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return fail("Unauthorized", 401, "UNAUTHORIZED");
  }

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const pageSizeRaw = parseInt(
    url.searchParams.get("pageSize") ?? String(PAGE_SIZE_DEFAULT),
    10
  );
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(10, Number.isFinite(pageSizeRaw) ? pageSizeRaw : PAGE_SIZE_DEFAULT)
  );
  const filter = url.searchParams.get("filter") ?? "all"; // all | real | test
  const search = (url.searchParams.get("search") ?? "").trim();

  const supabase = createAdminSupabase();

  let q = supabase
    .from("waitlist_subscribers")
    .select(
      "id, email, locale, interested_peptide_slugs, source_page, confirmed, is_test, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (filter === "real") q = q.eq("is_test", false);
  else if (filter === "test") q = q.eq("is_test", true);

  if (search.length > 0) {
    // Sanitize ilike wildcards from user input
    const safe = search.replace(/[%_\\]/g, (c) => `\\${c}`);
    q = q.ilike("email", `%${safe}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  q = q.range(from, to);

  const { data, count, error } = await q;
  if (error) {
    return fail("Failed to load waitlist", 500, "DB_ERROR", error.message);
  }

  return ok({
    subscribers: data ?? [],
    pagination: {
      page,
      pageSize,
      total: count ?? 0,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
    },
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
