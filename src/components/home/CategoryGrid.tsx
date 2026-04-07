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

export function CategoryGrid({
  categories,
  locale,
}: {
  categories: Category[];
  locale: string;
}) {
  const t = useTranslations("categories");

  return (
    <section className="w-full px-6 py-12">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="mb-4 text-lg font-semibold text-navy">{t("title")}</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
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
                className="rounded-lg border border-border bg-surface p-4 transition-colors hover:border-secondary/30"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-white">
                  <Icon size={16} className="text-secondary" />
                </div>
                <p className="text-sm font-semibold text-navy">{name}</p>
                <p className="text-xs text-muted">
                  {locale === "bg" ? "Продукти" : "Products"}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
