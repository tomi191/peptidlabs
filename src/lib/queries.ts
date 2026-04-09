import { createServerSupabase } from "./supabase/server";
import type { Product, Category, Peptide, BlogPost } from "./types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return (data as Category[]) ?? [];
}

export async function getBestsellers(): Promise<Product[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .eq("is_bestseller", true)
    .order("created_at", { ascending: false })
    .limit(6);
  return (data as Product[]) ?? [];
}

export async function getPublishedProducts(): Promise<Product[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("name");
  return (data as Product[]) ?? [];
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data as Product | null;
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const supabase = await createServerSupabase();
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();
  if (!category) return [];

  const { data } = await supabase
    .from("product_categories")
    .select("product_id")
    .eq("category_id", category.id);

  if (!data || data.length === 0) return [];

  const productIds = data.map((row) => row.product_id);
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds)
    .eq("status", "published")
    .order("name");

  return (products as Product[]) ?? [];
}

export async function getCategoriesWithCounts(): Promise<
  (Category & { product_count: number })[]
> {
  const supabase = await createServerSupabase();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  if (!categories || categories.length === 0) return [];

  const { data: links } = await supabase
    .from("product_categories")
    .select("category_id, product_id");

  // Count published products per category
  const { data: publishedProducts } = await supabase
    .from("products")
    .select("id")
    .eq("status", "published");

  const publishedIds = new Set((publishedProducts ?? []).map((p) => p.id));

  const countMap: Record<string, number> = {};
  for (const link of links ?? []) {
    if (publishedIds.has(link.product_id)) {
      countMap[link.category_id] = (countMap[link.category_id] ?? 0) + 1;
    }
  }

  return (categories as Category[]).map((cat) => ({
    ...cat,
    product_count: countMap[cat.id] ?? 0,
  }));
}

export async function getPeptides(): Promise<Peptide[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("peptides")
    .select("*")
    .order("name");
  return (data as Peptide[]) ?? [];
}

export async function getPeptideBySlug(
  slug: string
): Promise<Peptide | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("peptides")
    .select("*")
    .eq("slug", slug)
    .single();
  return data as Peptide | null;
}

export async function getProductsForPeptide(
  peptideSlug: string
): Promise<Product[]> {
  const supabase = await createServerSupabase();
  const { data: peptide } = await supabase
    .from("peptides")
    .select("id")
    .eq("slug", peptideSlug)
    .single();
  if (!peptide) return [];

  const { data: links } = await supabase
    .from("product_peptides")
    .select("product_id")
    .eq("peptide_id", peptide.id);

  if (!links || links.length === 0) return [];

  const productIds = links.map((row) => row.product_id);
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds)
    .eq("status", "published");

  return (products as Product[]) ?? [];
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  return data as Category | null;
}

export async function getRelatedProducts(
  productId: string,
  limit = 4
): Promise<Product[]> {
  const supabase = await createServerSupabase();

  // Find category IDs for this product
  const { data: links } = await supabase
    .from("product_categories")
    .select("category_id")
    .eq("product_id", productId);

  if (!links || links.length === 0) {
    // Fallback: return other published products
    const { data: fallback } = await supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .neq("id", productId)
      .limit(limit);
    return (fallback as Product[]) ?? [];
  }

  const categoryIds = links.map((l) => l.category_id);

  // Find other product IDs in the same categories
  const { data: siblingLinks } = await supabase
    .from("product_categories")
    .select("product_id")
    .in("category_id", categoryIds)
    .neq("product_id", productId);

  if (!siblingLinks || siblingLinks.length === 0) {
    const { data: fallback } = await supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .neq("id", productId)
      .limit(limit);
    return (fallback as Product[]) ?? [];
  }

  const uniqueIds = [...new Set(siblingLinks.map((l) => l.product_id))];

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in("id", uniqueIds)
    .eq("status", "published")
    .limit(limit);

  return (products as Product[]) ?? [];
}

export async function getSiblingProducts(
  productName: string,
  currentSlug: string
): Promise<Product[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("name", productName)
    .neq("slug", currentSlug)
    .eq("status", "published")
    .order("vial_size_mg");
  return (data as Product[]) ?? [];
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return (data as BlogPost[]) ?? [];
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data as BlogPost | null;
}

export async function getBlogPostProducts(
  postId: string
): Promise<Product[]> {
  const supabase = await createServerSupabase();
  const { data: links } = await supabase
    .from("blog_post_products")
    .select("product_id")
    .eq("blog_post_id", postId);

  if (!links || links.length === 0) return [];

  const productIds = links.map((row) => row.product_id);
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds)
    .eq("status", "published");

  return (products as Product[]) ?? [];
}

export async function getProductCategory(
  productId: string
): Promise<Category | null> {
  const supabase = await createServerSupabase();
  const { data: link } = await supabase
    .from("product_categories")
    .select("category_id")
    .eq("product_id", productId)
    .limit(1)
    .single();

  if (!link) return null;

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", link.category_id)
    .single();

  return category as Category | null;
}
