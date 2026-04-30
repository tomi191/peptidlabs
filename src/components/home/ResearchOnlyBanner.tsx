"use client";

/* ResearchOnlyBanner — explicit positioning banner shown above-the-fold.
   Required for Facebook/Meta ads compliance (2026 standards):
   - Distinguishes site from medical/pharmacy positioning
   - Avoids appearing to recommend prescription drugs to consumers
   - Adult-only audience signaling */

import { Beaker, Info } from "lucide-react";

export function ResearchOnlyBanner({ locale }: { locale: "bg" | "en" }) {
  const isBg = locale === "bg";
  return (
    <div className="border-b border-border bg-navy text-white">
      <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-3 px-6 py-2.5">
        <Beaker size={14} className="shrink-0 text-cyan-300" />
        <p className="text-center text-[12px] leading-snug">
          {isBg ? (
            <>
              <strong className="font-semibold">Изследователски пептиди</strong>{" "}
              <span className="text-white/70">·</span>{" "}
              За лабораторни и научни проучвания{" "}
              <em className="text-white/60">in vitro</em>{" "}
              <span className="text-white/70">·</span>{" "}
              Не са лекарства · Не са одобрени за консумация · Само за пълнолетни (18+)
            </>
          ) : (
            <>
              <strong className="font-semibold">Research peptides</strong>{" "}
              <span className="text-white/70">·</span>{" "}
              For laboratory and scientific research{" "}
              <em className="text-white/60">in vitro</em>{" "}
              <span className="text-white/70">·</span>{" "}
              Not medications · Not approved for consumption · Adults only (18+)
            </>
          )}
        </p>
        <Info size={13} className="hidden shrink-0 text-white/50 sm:inline-block" />
      </div>
    </div>
  );
}
