import type { MetadataRoute } from "next";
import { createStaticSupabase } from "@/lib/supabase/static";

const BASE = "https://peptidlabs.eu";

/**
 * Each sitemap entry exposes BOTH localized URLs via `alternates.languages`
 * (hreflang). Submitted as the `bg` URL canonical, with `en` as the language
 * alternate — Google + Bing read this to deduplicate cross-locale variants.
 */
function withAlternates(path: string) {
  return {
    bg: `${BASE}/bg${path}`,
    en: `${BASE}/en${path}`,
    "x-default": `${BASE}/bg${path}`,
  };
}

function makeEntry(
  path: string,
  priority: number,
  freq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never",
  lastModified: Date = new Date(),
): MetadataRoute.Sitemap[number][] {
  return ["bg", "en"].map((locale) => ({
    url: `${BASE}/${locale}${path}`,
    lastModified,
    changeFrequency: freq,
    priority,
    alternates: { languages: withAlternates(path) },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticSupabase();

  // Static pages — homepage + key landing pages
  const staticPages = [
    { path: "", priority: 1.0, freq: "weekly" as const },
    { path: "/shop", priority: 0.9, freq: "weekly" as const },
    { path: "/encyclopedia", priority: 0.8, freq: "weekly" as const },
    { path: "/what-are-peptides", priority: 0.8, freq: "monthly" as const },
    { path: "/waitlist", priority: 0.8, freq: "weekly" as const },
    { path: "/blog", priority: 0.7, freq: "weekly" as const },
    { path: "/calculator", priority: 0.7, freq: "monthly" as const },
    { path: "/coa-vault", priority: 0.7, freq: "weekly" as const },
    { path: "/about", priority: 0.6, freq: "monthly" as const },
    { path: "/faq", priority: 0.6, freq: "monthly" as const },
    { path: "/guides/reconstitution", priority: 0.6, freq: "monthly" as const },
    { path: "/contact", priority: 0.5, freq: "monthly" as const },
    { path: "/delivery", priority: 0.5, freq: "monthly" as const },
    { path: "/returns", priority: 0.4, freq: "monthly" as const },
    { path: "/privacy", priority: 0.3, freq: "monthly" as const },
    { path: "/terms", priority: 0.3, freq: "monthly" as const },
    { path: "/cookie-policy", priority: 0.3, freq: "monthly" as const },
    { path: "/impressum", priority: 0.3, freq: "monthly" as const },
  ].flatMap(({ path, priority, freq }) => makeEntry(path, priority, freq));

  // Categories
  const { data: categories } = await supabase
    .from("categories")
    .select("slug");
  const categoryPages = (categories ?? []).flatMap((cat) =>
    makeEntry(`/shop/${cat.slug}`, 0.7, "weekly"),
  );

  // Products
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("status", "published");
  const productPages = (products ?? []).flatMap((p) =>
    makeEntry(`/products/${p.slug}`, 0.9, "weekly", new Date(p.updated_at)),
  );

  // Peptide encyclopedia entries
  const { data: peptides } = await supabase.from("peptides").select("slug");
  const peptidePages = (peptides ?? []).flatMap((pep) =>
    makeEntry(`/encyclopedia/${pep.slug}`, 0.6, "monthly"),
  );

  // Blog posts
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("status", "published");
  const blogPages = (posts ?? []).flatMap((p) =>
    makeEntry(`/blog/${p.slug}`, 0.7, "monthly", new Date(p.updated_at)),
  );

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...peptidePages,
    ...blogPages,
  ];
}
