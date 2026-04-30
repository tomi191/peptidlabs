import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
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
  FlaskConical,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getCategoriesWithCounts, getPublishedProducts } from "@/lib/queries";
import { SortableProductGrid } from "@/components/product/SortableProductGrid";
import { ShopFilters } from "@/components/product/ShopFilters";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";
import { TextWithAbbr } from "@/components/ui/TextWithAbbr";
import { PageHero } from "@/components/layout/PageHero";
import { Abbr } from "@/components/ui/Abbr";

function FiltersSkeleton({ mobile = false }: { mobile?: boolean } = {}) {
  if (mobile) {
    return (
      <div className="h-12 rounded-2xl border border-border bg-white animate-pulse" />
    );
  }
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="h-3 w-16 bg-surface rounded mb-4 animate-pulse" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-surface rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-surface rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-surface rounded animate-pulse" />
      </div>
    </div>
  );
}

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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "bg" ? "Магазин — Research пептиди" : "Shop — Research Peptides";
  const description = locale === "bg"
    ? "Купете research пептиди с HPLC верифицирана чистота. BPC-157, Semaglutide, Ipamorelin и още."
    : "Buy HPLC-verified research peptides. BPC-157, Semaglutide, Ipamorelin and more.";
  return {
    title,
    description,
    alternates: {
      canonical: `https://peptidlabs.eu/${locale}/shop`,
      languages: { bg: "https://peptidlabs.eu/bg/shop", en: "https://peptidlabs.eu/en/shop" },
    },
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("shop");
  const [categories, products] = await Promise.all([
    getCategoriesWithCounts(),
    getPublishedProducts(),
  ]);

  const isBg = locale === "bg";

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: isBg ? "Начало" : "Home", path: `/${locale}` },
    { name: t("title"), path: `/${locale}/shop` },
  ]);
  const itemListJsonLd = itemListSchema(
    products.map((p) => ({
      name: p.name,
      url: `/${locale}/products/${p.slug}`,
      price: p.price_eur,
    })),
    isBg ? "Каталог пептиди" : "Peptide catalog"
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
      <PageHero
        crumbs={[{ label: t("title") }]}
        title={t("title")}
        subtitle={t("intro")}
        locale={locale}
        aside={
          <div className="flex items-center gap-5 font-mono text-[11px] text-muted">
            <div className="text-right">
              <p className="uppercase tracking-widest">
                <Abbr term="HPLC" locale={locale} /> над 98%
              </p>
              <p className="mt-1 text-[9px]">
                {isBg ? "верифицирана чистота" : "verified purity"}
              </p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-right">
              <p className="uppercase tracking-widest">{products.length}</p>
              <p className="mt-1 text-[9px]">
                {isBg ? "продукта" : "products"}
              </p>
            </div>
          </div>
        }
      />

      <div className="mx-auto max-w-[1280px] px-6 pb-12">
        {/* Inline trust strip under hero */}
        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <FlaskConical size={14} />
            <TextWithAbbr text={t("heroHplc")} locale={locale} />
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} />
            <TextWithAbbr text={t("heroCoaIncluded")} locale={locale} />
          </span>
          <span className="flex items-center gap-1.5">
            <Truck size={14} />
            {t("heroDelivery")}
          </span>
        </div>

        {/* Mobile category chips — PillNav visual language */}
        <div className="lg:hidden -mx-1 mb-4 overflow-x-auto pb-4 scroll-hidden">
          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-surface/60 p-1 mx-1">
            <Link
              href="/shop"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-1.5 text-sm font-medium text-white"
            >
              <Package size={14} />
              {t("allProducts")}
              <span className="font-mono text-[10px] text-white/70">
                {products.length}
              </span>
            </Link>
            {categories.map((category) => {
              const Icon = category.icon
                ? iconMap[category.icon] ?? Package
                : Package;
              const name =
                locale === "bg" ? category.name_bg : category.name_en;
              return (
                <Link
                  key={category.id}
                  href={`/shop/${category.slug}`}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-secondary hover:text-navy transition-colors"
                >
                  <Icon size={14} />
                  {name}
                  <span className="font-mono text-[10px] text-muted">
                    {category.product_count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block space-y-4">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-border p-4 bg-white">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  {t("categories")}
                </p>
                <nav className="space-y-0.5">
                  <Link
                    href="/shop"
                    className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-navy bg-surface"
                  >
                    <span className="flex items-center gap-2">
                      <Package size={16} />
                      {t("allProducts")}
                    </span>
                    <span className="text-xs text-muted bg-white rounded-full px-2 py-0.5">
                      {products.length}
                    </span>
                  </Link>
                  {categories.map((category) => {
                    const Icon = category.icon
                      ? iconMap[category.icon] ?? Package
                      : Package;
                    const name =
                      locale === "bg" ? category.name_bg : category.name_en;
                    return (
                      <Link
                        key={category.id}
                        href={`/shop/${category.slug}`}
                        className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm text-secondary hover:bg-surface hover:text-navy transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Icon size={16} />
                          {name}
                        </span>
                        <span className="text-xs text-muted bg-surface rounded-full px-2 py-0.5">
                          {category.product_count}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <Suspense fallback={<FiltersSkeleton />}>
                <ShopFilters products={products} layout="sidebar" />
              </Suspense>
            </div>
          </aside>

          {/* Product content */}
          <div className="min-w-0 flex-1">
            <div className="mb-4 lg:hidden">
              <Suspense fallback={<FiltersSkeleton mobile />}>
                <ShopFilters products={products} layout="mobile" />
              </Suspense>
            </div>
            <Suspense fallback={null}>
              <SortableProductGrid products={products} locale={locale} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
