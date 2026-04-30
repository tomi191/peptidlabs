"use client";

/* ProductCalculator — компактен вграден калкулатор за продуктовата страница.
   Auto-prefilled от product.vial_size_mg + active tier dose. Слайдъри за
   водата и дозата, инстант пресмятане на: концентрация, обем на доза,
   единици на U-100 спринцовка, дози на флакон, препоръчителна игла.
   Линк към пълния калкулатор за курс-планиране и сравнение. */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FlaskConical,
  Droplets,
  Crosshair,
  Syringe,
  ArrowRight,
  Calculator as CalcIcon,
  Info,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

type Locale = "bg" | "en";

type Props = {
  vialSizeMg: number | null;
  defaultDoseMcg?: number;
  productName: string;
  productSlug: string;
  locale: Locale;
};

function recommendNeedle(doseMl: number, isBg: boolean) {
  const ml = isBg ? "мл." : "ml";
  if (doseMl <= 0) return { gauge: "—", reason: "" };
  if (doseMl <= 0.15)
    return {
      gauge: isBg ? "31G пен игла" : "31G pen needle",
      reason: isBg ? "Много малък обем · пен иглата е най-точна" : "Very small volume · pen needle is most precise",
    };
  if (doseMl <= 0.3)
    return {
      gauge: `31G / 0.3 ${ml} ${isBg ? "инсулинова" : "insulin"}`,
      reason: isBg ? `0.3 ${ml} спринцовка · тънка игла` : "0.3 ml syringe · thin needle",
    };
  if (doseMl <= 0.5)
    return {
      gauge: `29G / 0.5 ${ml} ${isBg ? "инсулинова" : "insulin"}`,
      reason: isBg ? `0.5 ${ml} · балансирана точност` : "0.5 ml · balanced precision",
    };
  if (doseMl <= 1.0)
    return {
      gauge: `27G-29G / 1 ${ml} ${isBg ? "инсулинова" : "insulin"}`,
      reason: isBg ? `1 ${ml} · GLP-1 типичен размер` : "1 ml · typical for GLP-1 protocols",
    };
  return {
    gauge: `27G / >1 ${ml} ${isBg ? "спринцовка" : "syringe"}`,
    reason: isBg ? `Над 1 ${ml} · раздели на 2 инжекции` : "Over 1 ml · split into 2 injections",
  };
}

export function ProductCalculator({
  vialSizeMg,
  defaultDoseMcg = 250,
  productName,
  productSlug,
  locale,
}: Props) {
  const isBg = locale === "bg";
  const vialMg = vialSizeMg ?? 5;
  const vialMcg = vialMg * 1000;

  const [waterMl, setWaterMl] = useState<number>(2);
  const [doseMcg, setDoseMcg] = useState<number>(
    Math.min(defaultDoseMcg, vialMcg),
  );

  const { concentrationMgMl, doseMl, doseUnitsU100, dosesPerVial, needle } = useMemo(() => {
    const concMgMl = vialMg / waterMl;
    const dMl = doseMcg / 1000 / concMgMl;
    const units = dMl * 100;
    const totalDoses = vialMcg / doseMcg;
    return {
      concentrationMgMl: concMgMl,
      doseMl: dMl,
      doseUnitsU100: units,
      dosesPerVial: totalDoses,
      needle: recommendNeedle(dMl, isBg),
    };
  }, [vialMg, vialMcg, waterMl, doseMcg, isBg]);

  const formatDose = (mcg: number) =>
    mcg >= 1000 ? `${(mcg / 1000).toFixed(mcg % 1000 === 0 ? 0 : 2)} mg` : `${mcg} mcg`;

  // Calculator link with prefilled params
  const calcParams = new URLSearchParams({
    vial: String(vialMg),
    water: String(waterMl),
    dose: String(doseMcg),
    syringe: doseMl <= 0.3 ? "0" : doseMl <= 0.5 ? "1" : "2",
  }).toString();

  return (
    <section className="rounded-3xl border border-border bg-white p-6 md:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
            {isBg ? "[Калкулатор]" : "[Calculator]"}
          </p>
          <h2 className="mt-2 font-display text-xl md:text-2xl font-bold text-navy tracking-tight">
            {isBg
              ? `Точна доза за ${productName}`
              : `Exact dose for ${productName}`}
          </h2>
          <p className="mt-1 text-xs text-muted">
            {isBg
              ? "Промени водата и дозата · резултатите се обновяват в реално време"
              : "Change water and dose · results update in real time"}
          </p>
        </div>
        <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
          <CalcIcon size={18} />
        </div>
      </div>

      {/* Inputs grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Vial size — fixed from product */}
        <InputCard
          icon={<FlaskConical size={14} />}
          label={isBg ? "Размер на флакон" : "Vial size"}
        >
          <div className="text-2xl font-bold text-navy tabular-nums">
            {vialMg} <span className="text-base font-medium text-muted">mg</span>
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">
            {isBg ? "от продукта" : "from product"}
          </p>
        </InputCard>

        {/* Water — slider */}
        <InputCard
          icon={<Droplets size={14} />}
          label={isBg ? "Бактериостатична вода" : "Bacteriostatic water"}
        >
          <div className="text-2xl font-bold text-navy tabular-nums">
            {waterMl.toFixed(1)} <span className="text-base font-medium text-muted">{isBg ? "мл." : "ml"}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={waterMl}
            onChange={(e) => setWaterMl(Number(e.target.value))}
            className="mt-2 w-full accent-teal-600 cursor-pointer"
            aria-label={isBg ? "Обем вода" : "Water volume"}
          />
          <div className="flex justify-between text-[9px] text-muted mt-0.5">
            <span>0.5</span><span>{isBg ? "5 мл." : "5 ml"}</span>
          </div>
        </InputCard>

        {/* Dose — slider */}
        <InputCard
          icon={<Crosshair size={14} />}
          label={isBg ? "Желана доза" : "Target dose"}
        >
          <div className="text-2xl font-bold text-navy tabular-nums">
            {formatDose(doseMcg)}
          </div>
          <input
            type="range"
            min="50"
            max={Math.min(vialMcg, 15000)}
            step={doseMcg < 1000 ? 50 : 250}
            value={doseMcg}
            onChange={(e) => setDoseMcg(Number(e.target.value))}
            className="mt-2 w-full accent-teal-600 cursor-pointer"
            aria-label={isBg ? "Доза" : "Dose"}
          />
          <div className="flex justify-between text-[9px] text-muted mt-0.5">
            <span>50 mcg</span><span>{formatDose(Math.min(vialMcg, 15000))}</span>
          </div>
        </InputCard>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${waterMl}-${doseMcg}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="mt-6 rounded-2xl bg-surface p-5"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <ResultCell
              label={isBg ? "Концентрация" : "Concentration"}
              value={`${concentrationMgMl.toFixed(2)}`}
              unit={isBg ? "мг/мл." : "mg/ml"}
            />
            <ResultCell
              label={isBg ? "Обем на доза" : "Dose volume"}
              value={doseMl < 1 ? doseMl.toFixed(3) : doseMl.toFixed(2)}
              unit={isBg ? "мл." : "ml"}
            />
            <ResultCell
              label={isBg ? "Единици U-100" : "U-100 units"}
              value={doseUnitsU100.toFixed(doseUnitsU100 < 10 ? 1 : 0)}
              unit={isBg ? "ед." : "units"}
              highlight
            />
            <ResultCell
              label={isBg ? "Дози на флакон" : "Doses per vial"}
              value={Math.floor(dosesPerVial).toString()}
              unit={isBg ? "бр." : "doses"}
            />
          </div>

          {/* Needle recommendation */}
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-white p-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy text-white">
              <Syringe size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-muted font-medium">
                {isBg ? "Препоръчителна игла" : "Recommended needle"}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-navy">
                {needle.gauge}
              </p>
              {needle.reason && (
                <p className="mt-0.5 text-[11px] text-muted leading-relaxed">
                  {needle.reason}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* CTA to full calculator */}
      <Link
        href={`/calculator?${calcParams}` as `/calculator`}
        className="group mt-5 flex items-center justify-between gap-4 rounded-xl border border-navy bg-white px-5 py-3 text-navy transition-colors hover:bg-navy hover:text-white"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-white group-hover:bg-white group-hover:text-navy transition-colors">
            <ArrowRight size={14} />
          </div>
          <div>
            <p className="text-sm font-semibold">
              {isBg
                ? "Курс-планер: флакони за 12 седмици, цена, разписание"
                : "Cycle planner: vials for 12 weeks, cost, schedule"}
            </p>
            <p className="text-[11px] opacity-70">
              {isBg ? "Отваря пълния калкулатор" : "Opens full calculator"}
            </p>
          </div>
        </div>
      </Link>

      <p className="mt-4 flex items-start gap-2 text-[11px] italic text-muted leading-relaxed">
        <Info size={12} className="mt-0.5 shrink-0" />
        <span>
          {isBg
            ? "Резултатите са референтни. За изследователски протоколи in vitro. Сравни с публикуваната литература за конкретния пептид."
            : "Results are reference values. For in vitro research protocols. Verify against published literature for the specific peptide."}
        </span>
      </p>
    </section>
  );
}

function InputCard({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted font-medium">
        {icon}
        {label}
      </div>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function ResultCell({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted font-medium">
        {label}
      </p>
      <p
        className={`mt-1 font-bold tabular-nums ${
          highlight ? "text-2xl text-teal-700" : "text-xl text-navy"
        }`}
      >
        {value}
        <span className="ml-1 text-sm font-medium text-muted">{unit}</span>
      </p>
    </div>
  );
}
