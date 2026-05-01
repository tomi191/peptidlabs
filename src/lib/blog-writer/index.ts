/**
 * PeptidLabs blog-writer — public API surface.
 *
 * Usage from a server action:
 *   import { generateBlogPost, buildConfig, saveBlogDraft, logAIUsage } from "@/lib/blog-writer";
 *   const config = buildConfig();
 *   const result = await generateBlogPost(config, { topic, keywords, ... });
 *   const { id, slug } = await saveBlogDraft(result);
 *   await logAIUsage(config, { feature: "blog-generation", model: result._modelUsed, ... });
 */

export { buildConfig, AI_MODELS, getModelById, calculateCost } from "./config";
export type { BlogWriterConfig } from "./config";

export { generateBlogPost } from "./blog-generator";
export type { BlogGeneratorOptions } from "./blog-generator";

export {
  saveBlogDraft,
  publishBlogPost,
  unpublishBlogPost,
  deleteBlogPost,
  updateBlogPost,
  logAIUsage,
} from "./db-adapter";

export type {
  BlogGenerationParams,
  BlogGenerationResult,
  ContentType,
  AIModel,
} from "./types";
