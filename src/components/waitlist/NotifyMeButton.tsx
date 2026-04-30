"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WaitlistForm } from "./WaitlistForm";

type Props = {
  /** Optional peptide slug to pre-select interest */
  peptideSlug?: string;
  source?: string;
  /** Visual variant */
  size?: "sm" | "md" | "lg";
  /** Full-width on the parent */
  fullWidth?: boolean;
};

/**
 * Drop-in replacement for "Add to cart" buttons during pre-launch.
 * Opens a modal with the waitlist signup form, pre-filled with peptide interest.
 */
export function NotifyMeButton({
  peptideSlug,
  source,
  size = "md",
  fullWidth = false,
}: Props) {
  const locale = useLocale();
  const isBg = locale === "bg";
  const [open, setOpen] = useState(false);

  const sizing =
    size === "lg"
      ? "px-6 py-3.5 text-base"
      : size === "sm"
        ? "px-3 py-2 text-xs"
        : "px-5 py-2.5 text-sm";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-navy text-white font-semibold hover:bg-navy/90 transition-colors ${sizing} ${
          fullWidth ? "w-full" : ""
        }`}
      >
        <Bell size={size === "sm" ? 12 : 14} strokeWidth={2} />
        {isBg ? "Уведоми ме" : "Notify me"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label={isBg ? "Затвори" : "Close"}
                className="absolute right-4 top-4 text-muted hover:text-navy transition-colors"
              >
                <X size={18} />
              </button>
              <WaitlistForm
                variant="card"
                source={source ?? `notify:${peptideSlug ?? "generic"}`}
                interestedPeptide={peptideSlug}
                title={
                  isBg
                    ? peptideSlug
                      ? "Уведоми ме за този продукт"
                      : "Уведоми ме при стартиране"
                    : peptideSlug
                      ? "Notify me about this product"
                      : "Notify me at launch"
                }
                subtitle={
                  isBg
                    ? "Каталогът все още не е активен за поръчки. Запиши се с имейл и ще те уведомим веднага щом този продукт може да бъде поръчан."
                    : "The catalog is not yet open for orders. Add your email and we will notify you the moment this product becomes orderable."
                }
                cta={isBg ? "Запиши ме" : "Add me"}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
