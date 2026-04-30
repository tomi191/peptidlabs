"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { X, Sparkles, ArrowRight } from "lucide-react";

const STORAGE_KEY = "prelaunch-banner-dismissed-v1";

export function PreLaunchBanner() {
  const locale = useLocale();
  const isBg = locale === "bg";
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid SSR flash

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  if (dismissed) return null;

  function dismiss() {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, "true");
  }

  return (
    <div className="relative bg-gradient-to-r from-navy via-navy to-teal-900 text-white">
      <div className="mx-auto max-w-[1280px] px-6 py-2.5 flex items-center justify-center gap-3 text-center">
        <Sparkles size={14} className="text-amber-300 shrink-0" />
        <p className="text-xs sm:text-sm">
          <span className="font-semibold">
            {isBg ? "Предстартов режим:" : "Pre-launch:"}
          </span>{" "}
          <span className="text-white/85">
            {isBg
              ? "Каталогът все още не приема поръчки."
              : "The catalog is not yet accepting orders."}
          </span>{" "}
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-1 font-semibold underline decoration-amber-300/60 hover:decoration-amber-300 underline-offset-2 transition-colors"
          >
            {isBg ? "Запиши се да си първи" : "Get notified at launch"}
            <ArrowRight size={12} />
          </Link>
        </p>
        <button
          onClick={dismiss}
          aria-label={isBg ? "Затвори банера" : "Dismiss banner"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
