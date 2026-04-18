/**
 * In-memory per-email rate limit for magic-link requests.
 * 3 requests per hour per normalized email.
 *
 * In-process only (sufficient for a single-region serverless deployment on Vercel
 * where functions are warm-reused). For multi-region / high scale, move to Upstash
 * or the orders.rewards_awarded-style DB-backed counter.
 */

const MAX_REQUESTS = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

type Entry = { count: number; resetAt: number };

const map = new Map<string, Entry>();

// Opportunistic cleanup — avoids unbounded growth without a cron.
function sweep(now: number) {
  if (map.size < 256) return;
  for (const [k, v] of map.entries()) {
    if (v.resetAt < now) map.delete(k);
  }
}

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterSeconds: number };

export function checkMagicLinkRateLimit(email: string): RateLimitResult {
  const key = email.toLowerCase().trim();
  if (!key) return { allowed: true, remaining: MAX_REQUESTS };

  const now = Date.now();
  sweep(now);

  const entry = map.get(key);
  if (!entry || entry.resetAt <= now) {
    map.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}
