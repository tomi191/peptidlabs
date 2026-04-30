"use client";

/* PeptideMechanism — interactive "live" visualization of how a peptide works.
   Calculator-style aesthetic: SVG + Motion, navy/teal palette, tabular monospace.
   Currently hardcoded for GHK-Cu as proof-of-concept; data-driven for other peptides
   will follow once layout is approved. */

import { useState, useRef } from "react";
import { motion, useInView, useReducedMotion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Dna,
  Zap,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

type Locale = "bg" | "en";

export type IconKey = "sparkles" | "zap" | "dna";

const ICON_MAP: Record<IconKey, LucideIcon> = {
  sparkles: Sparkles,
  zap: Zap,
  dna: Dna,
};

export type ActionMarker = {
  id: string;
  /** SVG coordinates as % of viewBox (0-100) */
  x: number;
  y: number;
  label: { bg: string; en: string };
  detail: { bg: string; en: string };
  stat: string;
  iconKey: IconKey;
};

export type ComparisonBar = {
  label: string;
  value: number;
  highlight?: boolean;
  caption?: { bg: string; en: string };
};

export type DeclinePoint = {
  age: number;
  value: number;
  /** Optional callout text */
  callout?: { bg: string; en: string };
};

export type PeptideMechanismData = {
  hero: {
    title: { bg: string; en: string };
    subtitle: { bg: string; en: string };
    /** Hex color for the elixir liquid — eg "#0d9488" for teal, "#2563eb" for blue */
    liquidColor: string;
  };
  bodyMap?: {
    title: { bg: string; en: string };
    markers: ActionMarker[];
  };
  decline?: {
    title: { bg: string; en: string };
    yAxisUnit: string;
    points: DeclinePoint[];
  };
  comparison?: {
    title: { bg: string; en: string };
    yAxisUnit: string;
    bars: ComparisonBar[];
  };
};

/* ============================================================
   Reveal-on-scroll wrapper
   ============================================================ */

function RevealSection({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   Section 1 — HERO with animated elixir vial
   ============================================================ */

function HeroElixir({ data, locale }: { data: PeptideMechanismData['hero']; locale: Locale }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div ref={ref} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy to-slate-900 p-8 md:p-12">
      {/* Aurora glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse 600px 300px at 30% 30%, ${data.liquidColor}55 0%, transparent 60%)`,
        }}
      />
      <div className="relative grid items-center gap-8 md:grid-cols-2">
        {/* Vial */}
        <div className="flex justify-center">
          <div className="relative h-[280px] w-[140px]">
            {/* Cap */}
            <div className="absolute left-1/2 top-0 h-5 w-16 -translate-x-1/2 rounded-t-md bg-stone-300" />
            <div className="absolute left-1/2 top-[18px] h-2 w-12 -translate-x-1/2 bg-stone-400" />
            {/* Glass body */}
            <div className="absolute left-1/2 top-7 h-[230px] w-[120px] -translate-x-1/2 overflow-hidden rounded-b-[28px] rounded-t-md border border-white/15 bg-white/5 shadow-inner backdrop-blur-sm">
              {/* Liquid */}
              <motion.div
                initial={reduced ? { height: '70%' } : { height: 0 }}
                animate={inView ? { height: '70%' } : {}}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="absolute inset-x-0 bottom-0 overflow-hidden"
                style={{
                  background: `linear-gradient(to top, ${data.liquidColor}ee, ${data.liquidColor}aa 50%, ${data.liquidColor}77)`,
                }}
              >
                {/* Wave surface */}
                {!reduced && (
                  <svg
                    className="absolute -top-1.5 left-0 h-3 w-[200%]"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    style={{ animation: 'peptide-wave 4s ease-in-out infinite' }}
                  >
                    <path
                      d="M0 6 Q 25 0 50 6 T 100 6 T 150 6 T 200 6 V 12 H 0 Z"
                      fill="rgba(255,255,255,0.25)"
                    />
                  </svg>
                )}
                {/* Floating particles (Cu²⁺ ions) */}
                {!reduced &&
                  inView &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute h-1.5 w-1.5 rounded-full bg-white/60"
                      initial={{ x: 20 + (i * 12), y: 100, opacity: 0 }}
                      animate={{
                        y: [-20, -150],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 4 + i * 0.3,
                        delay: 0.5 + i * 0.4,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
              </motion.div>
              {/* Label */}
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 rounded-sm border border-white/30 bg-white/10 px-2 py-1.5 text-center backdrop-blur-md">
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/70">
                  PeptidLabs
                </p>
                <p className="mt-0.5 font-mono text-[11px] font-bold text-white">
                  GHK-Cu
                </p>
                <p className="mt-0.5 font-mono text-[7px] text-cyan-300">
над 98% HPLC
                </p>
              </div>
            </div>
            {/* Cu²⁺ molecule callout */}
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="absolute -right-4 top-12 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center backdrop-blur-md"
            >
              <p className="font-mono text-[10px] text-white/60">Cu²⁺</p>
              <p className="font-mono text-[9px] text-cyan-300">меден йон</p>
            </motion.div>
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.7 }}
              className="absolute -left-4 top-32 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center backdrop-blur-md"
            >
              <p className="font-mono text-[10px] text-white/60">Gly-His-Lys</p>
              <p className="font-mono text-[9px] text-cyan-300">трипептид</p>
            </motion.div>
          </div>
        </div>

        {/* Text */}
        <div className="text-white">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300">
            {locale === 'bg' ? '[Жив механизъм]' : '[Live mechanism]'}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            {data.title[locale]}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            {data.subtitle[locale]}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80 backdrop-blur-sm">
            <ChevronDown size={14} className="animate-bounce" />
            <span>
              {locale === 'bg'
                ? 'Превърти за интерактивните визуализации'
                : 'Scroll for the interactive visualizations'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Section 2 — BODY ACTION MAP with tappable markers
   ============================================================ */

function BodyActionMap({
  data,
  locale,
}: {
  data: NonNullable<PeptideMechanismData['bodyMap']>;
  locale: Locale;
}) {
  const [active, setActive] = useState<string | null>(data.markers[0]?.id ?? null);
  const activeMarker = data.markers.find((m) => m.id === active);
  const reduced = useReducedMotion();

  return (
    <div className="rounded-3xl border border-border bg-white p-6 md:p-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
        {locale === 'bg' ? '[Body map]' : '[Body map]'}
      </p>
      <h3 className="mt-2 font-display text-2xl font-bold text-navy md:text-3xl">
        {data.title[locale]}
      </h3>

      <div className="mt-8 grid items-center gap-8 md:grid-cols-[1fr_1.2fr]">
        {/* Body silhouette SVG */}
        <div className="relative mx-auto max-w-[280px]">
          <svg viewBox="0 0 100 100" className="w-full" aria-hidden="true">
            {/* Faint silhouette */}
            <path
              d="M50 8 C 56 8 60 12 60 18 C 60 22 58 25 56 27 L 56 32 C 64 33 70 38 72 46 L 73 60 C 73 64 72 66 70 67 L 67 67 L 65 80 L 64 95 L 58 95 L 57 80 L 55 68 L 45 68 L 43 80 L 42 95 L 36 95 L 35 80 L 33 67 L 30 67 C 28 66 27 64 27 60 L 28 46 C 30 38 36 33 44 32 L 44 27 C 42 25 40 22 40 18 C 40 12 44 8 50 8 Z"
              fill="#f5f5f4"
              stroke="#d6d3d1"
              strokeWidth="0.5"
            />
            {/* Markers */}
            {data.markers.map((marker) => {
              const isActive = active === marker.id;
              return (
                <g key={marker.id}>
                  {/* Pulse ring */}
                  {!reduced && (
                    <circle
                      cx={marker.x}
                      cy={marker.y}
                      r="3"
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="0.6"
                      opacity="0.6"
                      style={{
                        transformOrigin: `${marker.x}px ${marker.y}px`,
                        animation: `peptide-marker-pulse 2.5s ease-out infinite`,
                        animationDelay: `${data.markers.indexOf(marker) * 0.6}s`,
                      }}
                    />
                  )}
                  {/* Hit target */}
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r="6"
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActive(marker.id)}
                    role="button"
                    aria-label={marker.label[locale]}
                  />
                  {/* Visible dot */}
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r={isActive ? '2.4' : '1.8'}
                    fill={isActive ? '#0f172a' : '#0d9488'}
                    stroke="white"
                    strokeWidth="0.6"
                    style={{ pointerEvents: 'none', transition: 'r 0.2s' }}
                  />
                </g>
              );
            })}
          </svg>
          <style>{`
            @keyframes peptide-marker-pulse {
              0%   { r: 1.8; opacity: 0.7; }
              100% { r: 8; opacity: 0; }
            }
          `}</style>

          {/* Marker buttons under silhouette for accessibility */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {data.markers.map((marker) => {
              const isActive = active === marker.id;
              return (
                <button
                  key={marker.id}
                  type="button"
                  onClick={() => setActive(marker.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'border-navy bg-navy text-white'
                      : 'border-border bg-white text-secondary hover:border-navy hover:text-navy'
                  }`}
                >
                  {marker.label[locale]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail card */}
        <AnimatePresence mode="wait">
          {activeMarker && (
            <motion.div
              key={activeMarker.id}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
                  {(() => {
                    const Icon = ICON_MAP[activeMarker.iconKey];
                    return <Icon size={18} />;
                  })()}
                </div>
                <div className="flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                    {activeMarker.label[locale]}
                  </p>
                  <p className="mt-1 font-display text-xl font-bold text-navy">
                    {activeMarker.stat}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-secondary">
                {activeMarker.detail[locale]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================
   Section 3 — AGE DECLINE CURVE (animated SVG line graph)
   ============================================================ */

function DeclineCurve({
  data,
  locale,
}: {
  data: NonNullable<PeptideMechanismData['decline']>;
  locale: Locale;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();

  const W = 600;
  const H = 280;
  const padX = 50;
  const padY = 40;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  const ages = data.points.map((p) => p.age);
  const values = data.points.map((p) => p.value);
  const maxValue = Math.max(...values);
  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);

  const xFor = (age: number) =>
    padX + ((age - minAge) / (maxAge - minAge)) * innerW;
  const yFor = (value: number) =>
    padY + (1 - value / maxValue) * innerH;

  const pathD = data.points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(p.age)} ${yFor(p.value)}`)
    .join(' ');

  return (
    <div className="rounded-3xl border border-border bg-white p-6 md:p-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
        {locale === 'bg' ? '[Хронограма]' : '[Timeline]'}
      </p>
      <h3 className="mt-2 font-display text-2xl font-bold text-navy md:text-3xl">
        {data.title[locale]}
      </h3>
      <p className="mt-2 text-sm text-secondary">
        {locale === 'bg'
          ? `Стойностите са в ${data.yAxisUnit}. Източник: Pickart 2014, BioMed Research International.`
          : `Values in ${data.yAxisUnit}. Source: Pickart 2014, BioMed Research International.`}
      </p>

      <div className="mt-6 overflow-x-auto">
        <svg
          ref={ref}
          viewBox={`0 0 ${W} ${H}`}
          className="mx-auto block h-auto w-full max-w-[600px]"
          role="img"
          aria-label={data.title[locale]}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={padX}
              x2={W - padX}
              y1={padY + t * innerH}
              y2={padY + t * innerH}
              stroke="#f5f5f4"
              strokeWidth="1"
            />
          ))}

          {/* Y axis labels */}
          {[0, maxValue / 2, maxValue].map((v, i) => (
            <text
              key={i}
              x={padX - 8}
              y={yFor(v) + 4}
              textAnchor="end"
              fontSize="11"
              fill="#a8a29e"
              fontFamily="monospace"
            >
              {Math.round(v)}
            </text>
          ))}

          {/* X axis labels */}
          {data.points.map((p) => (
            <text
              key={p.age}
              x={xFor(p.age)}
              y={H - padY + 18}
              textAnchor="middle"
              fontSize="11"
              fill="#57534e"
              fontFamily="monospace"
            >
              {p.age}
            </text>
          ))}
          <text
            x={W / 2}
            y={H - 6}
            textAnchor="middle"
            fontSize="10"
            fill="#a8a29e"
            fontFamily="monospace"
          >
            {locale === 'bg' ? 'възраст (години)' : 'age (years)'}
          </text>

          {/* Area fill under curve */}
          <motion.path
            d={`${pathD} L ${xFor(maxAge)} ${H - padY} L ${xFor(minAge)} ${H - padY} Z`}
            fill="url(#decline-gradient)"
            initial={reduced ? { opacity: 0.3 } : { opacity: 0 }}
            animate={inView ? { opacity: 0.3 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
          />
          <defs>
            <linearGradient id="decline-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* The line itself — animated stroke */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#0d9488"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />

          {/* Points + callouts */}
          {data.points.map((p, i) => (
            <g key={p.age}>
              <motion.circle
                cx={xFor(p.age)}
                cy={yFor(p.value)}
                r={5}
                fill="white"
                stroke="#0f172a"
                strokeWidth="2"
                initial={reduced ? { scale: 1 } : { scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 1.2 + i * 0.08 }}
              />
              {p.callout && (
                <motion.g
                  initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 1.6 + i * 0.1 }}
                >
                  <rect
                    x={xFor(p.age) - 50}
                    y={yFor(p.value) - 38}
                    width={100}
                    height={24}
                    rx={6}
                    fill="#0f172a"
                  />
                  <text
                    x={xFor(p.age)}
                    y={yFor(p.value) - 22}
                    textAnchor="middle"
                    fontSize="10"
                    fill="white"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {p.value} ({p.callout[locale]})
                  </text>
                </motion.g>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ============================================================
   Section 4 — COMPARISON BARS
   ============================================================ */

function ComparisonChart({
  data,
  locale,
}: {
  data: NonNullable<PeptideMechanismData['comparison']>;
  locale: Locale;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();
  const maxValue = Math.max(...data.bars.map((b) => b.value));

  return (
    <div ref={ref} className="rounded-3xl border border-border bg-white p-6 md:p-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
        {locale === 'bg' ? '[Сравнение]' : '[Comparison]'}
      </p>
      <h3 className="mt-2 font-display text-2xl font-bold text-navy md:text-3xl">
        {data.title[locale]}
      </h3>
      <p className="mt-2 text-sm text-secondary">{data.yAxisUnit}</p>

      <div className="mt-8 space-y-5">
        {data.bars.map((bar, i) => {
          const widthPct = (bar.value / maxValue) * 100;
          return (
            <div key={bar.label}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span
                  className={`text-sm font-medium ${
                    bar.highlight ? 'text-navy' : 'text-secondary'
                  }`}
                >
                  {bar.label}
                  {bar.caption && (
                    <span className="ml-2 font-mono text-[10px] text-muted">
                      {bar.caption[locale]}
                    </span>
                  )}
                </span>
                <span
                  className={`font-mono text-lg font-bold tabular ${
                    bar.highlight ? 'text-navy' : 'text-secondary'
                  }`}
                >
                  {bar.value}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-surface">
                <motion.div
                  initial={reduced ? { width: `${widthPct}%` } : { width: 0 }}
                  animate={inView ? { width: `${widthPct}%` } : {}}
                  transition={{
                    duration: 1.1,
                    delay: 0.2 + i * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`h-full rounded-full ${
                    bar.highlight
                      ? 'bg-gradient-to-r from-navy to-accent'
                      : 'bg-stone-300'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT — orchestrates the four sections
   ============================================================ */

export function PeptideMechanism({
  data,
  locale,
}: {
  data: PeptideMechanismData;
  locale: Locale;
}) {
  return (
    <div className="space-y-6 md:space-y-8">
      <RevealSection>
        <HeroElixir data={data.hero} locale={locale} />
      </RevealSection>

      {data.bodyMap && (
        <RevealSection delay={0.1}>
          <BodyActionMap data={data.bodyMap} locale={locale} />
        </RevealSection>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {data.decline && (
          <RevealSection delay={0.15}>
            <DeclineCurve data={data.decline} locale={locale} />
          </RevealSection>
        )}
        {data.comparison && (
          <RevealSection delay={0.2}>
            <ComparisonChart data={data.comparison} locale={locale} />
          </RevealSection>
        )}
      </div>
    </div>
  );
}

/* Data registry lives in ./peptide-visualizations.ts (server-safe import) */
