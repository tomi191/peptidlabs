import type { Metadata } from "next";
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
      canonical: `https://peptidelab.bg/${locale}/shop`,
      languages: { bg: "https://peptidelab.bg/bg/shop", en: "https://peptidelab.bg/en/shop" },
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

  return (
    <main className="w-full">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        {/* Hero Banner */}
        <div className="rounded-2xl bg-surface p-8 md:p-12 mb-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-3">
              {t("title")}
            </h1>
            <p className="text-secondary leading-relaxed">{t("intro")}</p>
            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <FlaskConical size={14} />
                {t("heroHplc")}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} />
                {t("heroCoaIncluded")}
              </span>
              <span className="flex items-center gap-1.5">
                <Truck size={14} />
                {t("heroDelivery")}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile category chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 lg:hidden snap-x">
          <Link
            href="/shop"
            className="shrink-0 snap-center flex items-center gap-1.5 rounded-full border border-navy bg-navy px-4 py-2 text-sm font-semibold text-white"
          >
            <Package size={14} />
            {t("allProducts")}
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
                className="shrink-0 snap-center flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-secondary hover:border-navy hover:text-navy transition-colors"
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
            <div className="sticky top-24 rounded-2xl border border-border p-4">
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
          </aside>

          {/* Product content */}
          <div className="min-w-0 flex-1">
            <SortableProductGrid products={products} locale={locale} />
          </div>
        </div>
      </div>
    </main>
  );
}
