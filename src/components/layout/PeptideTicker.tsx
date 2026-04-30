"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

type Ticker = { name: string; purity: string; status: "ok" | "new" };

const tickers: Ticker[] = [
  { name: "BPC-157", purity: "над 99%", status: "ok" },
  { name: "TB-500", purity: "над 99%", status: "ok" },
  { name: "Semaglutide", purity: "над 98%", status: "new" },
  { name: "Ipamorelin", purity: "над 99%", status: "ok" },
  { name: "Selank", purity: "над 99%", status: "ok" },
  { name: "GHK-Cu", purity: "над 98%", status: "ok" },
  { name: "Epitalon", purity: "над 99%", status: "ok" },
  { name: "PT-141", purity: "над 99%", status: "ok" },
  { name: "Melanotan 2", purity: "над 99%", status: "ok" },
];

function Item({ t }: { t: Ticker }) {
  return (
    <span className="flex items-center gap-1.5 text-muted">
      {t.status === "new" && (
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
      )}
      <span className="text-navy font-semibold">{t.name}</span>
      <span>·</span>
      <span>{t.purity}</span>
      <span>·</span>
      <span>HPLC</span>
    </span>
  );
}

export function PeptideTicker() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (reducedMotion) {
    return (
      <div className="overflow-hidden border-b border-border bg-surface">
        <div className="flex gap-8 py-2 px-6 font-mono text-[11px] whitespace-nowrap">
          {tickers.slice(0, 3).map((t, i) => (
            <Item key={i} t={t} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border-b border-border bg-surface">
      <motion.div
        className="flex gap-8 py-2 font-mono text-[11px] whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {[...tickers, ...tickers].map((t, i) => (
          <Item key={i} t={t} />
        ))}
      </motion.div>
    </div>
  );
}
