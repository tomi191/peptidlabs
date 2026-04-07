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
  getCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/queries";
import { createStaticSupabase } from "@/lib/supabase/static";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductCard } from "@/components/product/ProductCard";

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
    getCategories(),
    getProductsByCategory(categorySlug),
  ]);

  if (!category) {
    notFound();
  }

  const categoryName =
    locale === "bg" ? category.name_bg : category.name_en;
  const categoryDescription =
    locale === "bg" ? category.description_bg : category.description_en;

  return (
    <main className="w-full">
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

        <h1 className="mb-2 text-2xl font-bold text-navy">{categoryName}</h1>
        {categoryDescription && (
          <p className="mb-6 text-sm text-secondary">{categoryDescription}</p>
        )}

        {/* Mobile category chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 lg:hidden">
          <Link
            href="/shop"
            className="whitespace-nowrap rounded-full border border-border px-4 py-1.5 text-sm text-secondary hover:text-navy"
          >
            {t("allProducts")}
          </Link>
          {categories.map((cat) => {
            const name = locale === "bg" ? cat.name_bg : cat.name_en;
            const isActive = cat.slug === categorySlug;
            return (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                className={
                  isActive
                    ? "whitespace-nowrap rounded-full border border-navy bg-navy px-4 py-1.5 text-sm font-semibold text-white"
                    : "whitespace-nowrap rounded-full border border-border px-4 py-1.5 text-sm text-secondary hover:text-navy"
                }
              >
                {name}
              </Link>
            );
          })}
        </div>

        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden w-60 shrink-0 lg:block">
            <nav className="space-y-1">
              <Link
                href="/shop"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-secondary hover:text-navy"
              >
                <Package size={16} />
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
                        ? "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-navy"
                        : "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-secondary hover:text-navy"
                    }
                  >
                    <Icon size={16} />
                    {name}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Product content */}
          <div className="min-w-0 flex-1">
            <p className="mb-4 text-sm text-muted">
              {products.length} {t("products")}
            </p>
            {products.length > 0 ? (
              <ProductGrid>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                  />
                ))}
              </ProductGrid>
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
