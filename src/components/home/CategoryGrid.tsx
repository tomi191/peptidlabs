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
import type { Category } from "@/lib/types";
import { motion } from "motion/react";
import Image from "next/image";

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

function categoryImageUrl(slug: string): string | null {
  if (!SUPABASE_URL) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/categories/${slug}.png`;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 280, damping: 24 },
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
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="mb-4 text-center text-2xl font-bold text-navy md:text-3xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted">
            {locale === "bg"
              ? "Изберете категория според целта на изследването."
              : "Pick a category by your research goal."}
          </p>
        </motion.div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <motion.div
          className="mt-8 flex gap-4 overflow-x-auto pb-4 scroll-hidden snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0"
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
            const imageUrl = categoryImageUrl(category.slug);

            return (
              <MotionLink
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                href={`/shop/${category.slug}`}
                className="group relative shrink-0 snap-center flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all hover:border-navy/30 hover:shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)] w-52 lg:w-auto"
              >
                {/* Hero image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-accent-tint/40">
                      <Icon
                        size={32}
                        className="text-secondary/60"
                        strokeWidth={1.25}
                      />
                    </div>
                  )}
                  {/* Subtle gradient overlay for icon legibility */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                  {/* Floating icon badge in corner */}
                  <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors group-hover:bg-accent-tint">
                    <Icon
                      size={14}
                      className="text-navy transition-colors group-hover:text-accent"
                      strokeWidth={1.75}
                    />
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col px-4 pt-3 pb-4">
                  <p className="text-sm font-semibold text-navy">{name}</p>
                  {count > 0 && (
                    <p className="mt-1 font-mono text-[10px] text-muted">
                      {count} {locale === "bg" ? "продукта" : "products"}
                    </p>
                  )}
                  <span className="mt-2 flex items-center gap-1 text-[11px] font-medium text-accent opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    {locale === "bg" ? "Виж" : "View"}
                    <ArrowRight size={11} />
                  </span>
                </div>
              </MotionLink>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
