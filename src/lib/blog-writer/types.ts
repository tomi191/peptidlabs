/**
 * PeptidLabs Blog Writer — types
 *
 * Adapted from the imported blog-writer kit for our bilingual schema:
 * blog_posts has title_bg/title_en + content_bg/content_en columns,
 * not the kit's single-language title/content.
 */

export type ContentType = "tofu" | "mofu" | "bofu" | "advertorial";

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  costPer1M: { input: number; output: number };
  maxTokens: number;
  contextWindow: number;
  strengths: string[];
}

export interface BlogGenerationParams {
  topic: string;
  /** SEO target keywords. First one = primary. */
  keywords: string[];
  contentType: ContentType;
  /** Free-form category label (e.g. "weight-loss"). Stored as the first tag. */
  category: string;
  /** Word count target PER LANGUAGE. */
  targetWordCount: number;
  /** Optional pre-prompt context (e.g. web search results). */
  extraContext?: string;
}

/** Bilingual generation output — stored in our blog_posts schema. */
export interface BlogGenerationResult {
  /** BG title (primary). */
  title_bg: string;
  /** EN title (faithful translation, not a separate piece). */
  title_en: string;
  /** Markdown body in BG. Content rules: flowing prose, named researchers, real PubMed numbers. */
  content_bg: string;
  /** Markdown body in EN. */
  content_en: string;
  /** Short ~160 char SEO description (BG). */
  metaDescription_bg: string;
  metaDescription_en: string;
  /** Card excerpt (BG, ~200 chars). */
  excerpt_bg: string;
  excerpt_en: string;
  /** SEO tags (lowercase, slugified). */
  tags: string[];
  /** Suggested URL slug — Cyrillic→Latin transliteration of title. */
  suggestedSlug: string;
  /** Word count BG. */
  wordCount_bg: number;
  /** Word count EN. */
  wordCount_en: number;
  /** Reading time in minutes (BG, used for display). */
  readingTime: number;
}

export interface AIUsageLog {
  feature: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  costUSD: number;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export interface LogAdapter {
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, data?: Record<string, unknown>): void;
}
