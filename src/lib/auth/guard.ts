import type { NextRequest } from "next/server";
import { extractBearerToken, verifyAdminToken } from "./jwt";

/**
 * Returns true if the request carries a valid, non-expired admin JWT.
 * Replacement for the legacy `token.startsWith("admin-")` check.
 */
export async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = extractBearerToken(req.headers.get("authorization"));
  const claims = await verifyAdminToken(token);
  return claims !== null;
}
