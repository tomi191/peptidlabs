import type { BlogWriterConfig } from "./config";
import type {
  BlogGenerationParams,
  BlogGenerationResult,
} from "./types";
import { complete } from "./openrouter";
import { buildBlogPrompt } from "./prompts";
import { parseJSONResponse } from "./response-parser";
import {
  generateSlug,
  calculateReadingTime,
  calculateWordCount,
} from "./slug";

export interface BlogGeneratorOptions {
  /** Override the model for this generation (rare). */
  model?: string;
  /** Custom system prompt; defaults to PeptidLabs voice. */
  systemPrompt?: string;
  /** Internal link map: anchor text → relative path. */
  internalLinks?: Record<string, string>;
  /** AI temperature 0..1. Default 0.7 for science writing. */
  temperature?: number;
  /** Max tokens for AI response. Default 12000 (handles 2x ~3500-word bilingual output). */
  maxTokens?: number;
}

/**
 * Generate a bilingual (BG + EN) PeptidLabs blog post in one AI call.
 * The prompt instructs the model to return BOTH languages in a single JSON.
 * Cheaper than two calls, and ensures the EN is a faithful translation
 * (same numbers, same names, same structure) rather than a separate piece.
 */
export async function generateBlogPost(
  config: BlogWriterConfig,
  params: BlogGenerationParams,
  options: BlogGeneratorOptions = {},
): Promise<BlogGenerationResult & { _modelUsed: string; _tokens: number }> {
  const log = config.logger;
  log?.info("Generating bilingual blog post", {
    topic: params.topic,
    targetWordCount: params.targetWordCount,
  });

  const userPrompt = buildBlogPrompt({
    topic: params.topic,
    keywords: params.keywords,
    contentType: params.contentType,
    category: params.category,
    targetWordCount: params.targetWordCount,
    systemPrompt: options.systemPrompt,
    internalLinks: options.internalLinks,
  });

  const fullPrompt = params.extraContext
    ? `${params.extraContext}\n\n${userPrompt}`
    : userPrompt;

  const completion = await complete(config, {
    messages: [{ role: "user", content: fullPrompt }],
    model: options.model,
    temperature: options.temperature ?? 0.7,
    maxTokens: options.maxTokens ?? 12000,
  });

  log?.info("AI response received", {
    model: completion.model,
    totalTokens: completion.usage.totalTokens,
  });

  const parsed = parseJSONResponse<{
    title_bg: string;
    title_en: string;
    content_bg: string;
    content_en: string;
    metaDescription_bg: string;
    metaDescription_en: string;
    excerpt_bg: string;
    excerpt_en: string;
    tags: string[];
  }>(completion.content, ["title_bg", "title_en", "content_bg", "content_en"]);

  const wordCount_bg = calculateWordCount(parsed.content_bg);
  const wordCount_en = calculateWordCount(parsed.content_en);
  const readingTime = calculateReadingTime(parsed.content_bg);
  const suggestedSlug = generateSlug(parsed.title_bg);

  return {
    title_bg: parsed.title_bg,
    title_en: parsed.title_en,
    content_bg: parsed.content_bg,
    content_en: parsed.content_en,
    metaDescription_bg:
      parsed.metaDescription_bg || parsed.excerpt_bg || parsed.title_bg,
    metaDescription_en:
      parsed.metaDescription_en || parsed.excerpt_en || parsed.title_en,
    excerpt_bg: parsed.excerpt_bg || parsed.metaDescription_bg || "",
    excerpt_en: parsed.excerpt_en || parsed.metaDescription_en || "",
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    suggestedSlug,
    wordCount_bg,
    wordCount_en,
    readingTime,
    _modelUsed: completion.model,
    _tokens: completion.usage.totalTokens,
  };
}
