/**
 * Minimal in-memory rate limiter — sliding window per key.
 * Works on a single serverless instance; for multi-instance deploys
 * swap the backing store for Upstash/Redis (same interface).
 */

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

/**
 * @param key      unique identifier (IP+route, email, etc.)
 * @param limit    max requests in the window
 * @param windowMs size of the sliding window in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/** Convenience: extract the best-guess client identifier from a Request. */
export function getClientKey(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
