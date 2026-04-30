"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { MotionProductGrid, MotionProductItem } from "@/components/product/MotionProductGrid";
import { ProductCard } from "@/components/product/ProductCard";
import { GroupedProductCard, groupProductVariants } from "@/components/product/GroupedProductCard";
import { applyFilters, parseFilters } from "@/components/product/ShopFilters";
import type { Product } from "@/lib/types";

type SortOption = "newest" | "price-asc" | "price-desc" | "name-az";

export function SortableProductGrid({
  products,
  locale,
}: {
  products: Product[];
  locale: string;
}) {
  const t = useTranslations("shop");
  const tFilters = useTranslations("shop.filters");
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const { absMin, absMax } = useMemo(() => {
    if (products.length === 0) return { absMin: 0, absMax: 200 };
    const prices = products.map((p) => p.price_eur);
    return {
      absMin: Math.floor(Math.min(...prices)),
      absMax: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const activeFilters = useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString()), absMin, absMax),
    [searchParams, absMin, absMax],
  );

  const filtered = useMemo(() => {
    // Pipeline: price/purity/size/form -> search -> sort
    let result = applyFilters(products, activeFilters);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.name_bg?.toLowerCase().includes(q) ||
          p.use_case_tag_bg?.toLowerCase().includes(q) ||
          p.use_case_tag_en?.toLowerCase().includes(q),
      );
    }

    const sorted = [...result];
    switch (sort) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      case "price-asc":
        return sorted.sort((a, b) => a.price_eur - b.price_eur);
      case "price-desc":
        return sorted.sort((a, b) => b.price_eur - a.price_eur);
      case "name-az":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, [products, activeFilters, search, sort]);

  const activeFilterCount =
    (activeFilters.priceMin > absMin || activeFilters.priceMax < absMax ? 1 : 0) +
    activeFilters.purities.length +
    activeFilters.sizes.length +
    activeFilters.forms.length;

  const handleClearSearch = useCallback(() => setSearch(""), []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-border text-sm placeholder:text-muted focus:border-navy focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label={tFilters("clearFilters")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-navy"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-lg border border-border px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-1 focus:ring-navy"
          aria-label={t("sortNewest")}
        >
          <option value="newest">{t("sortNewest")}</option>
          <option value="price-asc">{t("sortPriceAsc")}</option>
          <option value="price-desc">{t("sortPriceDesc")}</option>
          <option value="name-az">{t("sortNameAz")}</option>
        </select>
      </div>

      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <p className="text-sm text-muted tabular-nums">
          {tFilters("showResults", { count: filtered.length })}
        </p>
        {activeFilterCount > 0 && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent bg-accent-tint border border-accent-border rounded-full px-2 py-0.5">
            {tFilters("activeFilters", { count: activeFilterCount })}
          </span>
        )}
      </div>

      {filtered.length > 0 ? (
        <MotionProductGrid>
          {groupProductVariants(filtered).map((entry) =>
            entry.kind === "group" ? (
              <MotionProductItem key={`g:${entry.key}`}>
                <GroupedProductCard variants={entry.variants} />
              </MotionProductItem>
            ) : (
              <MotionProductItem key={entry.product.id}>
                <ProductCard product={entry.product} locale={locale} />
              </MotionProductItem>
            ),
          )}
        </MotionProductGrid>
      ) : (
        <p className="py-12 text-center text-sm text-muted">
          {tFilters("noResults")}
        </p>
      )}
    </div>
  );
}
