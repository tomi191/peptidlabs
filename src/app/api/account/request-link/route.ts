import { ok, fail, parseBody } from "@/lib/api/response";
import { AccountLinkRequestSchema } from "@/lib/api/schemas";
import { signAccountToken } from "@/lib/account/token";
import { checkMagicLinkRateLimit } from "@/lib/account/rateLimit";
import { sendMagicLink } from "@/lib/email/send";

export async function POST(request: Request) {
  const parsed = await parseBody(request, AccountLinkRequestSchema);
  if (!parsed.success) return parsed.response;

  const email = parsed.data.email.toLowerCase().trim();
  const locale = parsed.data.locale;

  // Rate limit before any expensive work.
  const rl = checkMagicLinkRateLimit(email);
  if (!rl.allowed) {
    return fail(
      "Too many requests. Please try again later.",
      429,
      "RATE_LIMITED",
      { retryAfterSeconds: rl.retryAfterSeconds }
    );
  }

  // Don't leak whether an email exists: we always respond "ok" when the request
  // is well-formed, and only send an email if it's configured. Return shape is
  // intentionally identical either way.
  if (!process.env.ACCOUNT_LINK_SECRET) {
    console.error(
      "[account] ACCOUNT_LINK_SECRET missing — cannot issue magic links"
    );
    // Still respond success to avoid leaking server state to the client.
    return ok({ sent: true });
  }

  const token = await signAccountToken(email);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://peptidlabs.eu";
  const link = `${siteUrl}/${locale}/account?token=${encodeURIComponent(token)}`;

  // Fire-and-forget: never block the response on email delivery, and never leak
  // delivery errors to the caller (that would reveal whether the email was
  // accepted by the provider).
  sendMagicLink(email, link, locale).catch((err) =>
    console.error("[account] magic link send failed:", err)
  );

  return ok({ sent: true });
}
