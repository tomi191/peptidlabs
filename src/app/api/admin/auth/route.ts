import type { NextRequest } from "next/server";
import { ok, fail, parseBody } from "@/lib/api/response";
import { AdminAuthSchema } from "@/lib/api/schemas";
import { signAdminToken } from "@/lib/auth/jwt";
import { verifyAdminPassword } from "@/lib/auth/password";
import { getClientKey, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Brute-force protection: 5 attempts per 5 minutes per IP
  const key = `admin-auth:${getClientKey(req)}`;
  const rl = rateLimit(key, 5, 5 * 60 * 1000);
  if (!rl.allowed) {
    return fail("Too many attempts. Try again later.", 429, "RATE_LIMIT");
  }

  const parsed = await parseBody(req, AdminAuthSchema);
  if (!parsed.success) return parsed.response;

  if (!process.env.JWT_SECRET) {
    console.error("[auth] JWT_SECRET is not configured");
    return fail("Admin auth not configured", 500, "CONFIG_MISSING");
  }

  const ok_ = await verifyAdminPassword(parsed.data.password);
  if (!ok_) {
    return fail("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  const token = await signAdminToken();
  // 8h lifetime matches the JWT exp in signAdminToken.
  return ok({ token, expiresIn: 8 * 60 * 60 });
}
