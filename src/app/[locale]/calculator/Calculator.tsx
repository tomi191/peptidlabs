"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import {
  FlaskConical,
  Droplets,
  Crosshair,
  Syringe,
  AlertTriangle,
  Sparkles,
  Activity,
} from "lucide-react";
import { Abbr } from "@/components/ui/Abbr";

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
  note: { bg: string; en: string };
  vialMg: number;
  waterMl: number;
  doseMcg: number;
  syringeIdx: number;
};

const PEPTIDE_RECIPES: Preset[] = [
  {
    id: "bpc-157",
    peptide: "BPC-157",
    note: {
      bg: "Стандартен протокол",
      en: "Standard protocol",
    },
    vialMg: 5,
    waterMl: 2,
    doseMcg: 250,
    syringeIdx: 0,
  },
  {
    id: "tb-500",
    peptide: "TB-500",
    note: { bg: "Изследователски", en: "Research" },
    vialMg: 5,
    waterMl: 2,
    doseMcg: 500,
    syringeIdx: 1,
  },
  {
    id: "ipamorelin",
    peptide: "Ipamorelin",
    note: { bg: "Преди сън", en: "Pre-sleep" },
    vialMg: 5,
    waterMl: 2,
    doseMcg: 200,
    syringeIdx: 0,
  },
  {
    id: "semaglutide",
    peptide: "Semaglutide",
    note: { bg: "Веднъж седмично", en: "Weekly" },
    vialMg: 5,
    waterMl: 2,
    doseMcg: 250,
    syringeIdx: 1,
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
              ≥98% HPLC
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

/* ── Main calculator ── */
export default function Calculator() {
  const t = useTranslations("calculator");
  const locale = useLocale();
  const lang = locale === "bg" ? "bg" : "en";

  const [vialMg, setVialMg] = useState<number | null>(5);
  const [vialCustom, setVialCustom] = useState(false);

  const [waterMl, setWaterMl] = useState<number | null>(2);
  const [waterCustom, setWaterCustom] = useState(false);

  const [doseMcg, setDoseMcg] = useState<number | null>(250);
  const [doseCustom, setDoseCustom] = useState(false);

  const [syringeIdx, setSyringeIdx] = useState(2);
  const [activeRecipe, setActiveRecipe] = useState<string | null>(null);

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
          <div className="flex items-center gap-1 font-mono text-[11px] text-muted shrink-0">
            <span>1</span>
            <span className="w-6 h-px bg-stone-300" />
            <span>2</span>
            <span className="w-6 h-px bg-stone-300" />
            <span>3</span>
            <span className="w-6 h-px bg-stone-300" />
            <span>4</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
      {/* ── LEFT: INPUTS (7 cols) ── */}
      <div className="lg:col-span-7 space-y-4">
        {/* Quick presets */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-accent" />
            <span className="text-sm font-semibold text-navy">
              {lang === "bg" ? "Бързи протоколи" : "Quick protocols"}
            </span>
          </div>
          <p className="text-xs text-muted mb-4">
            {lang === "bg"
              ? "Кликнете за автоматично попълване на стандартен изследователски протокол."
              : "Click to auto-fill a standard research protocol."}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PEPTIDE_RECIPES.map((r) => {
              const active = activeRecipe === r.id;
              return (
                <motion.button
                  key={r.id}
                  type="button"
                  onClick={() => applyRecipe(r)}
                  whileTap={{ scale: 0.97 }}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    active
                      ? "border-navy bg-white shadow-sm"
                      : "border-border bg-white hover:border-navy"
                  }`}
                >
                  <p className="font-mono text-sm font-bold text-navy">
                    {r.peptide}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">
                    {r.note[lang]}
                  </p>
                  <p className="font-mono text-[10px] text-teal-600 mt-1 tabular">
                    {r.vialMg}{u.mg} · {r.waterMl}{u.ml} · {r.doseMcg}{u.mcg}
                  </p>
                </motion.button>
              );
            })}
          </div>
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
