import type { NextRequest } from "next/server";
import { ok, fail, parseBody } from "@/lib/api/response";
import { AdminAuthSchema } from "@/lib/api/schemas";

export async function POST(req: NextRequest) {
  const parsed = await parseBody(req, AdminAuthSchema);
  if (!parsed.success) return parsed.response;

  const { password } = parsed.data;

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD environment variable is not set");
    return fail("Admin auth not configured", 500, "CONFIG_MISSING");
  }

  if (password !== adminPassword) {
    return fail("Invalid password", 401, "INVALID_CREDENTIALS");
  }

  const token = `admin-${Date.now()}`;

  return ok({ token });
}
