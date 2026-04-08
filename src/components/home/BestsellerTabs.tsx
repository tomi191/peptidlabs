"use client";

import { useState, type ReactNode } from "react";

const FILTERS_BG = [
  { key: "all", label: "Всички" },
  { key: "weight-loss", label: "За отслабване" },
  { key: "healing", label: "За възстановяване" },
  { key: "gh-muscle", label: "За GH" },
] as const;

const FILTERS_EN = [
  { key: "all", label: "All" },
  { key: "weight-loss", label: "Weight Loss" },
  { key: "healing", label: "Recovery" },
  { key: "gh-muscle", label: "GH & Muscle" },
] as const;

export function BestsellerTabs({
  productCards,
  productTags,
  locale,
}: {
  productCards: ReactNode[];
  productTags: (string | null)[];
  locale: string;
}) {
  const [active, setActive] = useState("all");
  const filters = locale === "bg" ? FILTERS_BG : FILTERS_EN;

  // Determine which indices to show based on the active filter
  const visibleIndices = productCards
    .map((_, i) => i)
    .filter((i) => {
      if (active === "all") return true;
      const tag = productTags[i];
      if (!tag) return false;
      return tag.toLowerCase().includes(active);
    });

  return (
    <div>
      {/* Filter pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActive(f.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === f.key
                ? "bg-navy text-white"
                : "bg-surface text-secondary hover:bg-border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {visibleIndices.length > 0 ? (
          visibleIndices.map((i) => (
            <div key={i}>{productCards[i]}</div>
          ))
        ) : (
          // Fallback: show all when filter matches nothing
          productCards.map((card, i) => (
            <div key={i}>{card}</div>
          ))
        )}
      </div>
    </div>
  );
}
