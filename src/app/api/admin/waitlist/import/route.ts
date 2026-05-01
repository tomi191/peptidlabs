import type { NextRequest } from "next/server";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ok, fail, parseBody } from "@/lib/api/response";
import { isAdmin } from "@/lib/auth/guard";

export const runtime = "nodejs";
export const maxDuration = 120;

const ImportSchema = z.object({
  rows: z
    .array(
      z.object({
        email: z.string().min(3).max(255),
        locale: z.enum(["bg", "en"]).optional(),
        interestedPeptides: z.array(z.string().max(100)).max(20).optional(),
        source: z.string().max(200).optional(),
        isTest: z.boolean().optional(),
      })
    )
    .min(1)
    .max(10000),
  defaults: z
    .object({
      locale: z.enum(["bg", "en"]).default("bg"),
      source: z.string().max(200).default("admin-import"),
      confirmed: z.boolean().default(true),
      isTest: z.boolean().default(false),
    })
    .default({
      locale: "bg",
      source: "admin-import",
      confirmed: true,
      isTest: false,
    }),
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EXISTS_CHUNK = 500; // Supabase REST URL length limit on .in()
const INSERT_CHUNK = 500;

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return fail("Unauthorized", 401, "UNAUTHORIZED");
  }

  const parsed = await parseBody(req, ImportSchema);
  if (!parsed.success) return parsed.response;

  const { rows, defaults } = parsed.data;

  // 1. Normalize + validate + dedupe within payload
  const seen = new Set<string>();
  const valid: Array<{
    email: string;
    locale: "bg" | "en";
    interested_peptide_slugs: string[];
    source_page: string;
    confirmed: boolean;
    is_test: boolean;
  }> = [];
  const invalid: Array<{ email: string; reason: string }> = [];

  for (const row of rows) {
    const email = row.email.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      invalid.push({ email: row.email, reason: "invalid format" });
      continue;
    }
    if (seen.has(email)) {
      invalid.push({ email, reason: "duplicate in upload" });
      continue;
    }
    seen.add(email);
    valid.push({
      email,
      locale: row.locale ?? defaults.locale,
      interested_peptide_slugs: row.interestedPeptides ?? [],
      source_page: row.source ?? defaults.source,
      confirmed: defaults.confirmed,
      is_test: row.isTest ?? defaults.isTest,
    });
  }

  if (valid.length === 0) {
    return ok({
      imported: 0,
      skipped: 0,
      invalid: invalid.length,
      details: { invalid },
    });
  }

  const supabase = createAdminSupabase();

  // 2. Check which already exist — chunked because Supabase REST .in()
  //    breaks past ~500 items (URL length limit).
  const existingSet = new Set<string>();
  const allEmails = valid.map((r) => r.email);
  for (let i = 0; i < allEmails.length; i += EXISTS_CHUNK) {
    const slice = allEmails.slice(i, i + EXISTS_CHUNK);
    const { data, error } = await supabase
      .from("waitlist_subscribers")
      .select("email")
      .in("email", slice);

    if (error) {
      return fail(
        "Failed to check existing emails",
        500,
        "DB_ERROR",
        error.message
      );
    }
    for (const row of data ?? []) existingSet.add(row.email);
  }

  const toInsert = valid.filter((r) => !existingSet.has(r.email));
  const skipped = valid.length - toInsert.length;

  if (toInsert.length === 0) {
    return ok({
      imported: 0,
      skipped,
      invalid: invalid.length,
      details: { invalid },
    });
  }

  // 3. Bulk insert in chunks
  let imported = 0;
  for (let i = 0; i < toInsert.length; i += INSERT_CHUNK) {
    const slice = toInsert.slice(i, i + INSERT_CHUNK);
    const { error } = await supabase.from("waitlist_subscribers").insert(slice);
    if (error) {
      return fail(
        `Insert failed at batch ${Math.floor(i / INSERT_CHUNK) + 1}: ${error.message}`,
        500,
        "DB_ERROR",
        { imported, skipped, invalid: invalid.length }
      );
    }
    imported += slice.length;
  }

  return ok({
    imported,
    skipped,
    invalid: invalid.length,
    total: rows.length,
    details: invalid.length > 0 ? { invalid: invalid.slice(0, 50) } : undefined,
  });
}
