"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

interface Peptide {
  id: string;
  slug: string;
  name: string;
  full_name_bg: string | null;
  full_name_en: string | null;
  summary_bg: string | null;
  summary_en: string | null;
  formula: string | null;
}

export function EncyclopediaGrid({ peptides }: { peptides: Peptide[] }) {
  const [query, setQuery] = useState("");
  const locale = useLocale();
  const t = useTranslations("encyclopedia");

  const filtered = peptides.filter((p) => {
    const q = query.toLowerCase();
    if (!q) return true;
    const fullName =
      locale === "bg"
        ? p.full_name_bg || p.full_name_en
        : p.full_name_en || p.full_name_bg;
    return (
      p.name.toLowerCase().includes(q) ||
      (fullName && fullName.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <div className="relative max-w-md mb-8">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-teal-600"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((peptide) => {
          const fullName =
            locale === "bg"
              ? peptide.full_name_bg || peptide.full_name_en
              : peptide.full_name_en || peptide.full_name_bg;
          const summary =
            locale === "bg"
              ? peptide.summary_bg || peptide.summary_en
              : peptide.summary_en || peptide.summary_bg;

          return (
            <Link
              key={peptide.id}
              href={`/${locale}/encyclopedia/${peptide.slug}`}
              className="border border-border rounded-2xl p-5 hover:shadow-md transition-shadow group flex flex-col"
            >
              <p className="font-mono text-sm font-bold text-navy group-hover:text-teal-600 transition-colors">
                {peptide.name}
              </p>
              {fullName && (
                <p className="text-xs text-muted mt-1">{fullName}</p>
              )}
              {summary && (
                <p className="text-sm text-secondary mt-3 leading-relaxed line-clamp-2 flex-1">
                  {summary}
                </p>
              )}
              {peptide.formula && (
                <p className="font-mono text-xs text-muted mt-3">
                  {peptide.formula}
                </p>
              )}
              <span className="mt-3 text-xs font-medium text-teal-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                {t("readMore")}
                <ArrowRight size={12} />
              </span>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-sm text-muted">{t("noResults")}</p>
      )}
    </>
  );
}
