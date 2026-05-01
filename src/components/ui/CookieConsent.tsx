"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const COPY = {
  bg: {
    text: "Използваме бисквитки за функционирането на количката, сигурност и анонимна статистика. Подробности в",
    link: "Политиката за бисквитки",
    decline: "Откажи",
    accept: "Приемам",
    label: "Съгласие за бисквитки",
  },
  en: {
    text: "We use cookies for cart functionality, security and anonymous analytics. Details in our",
    link: "Cookie Policy",
    decline: "Decline",
    accept: "Accept",
    label: "Cookie consent",
  },
} as const;

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const locale = useLocale();
  const copy = COPY[locale === "bg" ? "bg" : "en"];

  useEffect(() => {
    const consent = localStorage.getItem("peptidelab_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("peptidelab_consent", "accepted");
    // Notify GoogleAnalytics (and any other listeners) to flip consent → granted
    window.dispatchEvent(new Event("peptidlab:analytics-consent-granted"));
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem("peptidelab_consent", "declined");
    window.dispatchEvent(new Event("peptidlab:analytics-consent-denied"));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label={copy.label}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-navy text-white px-6 py-4 shadow-2xl"
    >
      <div className="mx-auto max-w-5xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/90 leading-relaxed">
          {copy.text}{" "}
          <Link
            href="/cookie-policy"
            className="underline underline-offset-2 hover:text-white"
          >
            {copy.link}
          </Link>
          .
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            {copy.decline}
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-white/90"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
