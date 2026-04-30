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
  ArrowUpRight,
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
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.97 },
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

        {/* Horizontal scroll on mobile, 5-col grid on desktop */}
        <motion.div
          className="mt-10 flex gap-4 overflow-x-auto pb-4 scroll-hidden snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0"
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
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                href={`/shop/${category.slug}`}
                className="group relative shrink-0 snap-center w-44 lg:w-auto"
              >
                {/* Full-bleed 9:16 card */}
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-navy/90 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.25)] transition-shadow duration-500 group-hover:shadow-[0_24px_48px_-16px_rgba(15,23,42,0.45)]">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 20vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-accent-tint/40">
                      <Icon
                        size={40}
                        className="text-secondary/60"
                        strokeWidth={1.25}
                      />
                    </div>
                  )}

                  {/* Bottom-up gradient for legibility */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                  {/* Floating glassmorphic icon (top-right) */}
                  <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-md transition-all duration-300 group-hover:bg-accent group-hover:ring-accent/50">
                    <Icon
                      size={15}
                      className="text-white transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={1.75}
                    />
                  </div>

                  {/* Overlay text bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-base font-semibold leading-tight tracking-tight">
                          {name}
                        </p>
                        {count > 0 && (
                          <p className="mt-0.5 font-mono text-[10px] text-white/70">
                            {count} {locale === "bg" ? "продукта" : "products"}
                          </p>
                        )}
                      </div>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:ring-white">
                        <ArrowUpRight
                          size={14}
                          className="text-white transition-colors duration-300 group-hover:text-navy"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </MotionLink>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
