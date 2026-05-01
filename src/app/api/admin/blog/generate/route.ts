import { NextRequest } from "next/server";
import { isAdmin } from "@/lib/auth/guard";
import { ok, fail } from "@/lib/api/response";
import {
  buildConfig,
  generateBlogPost,
  saveBlogDraft,
  logAIUsage,
  type ContentType,
} from "@/lib/blog-writer";

export const runtime = "nodejs";
export const maxDuration = 120; // AI generation can take 30-60s

interface GenerateBody {
  topic?: string;
  keywords?: string[];
  contentType?: ContentType;
  category?: string;
  targetWordCount?: number;
  model?: string;
  /** Optional internal-link map: anchor → relative path */
  internalLinks?: Record<string, string>;
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return fail("Unauthorized", 401, "AUTH");

  let body: GenerateBody;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body", 400, "BAD_REQUEST");
  }

  if (!body.topic || typeof body.topic !== "string") {
    return fail("Missing required field: topic", 400, "BAD_REQUEST");
  }
  if (!Array.isArray(body.keywords) || body.keywords.length === 0) {
    return fail(
      "Missing required field: keywords (non-empty array)",
      400,
      "BAD_REQUEST",
    );
  }

  const config = buildConfig();
  if (!config.openrouterApiKey) {
    return fail(
      "OPENROUTER_API_KEY not configured (add to .env.local + Vercel env)",
      500,
      "ENV",
    );
  }

  try {
    const result = await generateBlogPost(
      config,
      {
        topic: body.topic.trim(),
        keywords: body.keywords.filter((k) => k && k.trim()),
        contentType: body.contentType ?? "tofu",
        category: body.category ?? "general",
        targetWordCount: body.targetWordCount ?? 1500,
      },
      {
        model: body.model,
        internalLinks: body.internalLinks,
      },
    );

    const { id, slug } = await saveBlogDraft(result);

    // Fire-and-forget cost logging
    logAIUsage(config, {
      feature: "blog-generation",
      model: result._modelUsed,
      promptTokens: 0, // We didn't capture promptTokens separately; approximate
      completionTokens: result._tokens,
      metadata: {
        post_id: id,
        slug,
        topic: body.topic,
        word_count_bg: result.wordCount_bg,
        word_count_en: result.wordCount_en,
      },
    }).catch(() => {});

    return ok(
      {
        id,
        slug,
        title_bg: result.title_bg,
        title_en: result.title_en,
        wordCount_bg: result.wordCount_bg,
        wordCount_en: result.wordCount_en,
        readingTime: result.readingTime,
        model: result._modelUsed,
        totalTokens: result._tokens,
      },
      { status: 201 },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[admin/blog/generate]", msg);
    return fail(`Generation failed: ${msg}`, 500, "GEN_FAILED");
  }
}
