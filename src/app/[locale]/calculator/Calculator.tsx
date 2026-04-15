"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { FlaskConical, Droplets, Crosshair, Syringe } from "lucide-react";

/* ── Preset options ── */
const VIAL_PRESETS = [2, 5, 10, 50];
const WATER_PRESETS = [1, 2, 3, 5];
const DOSE_PRESETS = [100, 250, 500, 1000];
const SYRINGE_OPTIONS = [
  { ml: 0.3, units: 30 },
  { ml: 0.5, units: 50 },
  { ml: 1.0, units: 100 },
] as const;

/* ── Syringe visualization ── */
function SyringeVisual({
  fillPercent,
  syringeUnits,
  totalUnits,
  t,
}: {
  fillPercent: number;
  syringeUnits: number;
  totalUnits: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const clampedFill = Math.min(Math.max(fillPercent, 0), 100);
  const tickCount = 10;
  const step = totalUnits / tickCount;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-muted font-mono">
        {syringeUnits.toFixed(1)} / {totalUnits} {t("units")}
      </span>
      <div className="relative w-14 h-44 border-2 border-navy rounded-b-lg bg-white overflow-hidden">
        {/* Plunger top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-3 bg-navy rounded-t-sm" />

        {/* Fill level */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-accent/20 border-t-2 border-accent transition-all duration-300"
          style={{ height: `${clampedFill}%` }}
        />

        {/* Tick marks */}
        {Array.from({ length: tickCount + 1 }, (_, i) => {
          const pct = (i / tickCount) * 100;
          const label = Math.round(i * step);
          return (
            <div
              key={i}
              className="absolute left-0 right-0 flex items-center"
              style={{ bottom: `${pct}%` }}
            >
              <div className="w-2 h-px bg-navy/40" />
              <span className="text-[9px] text-muted font-mono ml-0.5 leading-none">
                {label}
              </span>
            </div>
          );
        })}

        {/* Needle */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-px h-4 bg-navy" />
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[2px] border-r-[2px] border-t-[4px] border-l-transparent border-r-transparent border-t-navy" />
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
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`px-4 py-3 rounded-lg border text-sm font-mono text-navy cursor-pointer transition-colors ${
        active
          ? "border-2 border-navy bg-surface"
          : "border-border hover:border-navy"
      }`}
    >
      {label}
    </motion.button>
  );
}

/* ── Step wrapper ── */
function Step({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-navy">{icon}</span>
        <span className="text-sm font-semibold text-navy">{label}</span>
      </div>
      {children}
    </div>
  );
}

/* ── Main calculator ── */
export default function Calculator() {
  const t = useTranslations("calculator");

  const [vialMg, setVialMg] = useState<number | null>(5);
  const [vialCustom, setVialCustom] = useState(false);

  const [waterMl, setWaterMl] = useState<number | null>(2);
  const [waterCustom, setWaterCustom] = useState(false);

  const [doseMcg, setDoseMcg] = useState<number | null>(250);
  const [doseCustom, setDoseCustom] = useState(false);

  const [syringeIdx, setSyringeIdx] = useState(2); // default 1.0ml / 100 units

  const syringe = SYRINGE_OPTIONS[syringeIdx];

  // Calculations
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

  function handlePreset(
    value: number,
    setter: (v: number | null) => void,
    customSetter: (v: boolean) => void,
  ) {
    setter(value);
    customSetter(false);
  }

  function handleCustom(
    customSetter: (v: boolean) => void,
    setter: (v: number | null) => void,
  ) {
    customSetter(true);
    setter(null);
  }

  function handleCustomInput(
    raw: string,
    setter: (v: number | null) => void,
  ) {
    const value = parseFloat(raw);
    setter(Number.isFinite(value) && value > 0 ? value : null);
  }

  // Format number with locale-appropriate separators
  function fmt(n: number, decimals = 2): string {
    return n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  return (
    <div>
      {/* Step 1: Vial size */}
      <Step
        icon={<FlaskConical size={18} strokeWidth={1.5} />}
        label={t("step1")}
      >
        <div className="flex flex-wrap gap-2">
          {VIAL_PRESETS.map((v) => (
            <PresetButton
              key={v}
              label={`${v} mg`}
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
        {vialCustom && (
          <input
            type="number"
            min="0.1"
            step="any"
            placeholder="mg"
            autoFocus
            className="mt-3 w-32 px-3 py-2 border border-border rounded-lg text-sm font-mono text-navy focus:border-navy focus:outline-none"
            onChange={(e) => handleCustomInput(e.target.value, setVialMg)}
          />
        )}
      </Step>

      {/* Step 2: BAC water */}
      <Step
        icon={<Droplets size={18} strokeWidth={1.5} />}
        label={t("step2")}
      >
        <div className="flex flex-wrap gap-2">
          {WATER_PRESETS.map((v) => (
            <PresetButton
              key={v}
              label={`${v} ml`}
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
        {waterCustom && (
          <input
            type="number"
            min="0.1"
            step="any"
            placeholder="ml"
            autoFocus
            className="mt-3 w-32 px-3 py-2 border border-border rounded-lg text-sm font-mono text-navy focus:border-navy focus:outline-none"
            onChange={(e) => handleCustomInput(e.target.value, setWaterMl)}
          />
        )}
      </Step>

      {/* Step 3: Desired dose */}
      <Step
        icon={<Crosshair size={18} strokeWidth={1.5} />}
        label={t("step3")}
      >
        <div className="flex flex-wrap gap-2">
          {DOSE_PRESETS.map((v) => (
            <PresetButton
              key={v}
              label={`${v} mcg`}
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
        {doseCustom && (
          <input
            type="number"
            min="1"
            step="any"
            placeholder="mcg"
            autoFocus
            className="mt-3 w-32 px-3 py-2 border border-border rounded-lg text-sm font-mono text-navy focus:border-navy focus:outline-none"
            onChange={(e) => handleCustomInput(e.target.value, setDoseMcg)}
          />
        )}
      </Step>

      {/* Step 4: Syringe type */}
      <Step
        icon={<Syringe size={18} strokeWidth={1.5} />}
        label={t("step4")}
      >
        <div className="flex flex-wrap gap-2">
          {SYRINGE_OPTIONS.map((s, i) => (
            <PresetButton
              key={i}
              label={`${s.ml} ml (${s.units} ${t("units")})`}
              active={syringeIdx === i}
              onClick={() => setSyringeIdx(i)}
            />
          ))}
        </div>
      </Step>

      {/* Results */}
      {canCalculate && (
        <div className="bg-surface rounded-xl p-6 mt-2 border border-border">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Result values */}
            <div className="flex-1 space-y-5">
              <div>
                <span className="text-xs text-muted uppercase tracking-wider">
                  {t("concentration")}
                </span>
                <p className="font-mono text-2xl font-bold text-navy">
                  {fmt(concentration, 0)} mcg/ml
                </p>
              </div>
              <div>
                <span className="text-xs text-muted uppercase tracking-wider">
                  {t("doseVolume")}
                </span>
                <p className="font-mono text-2xl font-bold text-accent">
                  {fmt(doseMl)} ml
                </p>
              </div>
              <div>
                <span className="text-xs text-muted uppercase tracking-wider">
                  {t("syringeUnits")}
                </span>
                <p className="font-mono text-2xl font-bold text-navy">
                  {fmt(syringeUnits, 1)} {t("units")}
                </p>
              </div>

              {exceedsCapacity && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <span className="text-red-600 text-sm font-medium leading-relaxed">
                    {t("warning")}
                  </span>
                </div>
              )}
            </div>

            {/* Syringe visualization */}
            <div className="flex-shrink-0 pt-2">
              <SyringeVisual
                fillPercent={fillPercent}
                syringeUnits={syringeUnits}
                totalUnits={syringe.units}
                t={t}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
