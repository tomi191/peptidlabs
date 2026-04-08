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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getCategories, getPublishedProducts } from "@/lib/queries";
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

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("shop");
  const [categories, products] = await Promise.all([
    getCategories(),
    getPublishedProducts(),
  ]);

  return (
    <main className="w-full">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <h1 className="mb-6 text-2xl font-bold text-navy">{t("title")}</h1>

        {/* Mobile category chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 lg:hidden">
          <Link
            href="/shop"
            className="whitespace-nowrap rounded-full border border-navy bg-navy px-4 py-1.5 text-sm font-semibold text-white"
          >
            {t("allProducts")}
          </Link>
          {categories.map((category) => {
            const name =
              locale === "bg" ? category.name_bg : category.name_en;
            return (
              <Link
                key={category.id}
                href={`/shop/${category.slug}`}
                className="whitespace-nowrap rounded-full border border-border px-4 py-1.5 text-sm text-secondary hover:text-navy"
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
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-navy"
              >
                <Package size={16} />
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
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-secondary hover:text-navy"
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
            <SortableProductGrid products={products} locale={locale} />
          </div>
        </div>
      </div>
    </main>
  );
}
