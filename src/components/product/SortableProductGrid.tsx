"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.name_bg?.toLowerCase().includes(q) ||
          p.use_case_tag_bg?.toLowerCase().includes(q) ||
          p.use_case_tag_en?.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "newest":
        return result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "price-asc":
        return result.sort((a, b) => a.price_eur - b.price_eur);
      case "price-desc":
        return result.sort((a, b) => b.price_eur - a.price_eur);
      case "name-az":
        return result.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return result;
    }
  }, [products, search, sort]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
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
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm placeholder:text-muted focus:border-navy focus:outline-none"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-lg border border-border px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-1 focus:ring-navy"
        >
          <option value="newest">{t("sortNewest")}</option>
          <option value="price-asc">{t("sortPriceAsc")}</option>
          <option value="price-desc">{t("sortPriceDesc")}</option>
          <option value="name-az">{t("sortNameAz")}</option>
        </select>
      </div>

      <p className="text-sm text-muted mb-4">
        {filtered.length} {t("products")}
      </p>

      {filtered.length > 0 ? (
        <ProductGrid>
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </ProductGrid>
      ) : (
        <p className="py-12 text-center text-sm text-muted">
          {t("noResults")}
        </p>
      )}
    </div>
  );
}
