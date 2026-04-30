"use client";

/* UsageProtocol — renders peptide-specific usage tiers (starter/standard/extended)
   from product.scientific_data.usage_protocol JSON.
   Includes: tier selector, dose/frequency display, duration, stability, syringe,
   timing, and contextual notes. Links to calculator with prefilled URL params. */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Syringe,
  Clock,
  Calendar,
  Lightbulb,
  Sparkles,
} from "lucide-react";

type Locale = "bg" | "en";

type Tier = {
  dose_mcg: number;
  frequency_bg: string;
  frequency_en: string;
  label_bg: string;
  label_en: string;
};

export type UsageProtocolData = {
  tiers: {
    starter?: Tier;
    standard?: Tier;
    extended?: Tier;
  };
  duration_bg: string;
  duration_en: string;
  stability_days: number;
  syringe_bg: string;
  syringe_en: string;
  timing_bg: string;
  timing_en: string;
  notes_bg: string[];
  notes_en: string[];
};

type Props = {
  protocol: UsageProtocolData;
  productSlug: string;
  vialSizeMg: number | null;
  locale: Locale;
};

type TierKey = "starter" | "standard" | "extended";

export function UsageProtocol({
  protocol,
  productSlug,
  vialSizeMg,
  locale,
}: Props) {
  const tiersAvailable = (Object.keys(protocol.tiers) as TierKey[]).filter(
    (k) => protocol.tiers[k],
  );
  const [activeTier, setActiveTier] = useState<TierKey>(
    tiersAvailable.includes("standard") ? "standard" : tiersAvailable[0],
  );
  const tier = protocol.tiers[activeTier]!;
  const isBg = locale === "bg";

  const tierLabel = isBg ? tier.label_bg : tier.label_en;
  const tierFrequency = isBg ? tier.frequency_bg : tier.frequency_en;
  const duration = isBg ? protocol.duration_bg : protocol.duration_en;
  const syringe = isBg ? protocol.syringe_bg : protocol.syringe_en;
  const timing = isBg ? protocol.timing_bg : protocol.timing_en;
  const notes = isBg ? protocol.notes_bg : protocol.notes_en;

  // Format dose with unit (auto-switch mg if >= 1000 mcg)
  const dose = tier.dose_mcg;
  const mlUnit = isBg ? "мл." : "ml";
  const doseDisplay =
    dose >= 1000000
      ? `${(dose / 1000000).toFixed(0)} ${mlUnit}`
      : dose >= 1000
        ? `${(dose / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 })} mg`
        : `${dose} mcg`;

  return (
    <section className="rounded-3xl border border-border bg-white p-6 md:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
            {isBg ? "[Начин на употреба]" : "[Usage protocol]"}
          </p>
          <h2 className="mt-2 font-display text-xl md:text-2xl font-bold text-navy tracking-tight">
            {isBg
              ? "Изследователски протокол"
              : "Research protocol"}
          </h2>
          <p className="mt-1 text-xs text-muted">
            {isBg
              ? "Базирано на публикувана литература · за изследователски цели in vitro"
              : "Based on published literature · for research purposes in vitro"}
          </p>
        </div>
        <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
          <Sparkles size={18} />
        </div>
      </div>

      {/* Tier selector */}
      {tiersAvailable.length > 1 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-secondary">
            {isBg ? "Ниво:" : "Level:"}
          </span>
          {tiersAvailable.map((key) => {
            const t = protocol.tiers[key]!;
            const label = isBg ? t.label_bg : t.label_en;
            const isActive = activeTier === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTier(key)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "border-navy bg-navy text-white"
                    : "border-border bg-white text-secondary hover:border-navy hover:text-navy"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTier}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="space-y-5"
        >
          {/* Big dose card */}
          <div className="rounded-2xl border border-accent-border bg-gradient-to-br from-accent-tint via-white to-white p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              {tierLabel}
            </p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-navy tabular">
                {doseDisplay}
              </span>
              <span className="text-sm font-medium text-secondary">
                {tierFrequency}
              </span>
            </div>
          </div>

          {/* Detail grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailItem
              icon={<Calendar size={14} />}
              label={isBg ? "Продължителност" : "Duration"}
              value={duration}
            />
            <DetailItem
              icon={<Clock size={14} />}
              label={
                isBg ? "Стабилност на разтвора" : "Solution stability"
              }
              value={
                protocol.stability_days === 0
                  ? isBg
                    ? "Готов за употреба — без реконституция"
                    : "Ready-to-use — no reconstitution"
                  : isBg
                    ? `${protocol.stability_days} дни при 2-8°C`
                    : `${protocol.stability_days} days at 2-8°C`
              }
            />
            <DetailItem
              icon={<Syringe size={14} />}
              label={isBg ? "Препоръчителна спринцовка" : "Recommended syringe"}
              value={syringe}
            />
            <DetailItem
              icon={<Lightbulb size={14} />}
              label={isBg ? "Време на приложение" : "Timing"}
              value={timing}
            />
          </div>

          {/* Notes */}
          {notes.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                {isBg ? "[Бележки]" : "[Notes]"}
              </p>
              <ul className="space-y-1.5">
                {notes.map((note, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-secondary"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span className="leading-relaxed">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Disclaimer */}
      <p className="mt-4 border-t border-border pt-4 text-[11px] italic text-muted leading-relaxed">
        {isBg
          ? "Информацията се основава на публикуваната научна литература (PubMed, NEJM, Phase II/III проучвания). Предназначена единствено за изследователски цели in vitro."
          : "Information based on published scientific literature (PubMed, NEJM, Phase II/III studies). For research purposes in vitro only."}
      </p>
    </section>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-3.5">
      <div className="flex items-center gap-2 text-accent">
        {icon}
        <p className="font-mono text-[10px] uppercase tracking-widest">
          {label}
        </p>
      </div>
      <p className="mt-1.5 text-sm font-medium text-navy leading-snug">
        {value}
      </p>
    </div>
  );
}
