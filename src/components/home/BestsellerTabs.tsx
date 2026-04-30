"use client";

import { useState, type ReactNode } from "react";
import { MotionProductGrid, MotionProductItem } from "@/components/product/MotionProductGrid";

const FILTERS_BG = [
  { key: "all", label: "Всички" },
  { key: "weight-loss", label: "За отслабване" },
  { key: "healing", label: "За възстановяване" },
  { key: "gh-muscle", label: "За растежен хормон" },
] as const;

const FILTERS_EN = [
  { key: "all", label: "All" },
  { key: "weight-loss", label: "Weight Loss" },
  { key: "healing", label: "Recovery" },
  { key: "gh-muscle", label: "GH & Muscle" },
] as const;

export function BestsellerTabs({
  productCards,
  productCategories,
  locale,
}: {
  productCards: ReactNode[];
  /** Array of category slug arrays — one per product (matches productCards index). */
  productCategories: string[][];
  locale: string;
}) {
  const [active, setActive] = useState("all");
  const filters = locale === "bg" ? FILTERS_BG : FILTERS_EN;

  // Determine which indices to show based on the active filter.
  // Match against actual category slugs (e.g. "weight-loss") instead of localized tag strings.
  const visibleIndices = productCards
    .map((_, i) => i)
    .filter((i) => {
      if (active === "all") return true;
      return productCategories[i]?.includes(active) ?? false;
    });

  return (
    <div>
      {/* Filter pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          // Hide a filter if no products match it (instead of fallback-showing all)
          const count =
            f.key === "all"
              ? productCards.length
              : productCategories.filter((cats) => cats.includes(f.key)).length;
          if (f.key !== "all" && count === 0) return null;

          return (
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
              <span className="ml-1.5 text-[10px] font-mono opacity-60">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product grid */}
      {visibleIndices.length > 0 ? (
        <MotionProductGrid>
          {visibleIndices.map((i) => (
            <MotionProductItem key={i}>{productCards[i]}</MotionProductItem>
          ))}
        </MotionProductGrid>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-surface/50 p-8 text-center">
          <p className="text-sm text-secondary">
            {locale === "bg"
              ? "Няма продукти в тази категория сред бестселърите."
              : "No products in this category among the bestsellers."}
          </p>
        </div>
      )}
    </div>
  );
}
