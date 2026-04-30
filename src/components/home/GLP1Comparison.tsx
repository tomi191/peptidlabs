"use client";

/* GLP-1 Comparison — interactive widget that helps users distinguish the three
   leading GLP-1-class peptides (Semaglutide, Tirzepatide, Retatrutide).
   Click a card to see animated bar chart with weight loss %, price, frequency. */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Sparkles, Crown, Award, Trophy } from "lucide-react";

type Locale = "bg" | "en";

type Variant = {
  id: "semaglutide" | "tirzepatide" | "retatrutide";
  name: string;
  brandNames: string;
  productSlug: string;
  priceEur: number;
  weightLossPct: number;
  trialName: string;
  trialDuration: string;
  mechanism: { bg: string; en: string };
  highlight: { bg: string; en: string };
  badge: { bg: string; en: string };
  badgeIcon: typeof Sparkles;
  badgeColor: string;
};

const VARIANTS: Variant[] = [
  {
    id: "semaglutide",
    name: "Семаглутид",
    brandNames: "STEP 1-5 trials · Novo Nordisk",
    productSlug: "semaglutide-5mg",
    priceEur: 79.9,
    weightLossPct: 14.9,
    trialName: "STEP 1-5",
    trialDuration: "68 седмици",
    mechanism: { bg: "GLP-1 рецепторен агонист", en: "GLP-1 receptor agonist" },
    highlight: {
      bg: "Първият селективен GLP-1 агонист с дълъг полуживот. Базова молекула на GLP-1 ерата.",
      en: "First selective GLP-1 agonist with long half-life. Foundation molecule of the GLP-1 era.",
    },
    badge: { bg: "Първо поколение", en: "First gen" },
    badgeIcon: Award,
    badgeColor: "#0d9488",
  },
  {
    id: "tirzepatide",
    name: "Тирзепатид",
    brandNames: "SURPASS / SURMOUNT trials · Eli Lilly",
    productSlug: "tirzepatide-5mg",
    priceEur: 119.9,
    weightLossPct: 22.5,
    trialName: "SURMOUNT-1",
    trialDuration: "72 седмици",
    mechanism: { bg: "Двоен агонист GLP-1 + GIP (twincretin)", en: "Dual agonist GLP-1 + GIP (twincretin)" },
    highlight: {
      bg: "Първият twincretin клас. Двоен инкретинов механизъм с превъзхождащи биохимични параметри спрямо моно-агонистите.",
      en: "First twincretin class. Dual incretin mechanism with superior biochemical parameters vs mono-agonists.",
    },
    badge: { bg: "Второ поколение", en: "Second gen" },
    badgeIcon: Crown,
    badgeColor: "#0f172a",
  },
  {
    id: "retatrutide",
    name: "Ретатрутид",
    brandNames: "Phase 2 (NEJM 2023) · Eli Lilly",
    productSlug: "retatrutide-5mg",
    priceEur: 139.9,
    weightLossPct: 24.2,
    trialName: "Phase 2",
    trialDuration: "48 седмици",
    mechanism: { bg: "Троен агонист (GLP-1 + GIP + глюкагонов рецептор)", en: "Triple agonist (GLP-1 + GIP + glucagon receptor)" },
    highlight: {
      bg: "Експериментален троен агонизъм. Активира три инкретин/глюкагонови рецептора едновременно — нов клас в проучвателна фаза.",
      en: "Experimental triple agonism. Activates three incretin/glucagon receptors simultaneously — new class in research phase.",
    },
    badge: { bg: "Експериментален", en: "Experimental" },
    badgeIcon: Trophy,
    badgeColor: "#7c3aed",
  },
];

export function GLP1Comparison({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<Variant["id"]>("tirzepatide");
  const activeVariant = VARIANTS.find((v) => v.id === active)!;
  const isBg = locale === "bg";
  const maxWeightLoss = Math.max(...VARIANTS.map((v) => v.weightLossPct));

  return (
    <section className="w-full px-6 py-16">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mb-8 max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
            {isBg ? "[Биохимично сравнение]" : "[Biochemical comparison]"}
          </p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold text-navy tracking-tight">
            {isBg
              ? "Три поколения GLP-1 рецепторни агонисти"
              : "Three generations of GLP-1 receptor agonists"}
          </h2>
          <p className="mt-2 text-sm text-secondary">
            {isBg
              ? "Сравнение на механизми и публикувани клинични данни от Phase 2/3 проучвания. Кликнете peptide за детайли."
              : "Comparison of mechanisms and published clinical data from Phase 2/3 trials. Click peptide for details."}
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted">
            <Sparkles size={11} className="text-accent" />
            {isBg
              ? "Само за изследователски цели · in vitro"
              : "Research purposes only · in vitro"}
          </p>
        </div>

        {/* Tab cards */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {VARIANTS.map((v) => {
            const Icon = v.badgeIcon;
            const isActive = active === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setActive(v.id)}
                className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all ${
                  isActive
                    ? "border-navy shadow-[0_8px_24px_-12px_rgba(15,23,42,0.25)]"
                    : "border-border hover:border-navy/40"
                }`}
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${v.badgeColor}10 0%, white 60%)`
                    : "white",
                }}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <motion.span
                    layoutId="glp1-active-dot"
                    className="absolute right-4 top-4 h-2 w-2 rounded-full"
                    style={{ background: v.badgeColor }}
                  />
                )}
                {/* Badge */}
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white"
                  style={{ background: v.badgeColor }}
                >
                  <Icon size={11} />
                  {isBg ? v.badge.bg : v.badge.en}
                </div>
                <p className="font-display text-xl font-bold text-navy">
                  {v.name}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-muted">
                  {v.brandNames}
                </p>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display text-2xl font-bold text-navy tabular">
                    −{v.weightLossPct}%
                  </span>
                  <span className="text-[11px] text-secondary">
                    {isBg ? "тегло" : "body weight"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel — animated bar chart + context */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeVariant.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-3xl border border-border bg-white"
          >
            <div className="grid lg:grid-cols-[1.2fr_1fr]">
              {/* Left: animated comparison bars */}
              <div className="border-b border-border bg-surface/30 p-6 md:p-8 lg:border-b-0 lg:border-r">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  {isBg ? "[Phase 2/3 клинични данни]" : "[Phase 2/3 clinical data]"}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {isBg
                    ? "Среден ефект върху телесна маса в публикувани проучвания (не индивидуален резултат)"
                    : "Average body mass effect in published trials (not individual result)"}
                </p>
                <div className="mt-6 space-y-4">
                  {VARIANTS.map((v) => {
                    const isCurrentActive = v.id === active;
                    const widthPct = (v.weightLossPct / maxWeightLoss) * 100;
                    return (
                      <div key={v.id}>
                        <div className="mb-1 flex items-baseline justify-between">
                          <span
                            className={`text-xs font-medium ${
                              isCurrentActive ? "text-navy" : "text-secondary"
                            }`}
                          >
                            {v.name}{" "}
                            <span className="font-mono text-[10px] text-muted">
                              ({v.trialName} · {v.trialDuration})
                            </span>
                          </span>
                          <span
                            className={`font-mono text-sm font-bold tabular ${
                              isCurrentActive ? "text-navy" : "text-secondary"
                            }`}
                          >
                            −{v.weightLossPct}%
                          </span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-surface">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPct}%` }}
                            transition={{
                              duration: 1.1,
                              delay: 0.15 * VARIANTS.indexOf(v),
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="h-full rounded-full"
                            style={{
                              background: isCurrentActive
                                ? `linear-gradient(to right, ${v.badgeColor}, ${v.badgeColor}aa)`
                                : "#d6d3d1",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: details + CTA */}
              <div className="flex flex-col p-6 md:p-8">
                <div className="flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    {isBg ? "[Механизъм]" : "[Mechanism]"}
                  </p>
                  <p className="mt-2 font-display text-lg font-bold text-navy">
                    {isBg ? activeVariant.mechanism.bg : activeVariant.mechanism.en}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-secondary">
                    {isBg
                      ? activeVariant.highlight.bg
                      : activeVariant.highlight.en}
                  </p>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="text-xs text-muted">
                      {isBg ? "Цена" : "Price"}
                    </span>
                    <span className="font-mono text-2xl font-bold text-navy tabular">
                      €{activeVariant.priceEur.toFixed(2)}
                    </span>
                  </div>
                  <Link
                    href={`/products/${activeVariant.productSlug}`}
                    className="group flex items-center justify-between gap-3 rounded-xl bg-navy px-4 py-3 text-white transition-transform hover:scale-[1.01]"
                  >
                    <span className="text-sm font-semibold">
                      {isBg
                        ? `Виж ${activeVariant.name} 5mg за изследване`
                        : `View ${activeVariant.name} 5mg for research`}
                    </span>
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                  <p className="mt-2 text-[10px] leading-relaxed text-muted">
                    {isBg
                      ? "Клиничните резултати са от регулирани медицински протоколи. Този продукт не е лекарствен — предназначен е единствено за in vitro изследвания."
                      : "Clinical results are from regulated medical protocols. This product is not a medication — intended solely for in vitro research."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
