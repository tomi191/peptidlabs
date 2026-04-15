"use client";

import { FlaskConical, FileCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { HPLCLine } from "@/components/ui/HPLCLine";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

const statsContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="w-full px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 lg:grid-cols-5 lg:gap-12">
        {/* Left — text content */}
        <motion.div
          className="lg:col-span-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={item}
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent"
          >
            {t("tag")}
          </motion.p>
          <motion.h1
            variants={item}
            className="whitespace-pre-line font-display text-3xl font-bold leading-tight tracking-[-0.04em] text-navy md:text-4xl"
          >
            {t("title")}
          </motion.h1>
          <motion.div variants={item}>
            <HPLCLine variant="full" className="mt-4 max-w-xs" />
          </motion.div>
          <motion.p
            variants={item}
            className="mt-4 max-w-lg text-base text-secondary"
          >
            {t("subtitle")}
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
            >
              <FlaskConical size={16} />
              {t("browsePeptides")}
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-navy transition-colors hover:bg-surface"
            >
              <FileCheck size={16} />
              {t("viewCoa")}
            </Link>
          </motion.div>
        </motion.div>

        {/* Right — stats card */}
        <motion.div
          className="lg:col-span-2"
          variants={statsContainer}
          initial="hidden"
          animate="show"
        >
          <div className="rounded-xl border border-border bg-surface p-8">
            <div className="grid grid-cols-3 gap-6">
              <motion.div variants={item} className="text-center">
                <p className="font-mono text-2xl font-bold text-navy tabular">
                  {t("statPeptides")}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {t("statPeptidesLabel")}
                </p>
              </motion.div>
              <motion.div variants={item} className="text-center">
                <p className="font-mono text-2xl font-bold text-navy tabular">
                  {t("statPurity")}
                </p>
                <p className="mt-1 text-xs text-muted">{t("statPurityLabel")}</p>
              </motion.div>
              <motion.div variants={item} className="text-center">
                <p className="font-mono text-2xl font-bold text-navy tabular">
                  {t("statDelivery")}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {t("statDeliveryLabel")}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
