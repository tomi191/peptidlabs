/**
 * Custom Supabase database adapter that maps blog-writer output to OUR
 * bilingual blog_posts schema and logs AI usage to ai_usage_logs.
 *
 * Our blog_posts columns:
 *   id (uuid), slug, title_bg, title_en, content_bg, content_en, tags,
 *   published_at, status ('draft' | 'published'), author, created_at, updated_at
 *
 * The kit's pipeline returns BlogGenerationResult with bilingual fields;
 * this adapter inserts a row in 'draft' status by default and the
 * publishBlogPost() helper flips it to 'published' + sets published_at.
 */

import { createAdminSupabase } from "@/lib/supabase/admin";
import type { BlogGenerationResult } from "./types";
import type { BlogWriterConfig } from "./config";
import { calculateCost } from "./config";

export interface SaveBlogDraftResult {
  id: string;
  slug: string;
}

/** Insert a new blog post as draft. Returns the new row's id and slug. */
export async function saveBlogDraft(
  result: BlogGenerationResult,
  meta: {
    author?: string;
    /** If the slug is taken, append a numeric suffix. */
    forceUniqueSlug?: boolean;
  } = {},
): Promise<SaveBlogDraftResult> {
  const sb = createAdminSupabase();
  let slug = result.suggestedSlug;

  if (meta.forceUniqueSlug !== false) {
    let suffix = 0;
    while (true) {
      const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
      const { data: existing } = await sb
        .from("blog_posts")
        .select("id")
        .eq("slug", candidate)
        .maybeSingle();
      if (!existing) {
        slug = candidate;
        break;
      }
      suffix++;
      if (suffix > 50) throw new Error("Could not find unique slug");
    }
  }

  const { data, error } = await sb
    .from("blog_posts")
    .insert({
      slug,
      title_bg: result.title_bg,
      title_en: result.title_en,
      content_bg: result.content_bg,
      content_en: result.content_en,
      tags: result.tags,
      status: "draft",
      author: meta.author ?? "PeptidLabs Editorial",
    })
    .select("id, slug")
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to save blog draft: ${error?.message ?? "no row returned"}`,
    );
  }

  return { id: data.id as string, slug: data.slug as string };
}

/** Flip a post from draft to published, sets published_at. */
export async function publishBlogPost(id: string): Promise<void> {
  const sb = createAdminSupabase();
  const { error } = await sb
    .from("blog_posts")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(`Failed to publish: ${error.message}`);
}

/** Move a post back to draft (unpublish). Keeps content. */
export async function unpublishBlogPost(id: string): Promise<void> {
  const sb = createAdminSupabase();
  const { error } = await sb
    .from("blog_posts")
    .update({
      status: "draft",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(`Failed to unpublish: ${error.message}`);
}

/** Permanently delete a blog post. */
export async function deleteBlogPost(id: string): Promise<void> {
  const sb = createAdminSupabase();
  const { error } = await sb.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete: ${error.message}`);
}

/** Update body fields for an existing post (manual edits after generation). */
export async function updateBlogPost(
  id: string,
  patch: Partial<{
    title_bg: string;
    title_en: string;
    content_bg: string;
    content_en: string;
    tags: string[];
    slug: string;
  }>,
): Promise<void> {
  const sb = createAdminSupabase();
  const { error } = await sb
    .from("blog_posts")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(`Failed to update: ${error.message}`);
}

/** Log an AI usage event to ai_usage_logs for cost tracking. */
export async function logAIUsage(
  config: BlogWriterConfig,
  params: {
    feature: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  const costUSD = calculateCost(
    params.model,
    params.promptTokens,
    params.completionTokens,
  );

  const sb = createAdminSupabase();
  const { error } = await sb.from("ai_usage_logs").insert({
    feature: params.feature,
    model: params.model,
    prompt_tokens: params.promptTokens,
    completion_tokens: params.completionTokens,
    cost_usd: costUSD,
    metadata: params.metadata ?? null,
  });

  if (error) {
    config.logger?.warn("Failed to log AI usage", { error: error.message });
  } else {
    config.logger?.info(
      `AI usage logged: ${params.feature} | ${params.model} | $${costUSD.toFixed(6)}`,
    );
  }
}
