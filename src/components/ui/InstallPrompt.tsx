"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Download, X, Share, Plus, Sparkles } from "lucide-react";
import { usePWA } from "@/lib/hooks/usePWA";
import { haptic } from "@/lib/hooks/useHaptics";

const STORAGE_KEY = "peptidlabs:install-dismissed";
const SHOW_AFTER_MS = 25_000;
const REMIND_AFTER_DAYS = 14;

export function InstallPrompt() {
  const { isStandalone, isIOS, isInstallable, prompt } = usePWA();
  const locale = useLocale();
  const isBg = locale === "bg";
  const [open, setOpen] = useState(false);
  const [iosOpen, setIosOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone) return;
    if (!isIOS && !isInstallable) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const ts = Number(raw);
      if (!Number.isNaN(ts)) {
        const elapsed = Date.now() - ts;
        if (elapsed < REMIND_AFTER_DAYS * 24 * 60 * 60 * 1000) return;
      }
    }

    const t = window.setTimeout(() => setOpen(true), SHOW_AFTER_MS);
    return () => window.clearTimeout(t);
  }, [isStandalone, isIOS, isInstallable]);

  const dismiss = () => {
    haptic("tap");
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setOpen(false);
    setIosOpen(false);
  };

  const handleInstall = async () => {
    haptic("select");
    if (isIOS) {
      setIosOpen(true);
      return;
    }
    if (prompt) {
      const outcome = await prompt();
      if (outcome === "accepted") {
        haptic("success");
        setOpen(false);
      } else {
        dismiss();
      }
    }
  };

  if (isStandalone) return null;

  return (
    <>
      <AnimatePresence>
        {open && !iosOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="md:hidden fixed left-3 right-3 z-50 pointer-events-none"
            style={{
              bottom:
                "calc(env(safe-area-inset-bottom) + 5.25rem)",
            }}
          >
            <div className="pointer-events-auto mx-auto max-w-md overflow-hidden rounded-2xl border border-border/60 bg-white shadow-[0_18px_48px_-20px_rgba(15,23,42,0.35)]">
              <div className="flex items-center gap-3 p-3.5">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #0f172a 0%, #0d9488 100%)",
                  }}
                >
                  <Sparkles size={18} strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-navy leading-tight">
                    {isBg ? "Инсталирай PeptidLabs" : "Install PeptidLabs"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-secondary leading-tight">
                    {isBg
                      ? "Бърз достъп от началния екран · работи offline"
                      : "Home-screen access · works offline"}
                  </p>
                </div>
                <button
                  onClick={handleInstall}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-navy px-3.5 py-2 text-xs font-semibold text-white active:scale-95 transition-transform"
                >
                  <Download size={13} strokeWidth={2.2} />
                  {isBg ? "Добави" : "Install"}
                </button>
                <button
                  onClick={dismiss}
                  aria-label={isBg ? "Затвори" : "Close"}
                  className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface"
                >
                  <X size={16} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {iosOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={dismiss}
              className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm"
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={isBg ? "Инструкции за инсталация" : "Install instructions"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed left-0 right-0 bottom-0 z-50 rounded-t-3xl bg-white px-5 pt-3"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 24px)" }}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
              <div className="mx-auto max-w-md">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, #0f172a 0%, #0d9488 100%)",
                      }}
                    >
                      <span className="text-sm font-semibold">P</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy leading-tight">
                        PeptidLabs
                      </p>
                      <p className="text-[11px] text-muted leading-tight">
                        peptidlabs.eu
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={dismiss}
                    aria-label={isBg ? "Затвори" : "Close"}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface"
                  >
                    <X size={18} strokeWidth={1.8} />
                  </button>
                </div>

                <h2 className="text-lg font-semibold text-navy text-balance">
                  {isBg
                    ? "Добави на началния екран за app усещане"
                    : "Add to Home Screen for the app experience"}
                </h2>
                <p className="mt-1.5 text-sm text-secondary text-pretty">
                  {isBg
                    ? "Тъй като ползвате Safari на iOS, инсталацията се прави в две стъпки:"
                    : "On iOS Safari, install in two steps:"}
                </p>

                <ol className="mt-5 space-y-3">
                  <li className="flex items-start gap-3 rounded-xl border border-border bg-surface/60 p-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-navy ring-1 ring-border">
                      1
                    </span>
                    <span className="text-sm text-navy">
                      {isBg ? "Натиснете " : "Tap "}
                      <span className="inline-flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 align-middle text-secondary ring-1 ring-border">
                        <Share size={13} strokeWidth={1.8} />
                        Share
                      </span>
                      {isBg ? " в долната лента на Safari" : " in Safari's bottom bar"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3 rounded-xl border border-border bg-surface/60 p-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-navy ring-1 ring-border">
                      2
                    </span>
                    <span className="text-sm text-navy">
                      {isBg ? "Изберете " : "Choose "}
                      <span className="inline-flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 align-middle text-secondary ring-1 ring-border">
                        <Plus size={13} strokeWidth={2} />
                        {isBg ? "Добави към Home" : "Add to Home Screen"}
                      </span>
                    </span>
                  </li>
                </ol>

                <button
                  onClick={dismiss}
                  className="mt-5 w-full rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white active:scale-[0.98] transition-transform"
                >
                  {isBg ? "Разбрано" : "Got it"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
