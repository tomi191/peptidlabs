import { SignJWT, jwtVerify } from "jose";

const ADMIN_TOKEN_LIFETIME_SECONDS = 8 * 60 * 60; // 8 hours

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET must be set to a random string of at least 32 characters"
    );
  }
  return new TextEncoder().encode(secret);
}

export type AdminClaims = {
  sub: "admin";
  iat: number;
  exp: number;
};

/** Mint a short-lived admin JWT. */
export async function signAdminToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ sub: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(now + ADMIN_TOKEN_LIFETIME_SECONDS)
    .setIssuer("peptidlabs")
    .setAudience("admin")
    .sign(getSecret());
}

/** Verify a JWT. Returns claims if valid, null otherwise. */
export async function verifyAdminToken(
  token: string | null | undefined
): Promise<AdminClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: "peptidlabs",
      audience: "admin",
    });
    if (payload.sub !== "admin") return null;
    return payload as unknown as AdminClaims;
  } catch {
    return null;
  }
}

/** Extract Bearer token from Authorization header. */
export function extractBearerToken(
  authHeader: string | null | undefined
): string | null {
  if (!authHeader) return null;
  const match = /^Bearer\s+(.+)$/i.exec(authHeader);
  return match?.[1] ?? null;
}
