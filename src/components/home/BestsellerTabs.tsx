"use client";

import { useState, type ReactNode } from "react";
import { MotionProductGrid, MotionProductItem } from "@/components/product/MotionProductGrid";
import { PillNav } from "@/components/ui/PillNav";

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

  // Pre-compute counts and drop empty filters once (skip re-render in PillNav).
  const pillItems = filters
    .map((f) => {
      const count =
        f.key === "all"
          ? productCards.length
          : productCategories.filter((cats) => cats.includes(f.key)).length;
      return { ...f, count };
    })
    .filter((f) => f.key === "all" || f.count > 0)
    .map((f) => ({ key: f.key, label: f.label, badge: f.count }));

  return (
    <div>
      {/* Filter pills — react-bits PillNav with morphing active background */}
      <div className="mb-6">
        <PillNav
          items={pillItems}
          active={active}
          onChange={setActive}
          layoutId="bestsellers-filter"
        />
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
