"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";

const locales = ["bg", "en"] as const;
type Locale = (typeof locales)[number];

const labels: Record<Locale, string> = {
  bg: "BG",
  en: "EN",
};

export default function LocaleSwitch() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div className="bg-surface rounded-md p-0.5 flex gap-0.5">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          disabled={isPending}
          className={`px-2 py-0.5 text-xs rounded transition-colors ${
            l === locale
              ? "bg-white text-navy shadow-sm font-medium"
              : "text-muted hover:text-secondary"
          }`}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
