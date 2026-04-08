"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductCard } from "@/components/product/ProductCard";
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
  const [sort, setSort] = useState<SortOption>("newest");

  const sorted = useMemo(() => {
    const copy = [...products];
    switch (sort) {
      case "newest":
        return copy.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "price-asc":
        return copy.sort((a, b) => a.price_eur - b.price_eur);
      case "price-desc":
        return copy.sort((a, b) => b.price_eur - a.price_eur);
      case "name-az":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return copy;
    }
  }, [products, sort]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted">
          {products.length} {t("products")}
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-lg border border-border px-3 py-2 text-sm text-navy focus:outline-none focus:ring-1 focus:ring-navy"
        >
          <option value="newest">{t("sortNewest")}</option>
          <option value="price-asc">{t("sortPriceAsc")}</option>
          <option value="price-desc">{t("sortPriceDesc")}</option>
          <option value="name-az">{t("sortNameAz")}</option>
        </select>
      </div>
      <ProductGrid>
        {sorted.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </ProductGrid>
    </div>
  );
}
