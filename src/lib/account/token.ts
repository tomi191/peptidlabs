/**
 * Signed magic-link tokens for the email-based account area.
 *
 * Format: base64url(JSON payload) + "." + base64url(HMAC-SHA256(payload, secret))
 * Payload: { email, exp }
 *
 * No PII in the URL path — the email stays inside the signed payload.
 * Short-lived (30 min). No sessions, no cookies.
 */

const ENCODER = new TextEncoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 =
    typeof btoa === "function"
      ? btoa(binary)
      : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  const normalized = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary =
    typeof atob === "function"
      ? atob(padded)
      : Buffer.from(padded, "base64").toString("binary");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    ENCODER.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function getSecret(): string {
  const secret = process.env.ACCOUNT_LINK_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ACCOUNT_LINK_SECRET is missing or too short (need >= 16 chars)"
    );
  }
  return secret;
}

// Constant-time comparison to avoid timing attacks on the signature.
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a[i] ^ b[i];
  return result === 0;
}

export type AccountTokenPayload = {
  email: string;
  exp: number; // unix seconds
};

const DEFAULT_TTL_SECONDS = 30 * 60; // 30 minutes

export async function signAccountToken(
  email: string,
  ttlSeconds = DEFAULT_TTL_SECONDS
): Promise<string> {
  const payload: AccountTokenPayload = {
    email: email.toLowerCase().trim(),
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const payloadJson = JSON.stringify(payload);
  const payloadBytes = ENCODER.encode(payloadJson);
  const payloadPart = base64UrlEncode(payloadBytes);

  const key = await getKey(getSecret());
  const sigBuf = await crypto.subtle.sign("HMAC", key, payloadBytes as BufferSource);
  const sigPart = base64UrlEncode(new Uint8Array(sigBuf));

  return `${payloadPart}.${sigPart}`;
}

export type VerifyResult =
  | { valid: true; email: string; exp: number }
  | { valid: false; reason: "malformed" | "invalid_signature" | "expired" };

export async function verifyAccountToken(token: string): Promise<VerifyResult> {
  if (!token || typeof token !== "string") {
    return { valid: false, reason: "malformed" };
  }
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false, reason: "malformed" };
  const [payloadPart, sigPart] = parts;

  let payloadBytes: Uint8Array;
  let sigBytes: Uint8Array;
  try {
    payloadBytes = base64UrlDecode(payloadPart);
    sigBytes = base64UrlDecode(sigPart);
  } catch {
    return { valid: false, reason: "malformed" };
  }

  let key: CryptoKey;
  try {
    key = await getKey(getSecret());
  } catch {
    return { valid: false, reason: "malformed" };
  }

  // Recompute and compare (avoids platform quirks of crypto.subtle.verify).
  const expectedBuf = await crypto.subtle.sign("HMAC", key, payloadBytes as BufferSource);
  const expectedBytes = new Uint8Array(expectedBuf);
  if (!timingSafeEqual(sigBytes, expectedBytes)) {
    return { valid: false, reason: "invalid_signature" };
  }

  let payload: AccountTokenPayload;
  try {
    const json = new TextDecoder().decode(payloadBytes);
    payload = JSON.parse(json);
  } catch {
    return { valid: false, reason: "malformed" };
  }

  if (
    !payload ||
    typeof payload.email !== "string" ||
    typeof payload.exp !== "number"
  ) {
    return { valid: false, reason: "malformed" };
  }

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return { valid: false, reason: "expired" };
  }

  return { valid: true, email: payload.email, exp: payload.exp };
}
