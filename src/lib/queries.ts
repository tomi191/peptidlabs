import { createServerSupabase } from "./supabase/server";
import type { Product, Category, Peptide } from "./types";

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
