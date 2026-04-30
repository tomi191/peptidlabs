import type { MetadataRoute } from "next";
import { createStaticSupabase } from "@/lib/supabase/static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticSupabase();
  const baseUrl = "https://peptidlabs.eu";

  // Static pages — homepage + key landing pages
  const staticPaths: { path: string; priority: number; freq: "weekly" | "monthly" }[] = [
    { path: "", priority: 1.0, freq: "weekly" },
    { path: "/shop", priority: 0.9, freq: "weekly" },
    { path: "/encyclopedia", priority: 0.8, freq: "weekly" },
    { path: "/what-are-peptides", priority: 0.8, freq: "monthly" },
    { path: "/waitlist", priority: 0.8, freq: "weekly" },
    { path: "/blog", priority: 0.7, freq: "weekly" },
    { path: "/calculator", priority: 0.7, freq: "monthly" },
    { path: "/coa-vault", priority: 0.7, freq: "weekly" },
    { path: "/about", priority: 0.6, freq: "monthly" },
    { path: "/faq", priority: 0.6, freq: "monthly" },
    { path: "/guides/reconstitution", priority: 0.6, freq: "monthly" },
    { path: "/contact", priority: 0.5, freq: "monthly" },
    { path: "/delivery", priority: 0.5, freq: "monthly" },
    { path: "/returns", priority: 0.4, freq: "monthly" },
    { path: "/privacy", priority: 0.3, freq: "monthly" },
    { path: "/terms", priority: 0.3, freq: "monthly" },
    { path: "/cookie-policy", priority: 0.3, freq: "monthly" },
    { path: "/impressum", priority: 0.3, freq: "monthly" },
  ];
  const staticPages = staticPaths.flatMap(({ path, priority, freq }) =>
    ["bg", "en"].map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: freq,
      priority,
    }))
  );

  // Category pages
  const { data: categories } = await supabase
    .from("categories")
    .select("slug");
  const categoryPages = (categories ?? []).flatMap((cat) =>
    ["bg", "en"].map((locale) => ({
      url: `${baseUrl}/${locale}/shop/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  // Product pages
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("status", "published");
  const productPages = (products ?? []).flatMap((p) =>
    ["bg", "en"].map((locale) => ({
      url: `${baseUrl}/${locale}/products/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }))
  );

  // Peptide encyclopedia pages
  const { data: peptides } = await supabase
    .from("peptides")
    .select("slug");
  const peptidePages = (peptides ?? []).flatMap((pep) =>
    ["bg", "en"].map((locale) => ({
      url: `${baseUrl}/${locale}/encyclopedia/${pep.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  // Blog posts
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("status", "published");
  const blogPages = (posts ?? []).flatMap((p) =>
    ["bg", "en"].map((locale) => ({
      url: `${baseUrl}/${locale}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...peptidePages,
    ...blogPages,
  ];
}
