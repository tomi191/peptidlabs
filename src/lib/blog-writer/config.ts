import type { AIModel, LogAdapter } from "./types";

// Model registry — pick from AI_MODELS by key OR pass explicit OpenRouter ID.
export const AI_MODELS: Record<string, AIModel> = {
  gemini_flash_free: {
    id: "google/gemini-2.0-flash-exp:free",
    name: "Gemini 2.0 Flash (free)",
    provider: "Google",
    costPer1M: { input: 0, output: 0 },
    maxTokens: 8192,
    contextWindow: 1_048_576,
    strengths: ["fast", "free", "large-context"],
  },
  gemini_2_5_flash: {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    costPer1M: { input: 0.075, output: 0.3 },
    maxTokens: 8192,
    contextWindow: 1_048_576,
    strengths: ["fast", "high-quality"],
  },
  gemini_image: {
    id: "google/gemini-2.5-flash-image",
    name: "Gemini 2.5 Flash Image",
    provider: "Google",
    costPer1M: { input: 0, output: 0 },
    maxTokens: 8192,
    contextWindow: 1_048_576,
    strengths: ["image-generation", "free"],
  },
  claude_sonnet: {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    costPer1M: { input: 3, output: 15 },
    maxTokens: 8192,
    contextWindow: 200_000,
    strengths: ["best-quality", "accurate", "scientific-writing"],
  },
  claude_opus_4: {
    id: "anthropic/claude-opus-4",
    name: "Claude Opus 4",
    provider: "Anthropic",
    costPer1M: { input: 15, output: 75 },
    maxTokens: 8192,
    contextWindow: 200_000,
    strengths: ["best-quality", "long-form", "reasoning"],
  },
  deepseek_v3: {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek v3",
    provider: "DeepSeek",
    costPer1M: { input: 0.27, output: 1.1 },
    maxTokens: 8192,
    contextWindow: 64_000,
    strengths: ["ultra-cheap", "reliable"],
  },
};

export interface BlogWriterConfig {
  openrouterApiKey: string;
  /** Default model ID for text. Override per call via BlogGeneratorOptions.model. */
  defaultTextModel: string;
  /** Default model ID for cover-image generation. */
  imageModel: string;
  /** Site URL (sent as HTTP-Referer to OpenRouter). */
  siteUrl: string;
  /** Site name (sent as X-Title to OpenRouter). */
  siteName: string;
  logger?: LogAdapter;
}

/**
 * Build a BlogWriterConfig from env vars.
 * Required: OPENROUTER_API_KEY.
 * Optional: BLOG_DEFAULT_MODEL, BLOG_IMAGE_MODEL, NEXT_PUBLIC_SITE_URL.
 */
export function buildConfig(): BlogWriterConfig {
  return {
    openrouterApiKey: process.env.OPENROUTER_API_KEY ?? "",
    defaultTextModel:
      process.env.BLOG_DEFAULT_MODEL ?? "anthropic/claude-3.5-sonnet",
    imageModel:
      process.env.BLOG_IMAGE_MODEL ?? "google/gemini-2.5-flash-image",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://peptidlabs.eu",
    siteName: "PeptidLabs",
    logger: {
      info: (msg, data) => console.log(`[BlogWriter] ${msg}`, data ?? ""),
      warn: (msg, data) => console.warn(`[BlogWriter] ${msg}`, data ?? ""),
      error: (msg, data) => console.error(`[BlogWriter] ${msg}`, data ?? ""),
    },
  };
}

export function getModelById(id: string): AIModel | undefined {
  return Object.values(AI_MODELS).find((m) => m.id === id);
}

export function calculateCost(
  modelId: string,
  promptTokens: number,
  completionTokens: number,
): number {
  const m = getModelById(modelId);
  if (!m) return 0;
  return (
    (promptTokens / 1_000_000) * m.costPer1M.input +
    (completionTokens / 1_000_000) * m.costPer1M.output
  );
}
