"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import {
  FlaskConical,
  Droplets,
  Crosshair,
  Syringe,
  AlertTriangle,
  Sparkles,
  Activity,
  ShoppingBag,
  ArrowRight,
  Calendar,
  Lightbulb,
  Share2,
  Printer,
  Check,
  Search,
  Info,
  X,
} from "lucide-react";
import { Abbr } from "@/components/ui/Abbr";
import { Link } from "@/i18n/navigation";

/* ── Needle gauge recommendation based on dose volume ── */
function recommendNeedle(doseMl: number, lang: "bg" | "en") {
  if (doseMl <= 0)
    return { gauge: "—", reason: lang === "bg" ? "Изчисли първо дозата" : "Calculate dose first" };
  if (doseMl <= 0.15)
    return {
      gauge: "31G insulin pen needle",
      reason:
        lang === "bg"
          ? "Много малък обем — пен иглата е най-точна за <0.15 ml"
          : "Very small volume — pen needle is most precise for <0.15 ml",
    };
  if (doseMl <= 0.3)
    return {
      gauge: "31G / 0.3 ml insulin syringe",
      reason:
        lang === "bg"
          ? "0.3 ml спринцовка с 31G игла — тънка, минимален дискомфорт"
          : "0.3 ml syringe with 31G needle — thin, minimal discomfort",
    };
  if (doseMl <= 0.5)
    return {
      gauge: "29G / 0.5 ml insulin syringe",
      reason:
        lang === "bg"
          ? "0.5 ml спринцовка с 29G игла — балансирана точност и удобство"
          : "0.5 ml syringe with 29G needle — balanced precision and comfort",
    };
  if (doseMl <= 1.0)
    return {
      gauge: "27G-29G / 1 ml insulin syringe",
      reason:
        lang === "bg"
          ? "1 ml спринцовка — за по-големи обеми, GLP-1 типичен размер"
          : "1 ml syringe — for larger volumes, typical for GLP-1 protocols",
    };
  return {
    gauge: "27G / >1 ml syringe",
    reason:
      lang === "bg"
        ? "Над 1 ml — преразгледай реконституцията или раздели на 2 инжекции"
        : "Over 1 ml — reconsider reconstitution or split into 2 injections",
  };
}

/* ── Preset options ── */
const VIAL_PRESETS = [2, 5, 10, 50];
const WATER_PRESETS = [1, 2, 3, 5];
const DOSE_PRESETS = [100, 250, 500, 1000];
const SYRINGE_OPTIONS = [
  { ml: 0.3, units: 30 },
  { ml: 0.5, units: 50 },
  { ml: 1.0, units: 100 },
] as const;

type Preset = {
  id: string;
  peptide: string;
  /** Slug of the matching SKU in the products table — enables direct buy CTA */
  productSlug: string;
  priceEur: number;
  /** Typical research administration frequency, used for cycle planner */
  frequencyPerWeek: number;
  /** Short use-case tag (1-3 words) shown on preset card */
  note: { bg: string; en: string };
  /** One-sentence context shown after selection — what the peptide is */
  tagline: { bg: string; en: string };
  /** Category for grouping in search */
  category: { bg: string; en: string };
  vialMg: number;
  waterMl: number;
  doseMcg: number;
  syringeIdx: number;
};

const PEPTIDE_RECIPES: Preset[] = [
  // ── Регенерация ──
  {
    id: "bpc-157",
    peptide: "BPC-157",
    productSlug: "bpc-157-5mg",
    priceEur: 24.9,
    frequencyPerWeek: 7,
    note: { bg: "Ежедневно", en: "Daily" },
    tagline: {
      bg: "15-аминокиселинен фрагмент от защитен протеин в стомашния сок. Един от най-изследваните регенеративни пептиди.",
      en: "15-amino acid fragment from gastric juice protective protein. One of the most researched regenerative peptides.",
    },
    category: { bg: "Регенерация", en: "Regeneration" },
    vialMg: 5,
    waterMl: 2,
    doseMcg: 250,
    syringeIdx: 0,
  },
  {
    id: "tb-500",
    peptide: "TB-500",
    productSlug: "tb-500-5mg",
    priceEur: 29.9,
    frequencyPerWeek: 2,
    note: { bg: "2×/седм", en: "2×/wk" },
    tagline: {
      bg: "Активен фрагмент на Thymosin Beta-4. Свързва се с G-actin и подпомага клетъчната миграция към местата на увреда.",
      en: "Active fragment of Thymosin Beta-4. Binds G-actin and supports cell migration to injury sites.",
    },
    category: { bg: "Регенерация", en: "Regeneration" },
    vialMg: 5,
    waterMl: 2,
    doseMcg: 500,
    syringeIdx: 1,
  },
  {
    id: "bpc-tb-blend",
    peptide: "BPC + TB бленд",
    productSlug: "bpc-157-tb-500-blend-10mg",
    priceEur: 49.9,
    frequencyPerWeek: 7,
    note: { bg: "Синергия", en: "Synergy" },
    tagline: {
      bg: "Двата водещи регенеративни пептида във формат 5mg+5mg. Синергичен ефект — BPC за ангиогенеза, TB за клетъчна миграция.",
      en: "Two leading regenerative peptides in 5mg+5mg format. Synergistic — BPC for angiogenesis, TB for cell migration.",
    },
    category: { bg: "Регенерация", en: "Regeneration" },
    vialMg: 10,
    waterMl: 3,
    doseMcg: 500,
    syringeIdx: 1,
  },
  // ── GH / Мускули ──
  {
    id: "ipamorelin",
    peptide: "Ипаморелин",
    productSlug: "ipamorelin-5mg",
    priceEur: 29.9,
    frequencyPerWeek: 7,
    note: { bg: "Преди сън", en: "Pre-sleep" },
    tagline: {
      bg: "Селективен пентапептиден GHRP. Стимулира естествен GH импулс БЕЗ да повишава кортизол, пролактин или апетит.",
      en: "Selective pentapeptide GHRP. Stimulates natural GH pulse WITHOUT raising cortisol, prolactin or appetite.",
    },
    category: { bg: "GH / Мускули", en: "GH / Muscle" },
    vialMg: 5,
    waterMl: 2,
    doseMcg: 200,
    syringeIdx: 0,
  },
  {
    id: "ipa-cjc-blend",
    peptide: "Ипа+CJC бленд",
    productSlug: "ipamorelin-cjc-blend-10mg",
    priceEur: 36.9,
    frequencyPerWeek: 7,
    note: { bg: "Двойна GH стимулация", en: "Dual GH stim" },
    tagline: {
      bg: "Класическата комбинация GHRP + GHRH. Удвоява амплитудата на GH пулсовете спрямо което и да е поотделно.",
      en: "Classic GHRP + GHRH combination. Doubles GH pulse amplitude vs single peptide use.",
    },
    category: { bg: "GH / Мускули", en: "GH / Muscle" },
    vialMg: 10,
    waterMl: 2,
    doseMcg: 200,
    syringeIdx: 0,
  },
  {
    id: "cjc-1295",
    peptide: "CJC-1295",
    productSlug: "cjc-1295-5mg",
    priceEur: 32.9,
    frequencyPerWeek: 7,
    note: { bg: "С GHRP", en: "With GHRP" },
    tagline: {
      bg: "Модифициран Серморелин с DPP-4 резистентност. Имитира естествени GH пулсове. Класически партньор на Ипаморелин.",
      en: "Modified Sermorelin with DPP-4 resistance. Mimics natural GH pulses. Classic partner for Ipamorelin.",
    },
    category: { bg: "GH / Мускули", en: "GH / Muscle" },
    vialMg: 5,
    waterMl: 2,
    doseMcg: 100,
    syringeIdx: 0,
  },
  {
    id: "sermorelin",
    peptide: "Серморелин",
    productSlug: "sermorelin-5mg",
    priceEur: 29.9,
    frequencyPerWeek: 5,
    note: { bg: "Естествени GH пулсове", en: "Natural GH pulses" },
    tagline: {
      bg: "Класически GHRH аналог от Нобеловия лауреат Roger Guillemin (Salk Institute). Кратък полуживот — естествена пулсация.",
      en: "Classic GHRH analog from Nobel laureate Roger Guillemin (Salk Institute). Short half-life — natural pulsation.",
    },
    category: { bg: "GH / Мускули", en: "GH / Muscle" },
    vialMg: 5,
    waterMl: 2,
    doseMcg: 200,
    syringeIdx: 0,
  },
  // ── Метаболизъм / Отслабване ──
  {
    id: "semaglutide",
    peptide: "Семаглутид",
    productSlug: "semaglutide-5mg",
    priceEur: 79.9,
    frequencyPerWeek: 1,
    note: { bg: "1× седмично", en: "Weekly" },
    tagline: {
      bg: "Дългодействащ GLP-1 аналог (Ozempic, Wegovy) от Novo Nordisk. В STEP проучванията — 14,9% загуба на тегло за 68 седмици.",
      en: "Long-acting GLP-1 analog (Ozempic, Wegovy) from Novo Nordisk. STEP trials — 14.9% weight loss over 68 weeks.",
    },
    category: { bg: "Метаболизъм", en: "Metabolism" },
    vialMg: 5,
    waterMl: 2,
    doseMcg: 250,
    syringeIdx: 1,
  },
  {
    id: "tirzepatide",
    peptide: "Тирзепатид",
    productSlug: "tirzepatide-5mg",
    priceEur: 119.9,
    frequencyPerWeek: 1,
    note: { bg: "1× седмично", en: "Weekly" },
    tagline: {
      bg: "Първият двоен GLP-1/GIP агонист (Mounjaro, Zepbound) от Eli Lilly. SURMOUNT-1 — 22,5% загуба за 72 седмици.",
      en: "First dual GLP-1/GIP agonist (Mounjaro, Zepbound) from Eli Lilly. SURMOUNT-1 — 22.5% loss over 72 weeks.",
    },
    category: { bg: "Метаболизъм", en: "Metabolism" },
    vialMg: 5,
    waterMl: 2,
    doseMcg: 500,
    syringeIdx: 1,
  },
  {
    id: "retatrutide",
    peptide: "Ретатрутид",
    productSlug: "retatrutide-5mg",
    priceEur: 139.9,
    frequencyPerWeek: 1,
    note: { bg: "1× седмично", en: "Weekly" },
    tagline: {
      bg: "Следващото поколение — троен агонист (GLP-1+GIP+глюкагон) от Eli Lilly. Phase 2 NEJM 2023 — 24,2% загуба на тегло.",
      en: "Next generation — triple agonist (GLP-1+GIP+glucagon) from Eli Lilly. Phase 2 NEJM 2023 — 24.2% weight loss.",
    },
    category: { bg: "Метаболизъм", en: "Metabolism" },
    vialMg: 5,
    waterMl: 2,
    doseMcg: 1000,
    syringeIdx: 1,
  },
  {
    id: "tesamorelin",
    peptide: "Тезаморелин",
    productSlug: "tesamorelin-5mg",
    priceEur: 119.9,
    frequencyPerWeek: 7,
    note: { bg: "Ежедневно", en: "Daily" },
    tagline: {
      bg: "FDA-одобрен GHRH аналог (Egrifta). Уникална селективност към висцералната мазнина — без влияние върху подкожната.",
      en: "FDA-approved GHRH analog (Egrifta). Unique selectivity for visceral fat — no effect on subcutaneous tissue.",
    },
    category: { bg: "Метаболизъм", en: "Metabolism" },
    vialMg: 5,
    waterMl: 2,
    doseMcg: 1000,
    syringeIdx: 1,
  },
  {
    id: "aod-9604",
    peptide: "AOD-9604",
    productSlug: "aod-9604-5mg",
    priceEur: 29.9,
    frequencyPerWeek: 7,
    note: { bg: "На гладно", en: "Fasted" },
    tagline: {
      bg: "Фрагмент 176-191 на растежния хормон от Monash University. Чисто горене на мазнини без хипергликемия или ефект на IGF-1.",
      en: "Fragment 176-191 of growth hormone from Monash University. Pure fat burning without hyperglycemia or IGF-1 effect.",
    },
    category: { bg: "Метаболизъм", en: "Metabolism" },
    vialMg: 5,
    waterMl: 2,
    doseMcg: 300,
    syringeIdx: 0,
  },
  // ── Анти-ейдж / Longevity ──
  {
    id: "ghk-cu",
    peptide: "GHK-Cu",
    productSlug: "ghk-cu-50mg",
    priceEur: 29.9,
    frequencyPerWeek: 5,
    note: { bg: "Кожа · регенерация", en: "Skin · regeneration" },
    tagline: {
      bg: "Естественият медно-пептиден комплекс ('синият елексир'). Тялото го произвежда самó — нивата падат с възрастта.",
      en: "Natural copper-peptide complex ('the blue elixir'). Body produces it itself — levels decline with age.",
    },
    category: { bg: "Анти-ейдж", en: "Anti-aging" },
    vialMg: 50,
    waterMl: 5,
    doseMcg: 2000,
    syringeIdx: 1,
  },
  {
    id: "nad",
    peptide: "NAD+",
    productSlug: "nad-plus-500mg",
    priceEur: 89.9,
    frequencyPerWeek: 3,
    note: { bg: "Митохондрии", en: "Mitochondria" },
    tagline: {
      bg: "Централен коензим на енергийния метаболизъм. Активира сиртуините (longevity ензимите). Изследван от Sinclair (Harvard).",
      en: "Central coenzyme for energy metabolism. Activates sirtuins (longevity enzymes). Researched by Sinclair (Harvard).",
    },
    category: { bg: "Анти-ейдж", en: "Anti-aging" },
    vialMg: 500,
    waterMl: 5,
    doseMcg: 100000,
    syringeIdx: 2,
  },
  // ── Ноотропи ──
  {
    id: "selank",
    peptide: "Селанк",
    productSlug: "selank-5mg",
    priceEur: 22.9,
    frequencyPerWeek: 7,
    note: { bg: "Интраназално", en: "Intranasal" },
    tagline: {
      bg: "Руски ноотропен пептид (тафтсин аналог) от Руската академия на науките. Анксиолитик без зависимост и седация.",
      en: "Russian nootropic peptide (tuftsin analog) from Russian Academy of Sciences. Anxiolytic without dependence or sedation.",
    },
    category: { bg: "Ноотропи", en: "Nootropics" },
    vialMg: 5,
    waterMl: 2,
    doseMcg: 300,
    syringeIdx: 0,
  },
];

/* ── BG unit labels ── */
const UNITS = {
  bg: { mg: "мг", ml: "мл", mcg: "мкг", unit: "ед.", units: "единици", mcgPerMl: "мкг/мл" },
  en: { mg: "mg", ml: "ml", mcg: "mcg", unit: "U", units: "units", mcgPerMl: "mcg/ml" },
} as const;

/* ── Vial visualization with liquid wave animation ── */
function VialVisual({
  vialMg,
  waterMl,
  concentration,
  lang,
}: {
  vialMg: number | null;
  waterMl: number | null;
  concentration: number;
  lang: "bg" | "en";
}) {
  const u = UNITS[lang];
  const waterFill = waterMl ? Math.min(Math.max((waterMl / 5) * 75, 12), 75) : 0;
  const powderHeight = vialMg ? Math.min(Math.max(Math.log2(vialMg + 1) * 3, 4), 14) : 0;

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-[120px] h-[220px]">
        {/* Cap */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[64px] h-[18px] rounded-t-sm bg-navy" />
        <div className="absolute left-1/2 top-[16px] -translate-x-1/2 w-[40px] h-[6px] bg-navy/70" />
        <div className="absolute left-1/2 top-[20px] -translate-x-1/2 w-[56px] h-[10px] bg-slate-400" />

        {/* Glass body */}
        <div className="absolute left-1/2 top-[28px] -translate-x-1/2 w-[96px] h-[180px] rounded-b-2xl rounded-t-sm border border-stone-200 bg-gradient-to-br from-white via-teal-50/30 to-white overflow-hidden shadow-inner">
          {/* Water fill with wave */}
          {waterMl && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${waterFill}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
              className="absolute left-0 right-0 bottom-0 overflow-hidden"
            >
              {/* SVG wave surface — animated */}
              <svg
                className="absolute left-0 right-0 -top-[6px] w-[200%] h-4"
                viewBox="0 0 200 20"
                preserveAspectRatio="none"
                style={{
                  animation: "peptide-wave 5s ease-in-out infinite",
                }}
              >
                <path
                  d="M0 10 Q 25 0 50 10 T 100 10 T 150 10 T 200 10 V 20 H 0 Z"
                  fill="rgba(20, 184, 166, 0.5)"
                />
                <path
                  d="M0 12 Q 25 4 50 12 T 100 12 T 150 12 T 200 12 V 20 H 0 Z"
                  fill="rgba(20, 184, 166, 0.25)"
                />
              </svg>
              {/* Body of liquid */}
              <div className="absolute left-0 right-0 top-[6px] bottom-0 bg-gradient-to-t from-teal-500/35 via-teal-400/22 to-teal-300/18" />
            </motion.div>
          )}
          {/* Powder at bottom */}
          {vialMg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ height: `${powderHeight}px` }}
              className="absolute left-2 right-2 bottom-0 rounded-b-[14px] bg-stone-100 border border-stone-200"
            >
              <div className="h-full w-full opacity-60 bg-[radial-gradient(circle,_rgba(14,165,164,0.2)_1px,_transparent_1px)] bg-[length:4px_4px]" />
            </motion.div>
          )}
          {/* Label */}
          <div className="absolute left-2 right-2 top-1/3 rounded-sm border border-stone-200 bg-white/85 backdrop-blur-sm px-2 py-1.5 text-center">
            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted leading-none">
              PeptidLabs
            </p>
            <p className="font-mono text-[11px] font-bold text-navy leading-none mt-1">
              {vialMg ? `${vialMg} ${u.mg}` : `— ${u.mg}`}
            </p>
            <p className="font-mono text-[7px] text-teal-600 mt-1 leading-none">
над 98% HPLC
            </p>
          </div>
        </div>

        {/* Right-side scale ticks */}
        <div className="absolute right-0 top-[34px] h-[170px] flex flex-col justify-between">
          {[5, 4, 3, 2, 1].map((ml) => (
            <div key={ml} className="flex items-center gap-1">
              <span className="font-mono text-[8px] text-muted">{ml}</span>
              <div className="w-1 h-px bg-stone-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Concentration label underneath */}
      <div className="mt-4 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {lang === "bg" ? "концентрация" : "concentration"}
        </p>
        <p className="mt-1 font-mono text-xl font-bold text-navy tabular">
          {concentration > 0
            ? `${concentration.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
            : "—"}
          <span className="text-xs text-muted ml-1">{u.mcgPerMl}</span>
        </p>
      </div>
    </div>
  );
}

/* ── Enhanced syringe visualization ── */
function SyringeVisual({
  fillPercent,
  syringeUnits,
  totalUnits,
  exceedsCapacity,
  lang,
}: {
  fillPercent: number;
  syringeUnits: number;
  totalUnits: number;
  exceedsCapacity: boolean;
  lang: "bg" | "en";
}) {
  const u = UNITS[lang];
  const clampedFill = Math.min(Math.max(fillPercent, 0), 100);
  const tickCount = 10;
  const step = totalUnits / tickCount;

  return (
    <div className="flex items-end gap-3">
      <div className="relative w-16 h-[220px]">
        {/* Plunger shaft */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-10 w-3 bg-stone-300 rounded-t-sm transition-all duration-300"
          style={{ height: `${(100 - clampedFill) * 0.4 + 10}px` }}
        />
        {/* Plunger head */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-7 h-3 bg-navy rounded-sm shadow-sm" />

        {/* Barrel */}
        <div className="absolute inset-0 top-4 border-2 border-navy rounded-b-md bg-white overflow-hidden">
          {/* Fill */}
          <motion.div
            animate={{ height: `${clampedFill}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 22 }}
            className={`absolute bottom-0 left-0 right-0 border-t-2 ${
              exceedsCapacity
                ? "bg-red-500/20 border-red-500"
                : "bg-teal-500/25 border-teal-500"
            }`}
          >
            <div className="absolute inset-x-2 top-0 h-[2px] bg-white/70 rounded-full" />
          </motion.div>

          {/* Tick marks */}
          {Array.from({ length: tickCount + 1 }, (_, i) => {
            const pct = (i / tickCount) * 100;
            const label = Math.round(i * step);
            const major = i % 2 === 0;
            return (
              <div
                key={i}
                className="absolute left-0 right-0 flex items-center"
                style={{ bottom: `${pct}%` }}
              >
                <div
                  className={`${major ? "w-2.5" : "w-1.5"} h-px bg-navy/50`}
                />
                {major && (
                  <span className="font-mono text-[8px] text-muted ml-0.5 leading-none">
                    {label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Needle */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-px h-8 bg-slate-500" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-r-[3px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-600" />
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {lang === "bg" ? "за теглене" : "to draw"}
        </p>
        <p className="mt-1 font-mono text-xl font-bold text-navy tabular">
          {syringeUnits.toFixed(1)}
          <span className="text-xs text-muted ml-1">
            / {totalUnits} {u.unit}
          </span>
        </p>
      </div>
    </div>
  );
}

/* ── Preset button ── */
function PresetButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`px-3 py-2 rounded-md border text-sm font-mono cursor-pointer transition-colors ${
        active
          ? "border-navy bg-navy text-white"
          : "border-border bg-white text-navy hover:border-navy"
      }`}
    >
      {label}
    </motion.button>
  );
}

/* ── Step wrapper ── */
function Step({
  n,
  icon,
  label,
  children,
}: {
  n: number;
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-surface text-navy font-mono text-xs font-bold border border-border">
          {n}
        </div>
        <span className="text-navy">{icon}</span>
        <span className="text-sm font-semibold text-navy">{label}</span>
      </div>
      {children}
    </div>
  );
}

/* ── Result spec card ── */
function SpecCard({
  label,
  value,
  unit,
  highlight = false,
}: {
  label: React.ReactNode;
  value: string;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-teal-200 bg-teal-50/50"
          : "border-border bg-white"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
      </p>
      <p
        className={`mt-2 font-mono text-2xl font-bold tabular ${
          highlight ? "text-teal-700" : "text-navy"
        }`}
      >
        {value}
        <span className="text-xs text-muted ml-1">{unit}</span>
      </p>
    </div>
  );
}

/* ── Buy recommendation + cycle planner ── */
function BuyRecommendation({
  vialMg,
  doseMcg,
  recipe,
  lang,
}: {
  vialMg: number;
  doseMcg: number;
  recipe: Preset | null;
  lang: "bg" | "en";
}) {
  const [cycleWeeks, setCycleWeeks] = useState(8);

  const dosesPerVial = Math.floor((vialMg * 1000) / doseMcg);

  // Use recipe frequency if available, otherwise default to daily
  const freqPerWeek = recipe?.frequencyPerWeek ?? 7;
  const dosesNeeded = cycleWeeks * freqPerWeek;
  const vialsNeeded = Math.max(1, Math.ceil(dosesNeeded / dosesPerVial));
  const totalCost = recipe ? vialsNeeded * recipe.priceEur : 0;

  // Bulk discount tiers (matches BulkDiscountTiers): 3+ = 5%, 5+ = 10%, 10+ = 15%
  const discountPct =
    vialsNeeded >= 10 ? 15 : vialsNeeded >= 5 ? 10 : vialsNeeded >= 3 ? 5 : 0;
  const discountedCost = totalCost * (1 - discountPct / 100);
  const savings = totalCost - discountedCost;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-accent-border bg-gradient-to-br from-accent-tint via-white to-white p-5"
    >
      {/* Doses per vial — always shown */}
      <div className="flex items-baseline justify-between gap-3 border-b border-accent-border/50 pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            {lang === "bg" ? "[Този флакон ти дава]" : "[This vial gives you]"}
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-navy tabular">
            {dosesPerVial}
            <span className="ml-2 text-sm font-normal text-secondary">
              {lang === "bg"
                ? `дози × ${doseMcg} mcg`
                : `doses × ${doseMcg} mcg`}
            </span>
          </p>
        </div>
        <div className="hidden sm:flex items-center justify-center h-12 w-12 rounded-xl bg-white border border-accent-border">
          <Sparkles size={20} className="text-accent" />
        </div>
      </div>

      {/* Direct Buy CTA — only when recipe is active */}
      {recipe && (
        <Link
          href={`/products/${recipe.productSlug}`}
          className="group mt-4 flex items-center justify-between gap-4 rounded-xl bg-navy px-5 py-4 text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">
              {lang === "bg" ? "Поръчай същия пептид" : "Order the same peptide"}
            </p>
            <p className="mt-1 truncate text-base font-semibold">
              {recipe.peptide} {recipe.vialMg}mg
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-2xl font-bold tabular">
              €{recipe.priceEur.toFixed(2)}
            </p>
            <p className="mt-0.5 text-[10px] text-white/60">
              {lang === "bg" ? "за флакон" : "per vial"}
            </p>
          </div>
          <ArrowRight
            size={18}
            className="shrink-0 transition-transform group-hover:translate-x-1"
          />
        </Link>
      )}

      {/* Cycle planner — shown for any preset, hidden for custom-only */}
      {recipe && (
        <div className="mt-4 rounded-xl border border-border bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Calendar size={14} className="text-accent" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              {lang === "bg"
                ? "[Планировчик за курс]"
                : "[Cycle planner]"}
            </p>
          </div>

          {/* Week selector */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-secondary">
              {lang === "bg" ? "Продължителност:" : "Duration:"}
            </span>
            {[4, 8, 12, 16].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setCycleWeeks(w)}
                className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                  cycleWeeks === w
                    ? "border-navy bg-navy text-white"
                    : "border-border bg-white text-navy hover:border-navy"
                }`}
              >
                {w} {lang === "bg" ? "седм." : "wk"}
              </button>
            ))}
          </div>

          {/* Frequency hint */}
          <p className="mb-3 text-[11px] text-muted">
            {lang === "bg"
              ? `Изчислено при ${freqPerWeek}× седмично приложение (типично за ${recipe.peptide}).`
              : `Calculated at ${freqPerWeek}× weekly administration (typical for ${recipe.peptide}).`}
          </p>

          {/* 3-column metrics */}
          <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                {lang === "bg" ? "Общо дози" : "Doses total"}
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-navy tabular">
                {dosesNeeded}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                {lang === "bg" ? "Флакони" : "Vials"}
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-navy tabular">
                {vialsNeeded}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                {lang === "bg" ? "Сума" : "Total"}
              </p>
              <p className="mt-1 font-mono text-lg font-bold tabular text-accent">
                €{(discountedCost || totalCost).toFixed(2)}
              </p>
              {discountPct > 0 && (
                <p className="text-[10px] text-muted line-through tabular">
                  €{totalCost.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Bulk discount nudge */}
          {discountPct > 0 && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-accent-border bg-accent-tint px-3 py-2.5">
              <Lightbulb
                size={14}
                className="mt-0.5 shrink-0 text-accent"
              />
              <p className="text-[11px] leading-relaxed text-navy">
                {lang === "bg" ? (
                  <>
                    <strong>−{discountPct}% bulk отстъпка</strong> за {vialsNeeded}{" "}
                    флакона — спестяваш{" "}
                    <strong className="tabular">€{savings.toFixed(2)}</strong>.
                    Прилага се автоматично на checkout.
                  </>
                ) : (
                  <>
                    <strong>−{discountPct}% bulk discount</strong> for{" "}
                    {vialsNeeded} vials — you save{" "}
                    <strong className="tabular">€{savings.toFixed(2)}</strong>.
                    Applied automatically at checkout.
                  </>
                )}
              </p>
            </div>
          )}

          {/* Add full cycle to cart shortcut */}
          <Link
            href={`/products/${recipe.productSlug}?qty=${vialsNeeded}`}
            className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-navy bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
          >
            <ShoppingBag size={14} />
            {lang === "bg"
              ? `Поръчай ${vialsNeeded} флакона за целия курс`
              : `Order ${vialsNeeded} vials for the full cycle`}
          </Link>
        </div>
      )}

      {/* Disclaimer for non-recipe (custom) calculations */}
      {!recipe && dosesPerVial > 0 && (
        <p className="mt-4 text-[11px] text-muted leading-relaxed">
          {lang === "bg"
            ? "Изберете готов протокол по-горе, за да видите препоръчителен флакон, цена и планировчик за курс."
            : "Pick a preset protocol above to see the recommended vial, price and cycle planner."}
        </p>
      )}
    </motion.div>
  );
}

/* ── Main calculator ── */
export default function Calculator() {
  const t = useTranslations("calculator");
  const locale = useLocale();
  const lang = locale === "bg" ? "bg" : "en";

  // Read URL params on mount for save/share
  const initial = (() => {
    if (typeof window === "undefined")
      return { vial: 5, water: 2, dose: 250, syringe: 2, recipe: null as string | null };
    const sp = new URLSearchParams(window.location.search);
    return {
      vial: Number(sp.get("vial")) || 5,
      water: Number(sp.get("water")) || 2,
      dose: Number(sp.get("dose")) || 250,
      syringe: Math.max(0, Math.min(2, Number(sp.get("syringe")) || 2)),
      recipe: sp.get("recipe"),
    };
  })();

  const [vialMg, setVialMg] = useState<number | null>(initial.vial);
  const [vialCustom, setVialCustom] = useState(false);

  const [waterMl, setWaterMl] = useState<number | null>(initial.water);
  const [waterCustom, setWaterCustom] = useState(false);

  const [doseMcg, setDoseMcg] = useState<number | null>(initial.dose);
  const [doseCustom, setDoseCustom] = useState(false);

  const [syringeIdx, setSyringeIdx] = useState(initial.syringe);
  const [activeRecipe, setActiveRecipe] = useState<string | null>(initial.recipe);

  const [shareCopied, setShareCopied] = useState(false);
  const [search, setSearch] = useState("");

  // Sync state to URL (replaceState — no history pollution)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    if (vialMg) params.set("vial", String(vialMg));
    if (waterMl) params.set("water", String(waterMl));
    if (doseMcg) params.set("dose", String(doseMcg));
    params.set("syringe", String(syringeIdx));
    if (activeRecipe) params.set("recipe", activeRecipe);
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", url);
  }, [vialMg, waterMl, doseMcg, syringeIdx, activeRecipe]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: lang === "bg" ? "Моя пептиден калкулатор" : "My peptide calculator",
          url,
        });
        return;
      } catch {
        /* user cancelled or unsupported */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  const handlePrint = () => window.print();

  const syringe = SYRINGE_OPTIONS[syringeIdx];

  const canCalculate =
    vialMg !== null &&
    vialMg > 0 &&
    waterMl !== null &&
    waterMl > 0 &&
    doseMcg !== null &&
    doseMcg > 0;

  const concentration = canCalculate ? (vialMg! * 1000) / waterMl! : 0;
  const doseMl = canCalculate ? doseMcg! / concentration : 0;
  const syringeUnits = doseMl * syringe.units;
  const fillPercent = (syringeUnits / syringe.units) * 100;
  const exceedsCapacity = syringeUnits > syringe.units;

  function applyRecipe(r: Preset) {
    setVialMg(r.vialMg);
    setVialCustom(false);
    setWaterMl(r.waterMl);
    setWaterCustom(false);
    setDoseMcg(r.doseMcg);
    setDoseCustom(false);
    setSyringeIdx(r.syringeIdx);
    setActiveRecipe(r.id);
  }

  function handlePreset(
    value: number,
    setter: (v: number | null) => void,
    customSetter: (v: boolean) => void,
  ) {
    setter(value);
    customSetter(false);
    setActiveRecipe(null);
  }

  function handleCustom(
    customSetter: (v: boolean) => void,
    setter: (v: number | null) => void,
  ) {
    customSetter(true);
    setter(null);
    setActiveRecipe(null);
  }

  function handleCustomInput(
    raw: string,
    setter: (v: number | null) => void,
  ) {
    const value = parseFloat(raw);
    setter(Number.isFinite(value) && value > 0 ? value : null);
    setActiveRecipe(null);
  }

  function fmt(n: number, decimals = 2): string {
    return n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  const u = UNITS[lang];

  return (
    <div className="space-y-6">
      {/* ── ONBOARDING BANNER — for first-time users ── */}
      <div className="relative overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-teal-50 p-5">
        {/* Animated gradient blob */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-200/40 blur-3xl"
          style={{ animation: "peptide-float 8s ease-in-out infinite" }}
        />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-accent text-white font-mono text-[11px] font-bold">
                i
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                {lang === "bg" ? "За начинаещи" : "For beginners"}
              </p>
            </div>
            <p className="text-sm text-navy leading-relaxed">
              {lang === "bg" ? (
                <>
                  Попълнете 4 стъпки и ще видите <strong>колко мл</strong> вода
                  да инжектирате и <strong>колко единици</strong> да изтеглите
                  със спринцовката. Не знаете откъде да започнете? Изберете
                  готов протокол по-долу.
                </>
              ) : (
                <>
                  Fill in 4 steps and see <strong>how much water</strong> to
                  inject and <strong>how many units</strong> to draw with the
                  syringe. Not sure where to start? Pick a protocol below.
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 font-mono text-[11px] text-muted">
              <span>1</span>
              <span className="w-6 h-px bg-stone-300" />
              <span>2</span>
              <span className="w-6 h-px bg-stone-300" />
              <span>3</span>
              <span className="w-6 h-px bg-stone-300" />
              <span>4</span>
            </div>
            {/* Share + Print toolbar */}
            <div className="flex items-center gap-1.5 print:hidden">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-navy hover:border-navy transition-colors"
                aria-label={lang === "bg" ? "Сподели изчислението" : "Share calculation"}
              >
                {shareCopied ? (
                  <>
                    <Check size={13} className="text-accent" />
                    {lang === "bg" ? "Копирано" : "Copied"}
                  </>
                ) : (
                  <>
                    <Share2 size={13} />
                    {lang === "bg" ? "Сподели" : "Share"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-navy hover:border-navy transition-colors"
                aria-label={lang === "bg" ? "Принтирай" : "Print"}
              >
                <Printer size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
      {/* ── LEFT: INPUTS (7 cols) ── */}
      <div className="lg:col-span-7 space-y-4">
        {/* Peptide picker — search + filtered preset cards + context panel */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FlaskConical size={16} className="text-accent" />
              <span className="text-sm font-semibold text-navy">
                {lang === "bg" ? "Изберете пептид" : "Select peptide"}
              </span>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:underline"
            >
              {lang === "bg"
                ? `Виж всички ${PEPTIDE_RECIPES.length}+`
                : `See all ${PEPTIDE_RECIPES.length}+`}
              <ArrowRight size={11} />
            </Link>
          </div>

          {/* Search input */}
          <div className="relative mb-4">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                lang === "bg"
                  ? "Търси пептид по име или категория…"
                  : "Search peptide by name or category…"
              }
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-9 text-sm text-navy placeholder:text-muted focus:border-navy focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label={lang === "bg" ? "Изчисти" : "Clear"}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-navy"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filtered preset grid */}
          {(() => {
            const q = search.trim().toLowerCase();
            const filtered = q
              ? PEPTIDE_RECIPES.filter((r) =>
                  [r.peptide, r.category[lang], r.note[lang], r.tagline[lang]]
                    .join(" ")
                    .toLowerCase()
                    .includes(q),
                )
              : PEPTIDE_RECIPES;

            if (filtered.length === 0) {
              return (
                <div className="rounded-lg border border-dashed border-border bg-white p-6 text-center">
                  <p className="text-sm text-secondary">
                    {lang === "bg"
                      ? `Няма съвпадения за "${search}".`
                      : `No matches for "${search}".`}
                  </p>
                  <Link
                    href="/shop"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    {lang === "bg"
                      ? "Разгледай целия каталог"
                      : "Browse the full catalog"}
                    <ArrowRight size={11} />
                  </Link>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {filtered.map((r) => {
                  const active = activeRecipe === r.id;
                  return (
                    <motion.button
                      key={r.id}
                      type="button"
                      onClick={() => applyRecipe(r)}
                      whileTap={{ scale: 0.97 }}
                      className={`flex flex-col rounded-lg border p-3 text-left transition-colors ${
                        active
                          ? "border-navy bg-white shadow-sm ring-2 ring-navy/10"
                          : "border-border bg-white hover:border-navy"
                      }`}
                    >
                      <p className="font-mono text-sm font-bold text-navy">
                        {r.peptide}
                      </p>
                      <p className="mt-0.5 text-[10px] text-accent font-medium">
                        {r.category[lang]} · {r.note[lang]}
                      </p>
                      <p className="mt-1 font-mono text-[10px] text-muted tabular">
                        {r.vialMg}
                        {u.mg} · {r.waterMl}
                        {u.ml} · {r.doseMcg}
                        {u.mcg}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            );
          })()}

          {/* Context card — appears after selection */}
          <AnimatePresence>
            {activeRecipe && (() => {
              const r = PEPTIDE_RECIPES.find((x) => x.id === activeRecipe);
              if (!r) return null;
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-xl border border-accent-border bg-gradient-to-br from-accent-tint via-white to-white p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy text-white">
                        <Info size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="font-display text-base font-bold text-navy">
                            {r.peptide}
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                            {r.category[lang]}
                          </p>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                          {r.tagline[lang]}
                        </p>
                        <Link
                          href={`/products/${r.productSlug}`}
                          className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-navy hover:underline"
                        >
                          {lang === "bg"
                            ? "Виж пълната страница на пептида"
                            : "View full peptide page"}
                          <ArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>

        {/* Step 1 */}
        <Step
          n={1}
          icon={<FlaskConical size={18} strokeWidth={1.5} />}
          label={t("step1")}
        >
          <div className="flex flex-wrap gap-2">
            {VIAL_PRESETS.map((v) => (
              <PresetButton
                key={v}
                label={`${v} ${u.mg}`}
                active={!vialCustom && vialMg === v}
                onClick={() => handlePreset(v, setVialMg, setVialCustom)}
              />
            ))}
            <PresetButton
              label={t("custom")}
              active={vialCustom}
              onClick={() => handleCustom(setVialCustom, setVialMg)}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted">
            {lang === "bg"
              ? "Колко милиграма пептид пише на етикета на флакона."
              : "The amount of peptide (in milligrams) written on the vial label."}
          </p>
          {vialCustom && (
            <input
              type="number"
              min="0.1"
              step="any"
              placeholder={u.mg}
              autoFocus
              className="mt-3 w-32 px-3 py-2 border border-border rounded-lg text-sm font-mono text-navy focus:border-navy focus:outline-none"
              onChange={(e) => handleCustomInput(e.target.value, setVialMg)}
            />
          )}
        </Step>

        {/* Step 2 */}
        <Step
          n={2}
          icon={<Droplets size={18} strokeWidth={1.5} />}
          label={t("step2")}
        >
          <div className="flex flex-wrap gap-2">
            {WATER_PRESETS.map((v) => (
              <PresetButton
                key={v}
                label={`${v} ${u.ml}`}
                active={!waterCustom && waterMl === v}
                onClick={() => handlePreset(v, setWaterMl, setWaterCustom)}
              />
            ))}
            <PresetButton
              label={t("custom")}
              active={waterCustom}
              onClick={() => handleCustom(setWaterCustom, setWaterMl)}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted">
            {lang === "bg"
              ? "Обемът бактериостатична вода, с която ще разтворите пептида. Повече вода → по-разредена концентрация."
              : "The amount of bacteriostatic water to dissolve the peptide. More water → more diluted concentration."}
          </p>
          {waterCustom && (
            <input
              type="number"
              min="0.1"
              step="any"
              placeholder={u.ml}
              autoFocus
              className="mt-3 w-32 px-3 py-2 border border-border rounded-lg text-sm font-mono text-navy focus:border-navy focus:outline-none"
              onChange={(e) => handleCustomInput(e.target.value, setWaterMl)}
            />
          )}
        </Step>

        {/* Step 3 */}
        <Step
          n={3}
          icon={<Crosshair size={18} strokeWidth={1.5} />}
          label={t("step3")}
        >
          <div className="flex flex-wrap gap-2">
            {DOSE_PRESETS.map((v) => (
              <PresetButton
                key={v}
                label={`${v} ${u.mcg}`}
                active={!doseCustom && doseMcg === v}
                onClick={() => handlePreset(v, setDoseMcg, setDoseCustom)}
              />
            ))}
            <PresetButton
              label={t("custom")}
              active={doseCustom}
              onClick={() => handleCustom(setDoseCustom, setDoseMcg)}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted">
            {lang === "bg"
              ? "Колко микрограма искате за един еднократен експеримент. 1 мг = 1000 мкг."
              : "How many micrograms you want for one single experiment. 1 mg = 1000 mcg."}
          </p>
          {doseCustom && (
            <input
              type="number"
              min="1"
              step="any"
              placeholder={u.mcg}
              autoFocus
              className="mt-3 w-32 px-3 py-2 border border-border rounded-lg text-sm font-mono text-navy focus:border-navy focus:outline-none"
              onChange={(e) => handleCustomInput(e.target.value, setDoseMcg)}
            />
          )}
        </Step>

        {/* Step 4 */}
        <Step
          n={4}
          icon={<Syringe size={18} strokeWidth={1.5} />}
          label={t("step4")}
        >
          <div className="flex flex-wrap gap-2">
            {SYRINGE_OPTIONS.map((s, i) => (
              <PresetButton
                key={i}
                label={`${s.ml} ${u.ml} (${s.units} ${u.unit})`}
                active={syringeIdx === i}
                onClick={() => {
                  setSyringeIdx(i);
                  setActiveRecipe(null);
                }}
              />
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted">
            {lang === "bg"
              ? "За малки обеми (<0.3 мл) изберете 0.3 мл за точност. Делението на спринцовката е в единици (ед.)."
              : "For small volumes (<0.3 ml) choose 0.3 ml for accuracy. The syringe scale is in units (U)."}
          </p>
        </Step>
      </div>

      {/* ── RIGHT: STICKY RESULTS (5 cols) ── */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-24 space-y-4">
          {/* Live preview card */}
          <div className="rounded-xl border border-border bg-gradient-to-br from-surface to-white p-6">
            <div className="flex items-center justify-between mb-1">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                {lang === "bg" ? "Live изчисление" : "Live calculation"}
              </p>
              <div className="flex items-center gap-1.5">
                <Activity size={12} className="text-teal-600" />
                <span className="font-mono text-[10px] text-teal-600">LIVE</span>
              </div>
            </div>
            <h2 className="text-base font-semibold text-navy mb-5">
              {lang === "bg"
                ? "Визуализация на реконституцията"
                : "Reconstitution visualization"}
            </h2>

            <div className="flex items-start justify-around">
              <VialVisual
                vialMg={vialMg}
                waterMl={waterMl}
                concentration={concentration}
                lang={lang}
              />
              <div className="pt-2">
                <SyringeVisual
                  fillPercent={fillPercent}
                  syringeUnits={syringeUnits}
                  totalUnits={syringe.units}
                  exceedsCapacity={exceedsCapacity}
                  lang={lang}
                />
              </div>
            </div>
          </div>

          {/* Results grid */}
          <div className="grid grid-cols-2 gap-3">
            <SpecCard
              label={t("concentration")}
              value={canCalculate ? fmt(concentration, 0) : "—"}
              unit={u.mcgPerMl}
            />
            <SpecCard
              label={t("doseVolume")}
              value={canCalculate ? fmt(doseMl) : "—"}
              unit={u.ml}
              highlight
            />
          </div>

          <SpecCard
            label={<>{t("syringeUnits")} ({syringe.ml} {u.ml})</>}
            value={canCalculate ? fmt(syringeUnits, 1) : "—"}
            unit={`${u.unit} / ${syringe.units}`}
          />

          {/* Needle gauge recommendation */}
          {canCalculate && doseMl > 0 && (
            <div className="rounded-xl border border-border bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy text-white">
                  <Syringe size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    {lang === "bg" ? "[Препоръчителна игла]" : "[Recommended needle]"}
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold text-navy">
                    {recommendNeedle(doseMl, lang).gauge}
                  </p>
                  <p className="mt-1 text-xs text-secondary leading-relaxed">
                    {recommendNeedle(doseMl, lang).reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          {exceedsCapacity && canCalculate && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <AlertTriangle
                size={18}
                className="text-red-600 shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm font-semibold text-red-700">
                  {lang === "bg" ? "Надвишен обем" : "Volume exceeded"}
                </p>
                <p className="text-xs text-red-600 mt-1 leading-relaxed">
                  {t("warning")}
                </p>
              </div>
            </motion.div>
          )}

          {/* Buy recommendation + cycle planner — appears after specs */}
          {canCalculate && (
            <BuyRecommendation
              vialMg={vialMg!}
              doseMcg={doseMcg!}
              recipe={
                activeRecipe
                  ? PEPTIDE_RECIPES.find((r) => r.id === activeRecipe) ?? null
                  : null
              }
              lang={lang}
            />
          )}

          {/* Formula reference */}
          <div className="rounded-xl border border-dashed border-border bg-white p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
              {lang === "bg" ? "Формула" : "Formula"}
            </p>
            <p className="font-mono text-xs text-secondary leading-relaxed">
              {lang === "bg" ? "концентрация" : "concentration"} = ({u.mg} × 1000) ÷ {u.ml}
              <br />
              {lang === "bg" ? "обем" : "volume"} = {lang === "bg" ? "доза" : "dose"} ({u.mcg}) ÷ {lang === "bg" ? "концентрация" : "concentration"}
              <br />
              {lang === "bg" ? "единици" : "units"} = {lang === "bg" ? "обем" : "volume"} × {lang === "bg" ? "мащаб на спринцовка" : "syringe scale"}
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
