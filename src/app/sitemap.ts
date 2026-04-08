import type { MetadataRoute } from "next";
import { createStaticSupabase } from "@/lib/supabase/static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticSupabase();
  const baseUrl = "https://peptidelab.bg";

  // Static pages
  const staticPages = ["", "/shop"].flatMap((path) =>
    ["bg", "en"].map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1.0 : 0.8,
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

  // Peptide encyclopedia pages (for future)
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

  return [...staticPages, ...categoryPages, ...productPages, ...peptidePages];
}
