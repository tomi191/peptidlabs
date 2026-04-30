"use client";

import { useEffect, useState } from "react";
import { FlaskConical, FileCheck } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { motion, useScroll, useTransform } from "motion/react";
import NumberFlow from "@number-flow/react";
import { Link } from "@/i18n/navigation";
import { HPLCLine } from "@/components/ui/HPLCLine";
import { TextWithAbbr } from "@/components/ui/TextWithAbbr";
import { HeroDataOverlay } from "@/components/home/HeroDataOverlay";

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

export function HeroSection({ peptideTotal = 65 }: { peptideTotal?: number }) {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isBg = locale === "bg";

  const { scrollY } = useScroll();
  const blob1Y = useTransform(scrollY, [0, 600], [0, -80]);
  const blob2Y = useTransform(scrollY, [0, 600], [0, 50]);
  const blob3Y = useTransform(scrollY, [0, 600], [0, -40]);

  const [peptideCount, setPeptideCount] = useState(0);
  const [purity, setPurity] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPeptideCount(peptideTotal), 400);
    const t2 = setTimeout(() => setPurity(98), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [peptideTotal]);

  return (
    <section className="relative w-full overflow-hidden">
      {/* ─── AURORA BACKGROUND ─── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* HPLC grid faint watermark */}
        <div className="absolute inset-0 hplc-grid opacity-80" />
        {/* Gradient blobs */}
        <motion.div
          style={{ y: blob1Y }}
          className="aurora-blob"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="h-[560px] w-[560px]"
            style={{
              background:
                "radial-gradient(circle, rgba(13,148,136,0.55) 0%, rgba(13,148,136,0.15) 40%, transparent 70%)",
              animation: "aurora-drift-1 14s ease-in-out infinite",
              marginTop: "-140px",
              marginLeft: "-100px",
              filter: "blur(60px)",
            }}
          />
        </motion.div>
        <motion.div
          style={{ y: blob2Y }}
          className="aurora-blob right-0 top-1/4"
          animate={{ opacity: [0.7, 0.95, 0.7] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="h-[480px] w-[480px]"
            style={{
              background:
                "radial-gradient(circle, rgba(20,184,166,0.5) 0%, rgba(20,184,166,0.1) 45%, transparent 70%)",
              animation: "aurora-drift-2 18s ease-in-out infinite",
              marginTop: "-180px",
              marginRight: "-140px",
              filter: "blur(60px)",
            }}
          />
        </motion.div>
        <motion.div
          style={{ y: blob3Y }}
          className="aurora-blob -bottom-40 left-1/3"
          animate={{ opacity: [0.6, 0.85, 0.6] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="h-[600px] w-[600px]"
            style={{
              background:
                "radial-gradient(circle, rgba(94,234,212,0.55) 0%, rgba(94,234,212,0.12) 45%, transparent 70%)",
              animation: "aurora-drift-3 20s ease-in-out infinite",
              filter: "blur(70px)",
            }}
          />
        </motion.div>
        {/* Extra navy tint blob for depth */}
        <motion.div
          className="aurora-blob top-0 right-1/4"
          animate={{ opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <div
            className="h-[320px] w-[320px]"
            style={{
              background:
                "radial-gradient(circle, rgba(15,23,42,0.15) 0%, transparent 70%)",
              animation: "aurora-drift-1 16s ease-in-out infinite reverse",
              marginTop: "80px",
              filter: "blur(80px)",
            }}
          />
        </motion.div>
      </div>

      {/* ─── DATA OVERLAY — animated HPLC + peptide chain decorative SVG ─── */}
      <HeroDataOverlay />

      {/* ─── CONTENT ─── */}
      <div className="relative px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Left — text content */}
          <motion.div
            className="lg:col-span-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* LIVE dot + tag */}
            <motion.div
              variants={item}
              className="mb-4 inline-flex items-center gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-teal-500/60 peptide-live-dot" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                {t("tag")}
              </p>
            </motion.div>
            <motion.h1
              variants={item}
              className="whitespace-pre-line font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] md:text-5xl text-gradient-navy-teal"
            >
              {t("title")}
            </motion.h1>
            <motion.div variants={item}>
              <HPLCLine variant="full" className="mt-5 max-w-xs" />
            </motion.div>
            <motion.p
              variants={item}
              className="mt-5 max-w-lg text-base md:text-lg text-secondary leading-relaxed"
            >
              {t("subtitle", { count: peptideTotal })}
            </motion.p>
            <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-navy/90 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.4)] hover:shadow-[0_8px_30px_-10px_rgba(15,23,42,0.5)]"
                >
                  <FlaskConical size={16} />
                  {t("browsePeptides")}
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/80 backdrop-blur-sm px-6 py-3.5 text-sm font-medium text-navy transition-colors hover:bg-white hover:border-navy/30"
                >
                  <FileCheck size={16} />
                  {t("viewCoa")}
                </Link>
              </motion.div>
            </motion.div>

            {/* Inline trust row — replaces static chips */}
            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-muted"
            >
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                <TextWithAbbr text={isBg ? "HPLC над 98%" : "HPLC above 98%"} locale={locale} />
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                <TextWithAbbr
                  text={isBg ? "COA с всяка партида" : "COA with every batch"}
                  locale={locale}
                />
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                {isBg ? "Доставка от ЕС" : "Shipped from EU"}
              </span>
            </motion.div>
          </motion.div>

          {/* Right — stats card with counting numbers */}
          <motion.div
            className="lg:col-span-2"
            variants={statsContainer}
            initial="hidden"
            animate="show"
          >
            <div className="relative rounded-2xl border border-border bg-white/75 backdrop-blur-md p-7 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.2)]">
              {/* Corner label */}
              <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-widest text-muted">
                {isBg ? "Каталог" : "Catalog"}
              </span>

              <div className="mt-6 grid grid-cols-3 gap-6">
                <motion.div variants={item} className="text-center">
                  <p className="font-mono text-3xl font-bold text-navy tabular">
                    <NumberFlow value={peptideCount} />
                    <span className="text-xl">+</span>
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-muted">
                    {t("statPeptidesLabel")}
                  </p>
                </motion.div>
                <motion.div variants={item} className="text-center">
                  <p className="font-mono text-3xl font-bold text-navy tabular">
                    {isBg ? "над " : "over "}
                    <NumberFlow value={purity} />
                    <span className="text-xl">%</span>
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-muted">
                    <TextWithAbbr
                      text={t("statPurityLabel")}
                      locale={locale}
                    />
                  </p>
                </motion.div>
                <motion.div variants={item} className="text-center">
                  <p className="font-mono text-2xl md:text-[1.75rem] font-bold text-navy tabular whitespace-nowrap">
                    {t("statDelivery")}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-muted">
                    {t("statDeliveryLabel")}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
