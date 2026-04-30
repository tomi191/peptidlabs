"use client";

/* PromoBanner — тънка лента над хедъра с auto-rotate на trust съобщения.
   Dismissible с cookie за 24h. Hidden in installed PWA. */

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Truck, ShieldCheck, FlaskConical, Award, X } from "lucide-react";

const MESSAGES = {
  bg: [
    { icon: Truck, text: "Безплатна доставка над €75 с Еконт" },
    { icon: ShieldCheck, text: "Независим COA сертификат с всяка партида" },
    { icon: FlaskConical, text: "99%+ HPLC чистота · верифицирана от 3rd party лаборатория" },
    { icon: Award, text: "24-часова доставка в България" },
  ],
  en: [
    { icon: Truck, text: "Free shipping over €75 with Econt" },
    { icon: ShieldCheck, text: "Independent COA certificate with every batch" },
    { icon: FlaskConical, text: "99%+ HPLC purity · verified by 3rd party lab" },
    { icon: Award, text: "24-hour delivery within Bulgaria" },
  ],
};

const COOKIE_NAME = "pl_promo_dismissed";
const COOKIE_TTL_HOURS = 24;

function setDismissed() {
  const expires = new Date(Date.now() + COOKIE_TTL_HOURS * 60 * 60 * 1000);
  document.cookie = `${COOKIE_NAME}=1; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

function isDismissed() {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE_NAME}=1`));
}

export function PromoBanner() {
  const locale = useLocale() as "bg" | "en";
  const messages = MESSAGES[locale === "en" ? "en" : "bg"];
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!isDismissed());
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 4500);
    return () => clearInterval(id);
  }, [visible, messages.length]);

  if (!visible) return null;

  const current = messages[index];
  const Icon = current.icon;

  return (
    <div className="bg-navy text-white pwa-hide-in-app">
      <div
        className="relative mx-auto flex max-w-[1280px] items-center justify-center px-12 py-2 text-center"
        style={{ paddingTop: "max(env(safe-area-inset-top), 0.5rem)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-2 text-[12px] md:text-[13px] font-medium"
          >
            <Icon size={14} className="shrink-0 opacity-90" strokeWidth={1.8} />
            <span>{current.text}</span>
          </motion.div>
        </AnimatePresence>

        {/* Pagination dots */}
        <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 gap-1.5 md:flex">
          {messages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`${locale === "bg" ? "Съобщение" : "Message"} ${i + 1}`}
              className={`h-1 w-1 rounded-full transition-all ${
                i === index ? "w-3 bg-white" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Dismiss */}
        <button
          onClick={() => {
            setDismissed();
            setVisible(false);
          }}
          aria-label={locale === "bg" ? "Затвори" : "Close"}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
