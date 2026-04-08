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
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Category } from "@/lib/types";

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

const countMap: Record<string, number> = {
  healing: 6,
  "weight-loss": 8,
  "gh-muscle": 11,
  "anti-aging": 7,
  nootropic: 6,
  "sexual-health": 4,
  "hair-growth": 3,
  immune: 3,
  blends: 4,
  accessories: 7,
};

export function CategoryGrid({
  categories,
  locale,
}: {
  categories: Category[];
  locale: string;
}) {
  const t = useTranslations("categories");

  return (
    <section className="w-full px-6 py-16">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="mb-4 text-center text-2xl font-bold text-navy md:text-3xl">
          {t("title")}
        </h2>
        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="mt-8 flex gap-3 overflow-x-auto pb-4 scroll-hidden snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
          {categories.map((category) => {
            const Icon = category.icon
              ? iconMap[category.icon] ?? Package
              : Package;
            const name =
              locale === "bg" ? category.name_bg : category.name_en;
            const count = countMap[category.slug] ?? 0;

            return (
              <Link
                key={category.id}
                href={`/shop/${category.slug}`}
                className="group shrink-0 snap-center rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-navy/20 w-40 lg:w-auto"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                  <Icon size={18} className="text-secondary" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold text-navy">{name}</p>
                {count > 0 && (
                  <p className="mt-1 text-xs text-muted">
                    {count} {locale === "bg" ? "продукта" : "products"}
                  </p>
                )}
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  {locale === "bg" ? "Виж" : "View"}
                  <ArrowRight size={12} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
