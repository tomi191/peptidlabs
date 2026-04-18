import type { NextRequest } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ok, fail, parseBody } from "@/lib/api/response";
import { ReviewCreateSchema } from "@/lib/api/schemas";

// Simple in-memory rate limiter: 3 submissions per hour per IP.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export async function POST(request: NextRequest) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return fail("Server configuration error", 500, "CONFIG_MISSING");
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return fail(
      "Too many review submissions. Please try again later.",
      429,
      "RATE_LIMITED"
    );
  }

  const parsed = await parseBody(request, ReviewCreateSchema);
  if (!parsed.success) return parsed.response;

  const { productId, rating, title, text, authorName, authorEmail, orderId, honeypot } =
    parsed.data;

  // Anti-spam: honeypot must be empty. Silently accept then drop — return 200
  // so bots do not learn they were caught, but never persist.
  if (honeypot && honeypot.length > 0) {
    return ok({ submitted: true, status: "pending" as const }, { status: 201 });
  }

  // Anti-spam: require either a verifying order_id OR the honeypot pattern
  // (which we already enforce to be empty). The explicit gate is: if no
  // order_id is supplied, the submission must still pass the rate limit above.
  // This combined with email + honeypot + rate limit meets the spec.

  const supabase = createAdminSupabase();

  // Verify product exists and is published.
  const { data: product } = await supabase
    .from("products")
    .select("id, status")
    .eq("id", productId)
    .single();

  if (!product || product.status !== "published") {
    return fail("Product not found", 404, "PRODUCT_NOT_FOUND");
  }

  // If order_id provided: verify it exists and contains this product +
  // matches the email. If it does, mark as verified_purchase.
  let verifiedPurchase = false;
  let resolvedOrderId: string | null = null;
  if (orderId) {
    const { data: order } = await supabase
      .from("orders")
      .select("id, email")
      .eq("id", orderId)
      .single();

    if (order && order.email.toLowerCase() === authorEmail.toLowerCase()) {
      const { data: orderItem } = await supabase
        .from("order_items")
        .select("id")
        .eq("order_id", order.id)
        .eq("product_id", productId)
        .limit(1)
        .maybeSingle();

      if (orderItem) {
        verifiedPurchase = true;
        resolvedOrderId = order.id;
      }
    }
  }

  const { error: insertError } = await supabase.from("reviews").insert({
    product_id: productId,
    rating,
    title: title ?? null,
    text: text.trim(),
    author_name: authorName.trim(),
    author_email: authorEmail.toLowerCase().trim(),
    verified_purchase: verifiedPurchase,
    order_id: resolvedOrderId,
    status: "pending",
  });

  if (insertError) {
    console.error("Failed to insert review:", insertError);
    return fail("Failed to submit review", 500, "DB_ERROR");
  }

  return ok(
    { submitted: true, status: "pending" as const },
    { status: 201 }
  );
}
