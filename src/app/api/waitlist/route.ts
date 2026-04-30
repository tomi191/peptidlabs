import type { NextRequest } from "next/server";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ok, fail, parseBody } from "@/lib/api/response";
import { getClientKey, rateLimit } from "@/lib/rate-limit";
import { createHash, randomBytes } from "node:crypto";

const WaitlistSchema = z.object({
  email: z.email("Невалиден имейл").max(255),
  locale: z.enum(["bg", "en"]).default("bg"),
  interestedPeptides: z.array(z.string().max(100)).max(20).default([]),
  source: z.string().max(200).optional(),
  // Honeypot — bots fill hidden inputs; real users leave it empty
  honeypot: z.string().max(0).optional().default(""),
});

export async function POST(req: NextRequest) {
  // Rate limit: 5 signups per IP per hour to prevent abuse
  const clientKey = getClientKey(req);
  const rl = rateLimit(`waitlist:${clientKey}`, 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    return fail("Твърде много опити. Опитайте по-късно.", 429, "RATE_LIMIT");
  }

  const parsed = await parseBody(req, WaitlistSchema);
  if (!parsed.success) return parsed.response;

  const { email, locale, interestedPeptides, source } = parsed.data;
  const ipHash = createHash("sha256").update(clientKey).digest("hex");
  const userAgent = req.headers.get("user-agent")?.slice(0, 500) ?? null;
  const confirmationToken = randomBytes(32).toString("hex");

  const supabase = createAdminSupabase();

  const { error } = await supabase
    .from("waitlist_subscribers")
    .upsert(
      {
        email: email.toLowerCase().trim(),
        locale,
        interested_peptide_slugs: interestedPeptides,
        source_page: source ?? null,
        ip_hash: ipHash,
        user_agent: userAgent,
        confirmation_token: confirmationToken,
      },
      { onConflict: "email", ignoreDuplicates: false }
    );

  if (error) {
    console.error("[waitlist] insert failed:", error);
    return fail("Записът се провали. Моля, опитайте отново.", 500, "DB_ERROR");
  }

  return ok({ subscribed: true });
}
