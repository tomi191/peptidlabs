"use client";

/* LiveTrustTicker — rotates psychological trust signals.
   Three messages rotate every 6s with smooth swap.
   "1247 COA сертификата изпратени" — semi-real (counter increments slowly)
   "Последна поръчка: София, преди 12 минути" — semi-mocked, rotates city/time
   "В момента 8 души разглеждат BPC-157" — fully synthetic but plausible */

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ShieldCheck, MapPin, Eye, Activity } from "lucide-react";

type Locale = "bg" | "en";

const CITIES_BG = ["София", "Пловдив", "Варна", "Бургас", "Стара Загора", "Русе", "Велико Търново", "Плевен"];
const CITIES_EN = ["Sofia", "Plovdiv", "Varna", "Burgas", "Stara Zagora", "Ruse", "Veliko Tarnovo", "Pleven"];

// Mix of categories — avoid leading with weight-loss-only items in rotating signals
// (Meta ads compliance: keep visible variety, not just "weight loss" peptides)
const VIEWED_PRODUCTS = ["BPC-157", "GHK-Cu", "Ипаморелин", "Селанк", "TB-500", "NAD+", "Семакс", "Епиталон"];
const VIEWED_PRODUCTS_EN = ["BPC-157", "GHK-Cu", "Ipamorelin", "Selank", "TB-500", "NAD+", "Semax", "Epitalon"];

const COA_BASE = 1247; // baseline counter — increments slowly with time

function pseudoRandom(seed: number, max: number) {
  return (Math.abs(Math.sin(seed) * 10000) % max) | 0;
}

export function LiveTrustTicker({ locale }: { locale: Locale }) {
  const isBg = locale === "bg";
  const reduced = useReducedMotion();

  // Use client time only after mount to avoid hydration mismatch
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [tick, setTick] = useState(0);

  // Rotate every 6s
  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => setTick((t) => t + 1), 6000);
    return () => clearInterval(id);
  }, [mounted]);

  // Build the three rotating signals
  const signals = (() => {
    if (!mounted) {
      return [
        {
          icon: ShieldCheck,
          text: isBg
            ? `${COA_BASE.toLocaleString("bg-BG")} COA сертификата изпратени`
            : `${COA_BASE.toLocaleString("en-US")} COA certificates shipped`,
        },
      ];
    }

    // COA counter: starts from 1247, +1 per ~3 hours (approx)
    const hoursSinceEpoch = Date.now() / (3 * 3600 * 1000);
    const coaCount = COA_BASE + Math.floor(hoursSinceEpoch % 100000);

    // Last order — pick city based on current 10-min window, time = current minute % 60
    const tenMinWindow = Math.floor(Date.now() / (10 * 60 * 1000));
    const cityIdx = pseudoRandom(tenMinWindow, CITIES_BG.length);
    const minutesAgo = (Math.floor(Date.now() / 60000) % 30) + 1;
    const city = isBg ? CITIES_BG[cityIdx] : CITIES_EN[cityIdx];

    // Currently viewing — pick product per minute, count 5-12
    const minuteSeed = Math.floor(Date.now() / 60000);
    const productIdx = pseudoRandom(minuteSeed, VIEWED_PRODUCTS.length);
    const viewerCount = 5 + pseudoRandom(minuteSeed + 7, 8);
    const product = isBg ? VIEWED_PRODUCTS[productIdx] : VIEWED_PRODUCTS_EN[productIdx];

    return [
      {
        icon: ShieldCheck,
        text: isBg
          ? `${coaCount.toLocaleString("bg-BG")} COA сертификата изпратени`
          : `${coaCount.toLocaleString("en-US")} COA certificates shipped`,
      },
      {
        icon: MapPin,
        text: isBg
          ? `Последна поръчка от ${city}, преди ${minutesAgo} мин`
          : `Last order from ${city}, ${minutesAgo} min ago`,
      },
      {
        icon: Eye,
        text: isBg
          ? `${viewerCount} души разглеждат ${product} в момента`
          : `${viewerCount} people viewing ${product} right now`,
      },
    ];
  })();

  const current = signals[tick % signals.length];
  const Icon = current.icon;

  return (
    <div className="border-y border-border bg-surface">
      <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-3 px-6 py-3">
        {/* Live pulse dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className="absolute inset-0 rounded-full bg-accent opacity-75"
            style={{
              animation: reduced ? undefined : "peptide-pulse-ring 2s ease-out infinite",
            }}
          />
          <span className="relative h-2 w-2 rounded-full bg-accent" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
          LIVE
        </span>
        <span className="hidden sm:inline-block h-3 w-px bg-border" />
        <AnimatePresence mode="wait">
          <motion.div
            key={tick}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-sm text-secondary"
          >
            <Icon size={14} className="text-accent" />
            <span>{current.text}</span>
          </motion.div>
        </AnimatePresence>
        <span className="hidden md:inline-block h-3 w-px bg-border" />
        <Activity size={12} className="hidden md:inline-block text-muted" />
      </div>
    </div>
  );
}
