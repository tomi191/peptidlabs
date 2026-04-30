"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { GitCompare, X, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useCompare } from "@/lib/store/compare";

export function CompareBar() {
  const locale = useLocale();
  const isBg = locale === "bg";
  const slugs = useCompare((s) => s.slugs);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const visible = slugs.length >= 2;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="fixed bottom-20 left-1/2 z-40 w-[min(92vw,640px)] -translate-x-1/2 md:bottom-6"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          role="region"
          aria-label={isBg ? "Сравни продукти" : "Compare products"}
        >
          <div className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-navy text-white px-4 py-3 shadow-2xl shadow-navy/20">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
              <GitCompare size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                {isBg
                  ? `${slugs.length} ${slugs.length === 2 ? "продукта" : "продукта"} избрани`
                  : `${slugs.length} ${slugs.length === 1 ? "product" : "products"} selected`}
              </p>
              <div className="mt-0.5 flex flex-wrap gap-1">
                {slugs.map((slug) => (
                  <button
                    key={slug}
                    onClick={() => remove(slug)}
                    className="group inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium hover:bg-white/20 transition-colors"
                  >
                    <span className="truncate max-w-[120px]">{slug}</span>
                    <X size={10} className="opacity-60 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={clear}
              className="hidden md:inline text-[11px] text-white/70 hover:text-white transition-colors"
            >
              {isBg ? "Изчисти" : "Clear"}
            </button>

            <Link
              href={`/compare?slugs=${slugs.join(",")}` as `/compare`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white text-navy px-4 py-2 text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              {isBg ? "Сравни" : "Compare"}
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
