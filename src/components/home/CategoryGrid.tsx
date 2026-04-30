"use client";

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
import { CategoryTransformation } from "@/components/home/CategoryTransformation";
import type { Category } from "@/lib/types";
import { motion } from "motion/react";

type CategoryWithCount = Category & { product_count?: number };

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


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

const MotionLink = motion.create(Link);

export function CategoryGrid({
  categories,
  locale,
}: {
  categories: CategoryWithCount[];
  locale: string;
}) {
  const t = useTranslations("categories");

  return (
    <section className="w-full px-6 py-16 overflow-hidden">
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="mb-4 text-center text-2xl font-bold text-navy md:text-3xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted">
            {locale === "bg"
              ? "Изберете категория според целта на изследването. Посочете карта, за да видите как пептидите трансформират."
              : "Pick a category by your research goal. Hover a card to see how peptides transform."}
          </p>
        </motion.div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <motion.div
          className="mt-8 flex gap-3 overflow-x-auto pb-4 scroll-hidden snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {categories.map((category) => {
            const Icon = category.icon
              ? iconMap[category.icon] ?? Package
              : Package;
            const name =
              locale === "bg" ? category.name_bg : category.name_en;
            const count = category.product_count ?? 0;

            return (
              <MotionLink
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`/shop/${category.slug}`}
                className="group relative shrink-0 snap-center overflow-hidden rounded-2xl border border-border bg-white p-5 pb-20 transition-all hover:border-navy/30 hover:shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)] w-44 lg:w-auto"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-surface transition-colors group-hover:bg-accent-tint">
                  <Icon
                    size={18}
                    className="text-secondary transition-colors group-hover:text-accent"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-sm font-semibold text-navy">{name}</p>
                {count > 0 && (
                  <p className="mt-1 font-mono text-[10px] text-muted">
                    {count} {locale === "bg" ? "продукта" : "products"}
                  </p>
                )}
                <span className="mt-3 flex w-fit items-center gap-1 text-[11px] font-medium text-accent opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  {locale === "bg" ? "Виж" : "View"}
                  <ArrowRight size={11} />
                </span>
                {/* Animated before→after transformation per category */}
                <CategoryTransformation slug={category.slug} />
              </MotionLink>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
