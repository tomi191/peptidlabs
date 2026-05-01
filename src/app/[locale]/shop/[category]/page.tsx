import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  Activity,
  Scale,
  Dumbbell,
  Brain,
  Hourglass,
  Flame,
  Scissors,
  Shield,
  Layers,
  Package,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  getCategoriesWithCounts,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/queries";
import { createStaticSupabase } from "@/lib/supabase/static";
import { SortableProductGrid } from "@/components/product/SortableProductGrid";
import { ShopFilters } from "@/components/product/ShopFilters";
import { ShopEditorial } from "@/components/shop/ShopEditorial";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";

// Slugs that get a deep editorial intro (highest-traffic categories per SEO audit).
const EDITORIAL_SLUGS = new Set(["weight-loss", "healing"]);

const iconMap: Record<string, LucideIcon> = {
  activity: Activity,
  scale: Scale,
  dumbbell: Dumbbell,
  brain: Brain,
  hourglass: Hourglass,
  flame: Flame,
  scissors: Scissors,
  shield: Shield,
  layers: Layers,
  package: Package,
};

export async function generateStaticParams() {
  const supabase = createStaticSupabase();
  const { data } = await supabase.from("categories").select("slug");
  const slugs = (data ?? []).map((c) => c.slug);
  return routing.locales.flatMap((locale) =>
    slugs.map((category) => ({ locale, category }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }): Promise<Metadata> {
  const { locale, category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  const name = locale === "bg" ? category.name_bg : category.name_en;
  const desc = locale === "bg" ? category.description_bg : category.description_en;
  return {
    title: `${name} — PeptidLabs`,
    description: desc || `${name} research peptides at PeptidLabs.bg`,
    alternates: {
      canonical: `https://peptidlabs.eu/${locale}/shop/${slug}`,
      languages: { bg: `https://peptidlabs.eu/bg/shop/${slug}`, en: `https://peptidlabs.eu/en/shop/${slug}` },
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category: categorySlug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("shop");

  const [category, categories, products] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getCategoriesWithCounts(),
    getProductsByCategory(categorySlug),
  ]);

  if (!category) {
    notFound();
  }

  const categoryName =
    locale === "bg" ? category.name_bg : category.name_en;
  const categoryDescription =
    locale === "bg" ? category.description_bg : category.description_en;

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: locale === "bg" ? "Начало" : "Home", path: `/${locale}` },
    { name: t("title"), path: `/${locale}/shop` },
    { name: categoryName, path: `/${locale}/shop/${categorySlug}` },
  ]);
  const itemListJsonLd = itemListSchema(
    products.map((p) => ({
      name: p.name,
      url: `/${locale}/products/${p.slug}`,
      price: p.price_eur,
    })),
    categoryName
  );

  return (
    <main className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted">
          <Link href="/" className="text-secondary hover:text-navy">
            {locale === "bg" ? "Начало" : "Home"}
          </Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="text-secondary hover:text-navy">
            {t("title")}
          </Link>
          <ChevronRight size={12} />
          <span className="text-navy">{categoryName}</span>
        </nav>

        {/* Category intro banner */}
        <div className="rounded-2xl bg-surface p-8 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-navy mb-2">
            {categoryName}
          </h1>
          {categoryDescription && (
            <p className="text-secondary leading-relaxed max-w-2xl">
              {categoryDescription}
            </p>
          )}
          <p className="text-sm text-muted mt-3">
            {products.length} {t("productsInCategory")}
          </p>
        </div>

        {/* Deep editorial intro for the SEO-critical categories
            (weight-loss, healing) — humanized prose, indexable. */}
        {EDITORIAL_SLUGS.has(categorySlug) && (
          <ShopEditorial
            intent={categorySlug as "weight-loss" | "healing"}
            locale={locale}
          />
        )}

        {/* Mobile category chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 lg:hidden snap-x">
          <Link
            href="/shop"
            className="shrink-0 snap-center flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-secondary hover:border-navy hover:text-navy transition-colors"
          >
            <Package size={14} />
            {t("allProducts")}
          </Link>
          {categories.map((cat) => {
            const Icon = cat.icon
              ? iconMap[cat.icon] ?? Package
              : Package;
            const name = locale === "bg" ? cat.name_bg : cat.name_en;
            const isActive = cat.slug === categorySlug;
            return (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                className={
                  isActive
                    ? "shrink-0 snap-center flex items-center gap-1.5 rounded-full border border-navy bg-navy px-4 py-2 text-sm font-semibold text-white"
                    : "shrink-0 snap-center flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-secondary hover:border-navy hover:text-navy transition-colors"
                }
              >
                <Icon size={14} />
                {name}
              </Link>
            );
          })}
        </div>

        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-border p-4 bg-white">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  {t("categories")}
                </p>
                <nav className="space-y-0.5">
                  <Link
                    href="/shop"
                    className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm text-secondary hover:bg-surface hover:text-navy transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Package size={16} />
                      {t("allProducts")}
                    </span>
                  </Link>
                  {categories.map((cat) => {
                    const Icon = cat.icon
                      ? iconMap[cat.icon] ?? Package
                      : Package;
                    const name = locale === "bg" ? cat.name_bg : cat.name_en;
                    const isActive = cat.slug === categorySlug;
                    return (
                      <Link
                        key={cat.id}
                        href={`/shop/${cat.slug}`}
                        className={
                          isActive
                            ? "flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-navy bg-surface"
                            : "flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm text-secondary hover:bg-surface hover:text-navy transition-colors"
                        }
                      >
                        <span className="flex items-center gap-2">
                          <Icon size={16} />
                          {name}
                        </span>
                        <span className="text-xs text-muted bg-surface rounded-full px-2 py-0.5">
                          {cat.product_count}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {products.length > 0 && (
                <Suspense fallback={null}>
                  <ShopFilters products={products} layout="sidebar" />
                </Suspense>
              )}
            </div>
          </aside>

          {/* Product content */}
          <div className="min-w-0 flex-1">
            {products.length > 0 ? (
              <>
                <div className="mb-4 lg:hidden">
                  <Suspense fallback={null}>
                    <ShopFilters products={products} layout="mobile" />
                  </Suspense>
                </div>
                <Suspense fallback={null}>
                  <SortableProductGrid products={products} locale={locale} />
                </Suspense>
              </>
            ) : (
              <p className="py-12 text-center text-sm text-muted">
                {t("noProducts")}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
