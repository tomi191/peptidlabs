import { createServerSupabase } from "@/lib/supabase/server";
import { ok, fail, parseBody } from "@/lib/api/response";
import { NewsletterSchema } from "@/lib/api/schemas";

export async function POST(request: Request) {
  const parsed = await parseBody(request, NewsletterSchema);
  if (!parsed.success) return parsed.response;

  const { email } = parsed.data;

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email: email.toLowerCase().trim() }, { onConflict: "email" });

  if (error) {
    console.error("Newsletter subscribe error:", error);
    return fail("Failed to subscribe", 500, "DB_ERROR");
  }

  return ok({ subscribed: true });
}
