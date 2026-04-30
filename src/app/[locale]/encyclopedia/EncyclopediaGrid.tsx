"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { PeptideVisual } from "@/components/ui/PeptideVisual";
import { TiltedCard } from "@/components/ui/TiltedCard";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <TiltedCard key={peptide.id} intensity={4} className="h-full">
              <SpotlightCard
                radius={200}
                opacity={0.18}
                className="h-full rounded-2xl"
              >
                <Link
                  href={`/${locale}/encyclopedia/${peptide.slug}`}
                  className="group flex h-full gap-4 rounded-2xl border border-border bg-white p-4 transition-colors hover:border-teal-300/60"
                >
                  {/* Deterministic molecular visualization */}
                  <PeptideVisual slug={peptide.slug} label={peptide.name} size={88} />

                  {/* Content */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="font-mono text-sm font-bold text-navy transition-colors group-hover:text-teal-700">
                      {peptide.name}
                    </p>
                    {fullName && (
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">
                        {fullName}
                      </p>
                    )}
                    {summary && (
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-secondary">
                        {summary}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      {peptide.formula ? (
                        <p className="font-mono text-[10px] text-muted truncate">
                          {peptide.formula}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-navy transition-colors group-hover:bg-navy group-hover:text-white">
                        <ArrowUpRight size={12} strokeWidth={2} />
                      </span>
                    </div>
                  </div>
                </Link>
              </SpotlightCard>
            </TiltedCard>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-sm text-muted">{t("noResults")}</p>
      )}
    </>
  );
}
