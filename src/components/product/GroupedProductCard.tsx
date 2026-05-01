"use client";

/* GroupedProductCard — една карта с няколко варианта на дозировка.
   Например: Тирзепатид има 5mg, 10mg → една карта вместо две.
   Selector показва вариантите като чипове; цената и CTA-та се променят
   спрямо избрания вариант. Single-variant продуктите използват ProductCard. */

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { COABadge } from "@/components/ui/COABadge";
import { VialPlaceholder } from "@/components/ui/VialPlaceholder";
import { WishlistButton } from "@/components/product/WishlistButton";
import { CompareCheckbox } from "@/components/product/CompareCheckbox";
import type { Product } from "@/lib/types";
import {
  getFormLabel,
  getCategoryLabel,
  getProductDisplayName,
} from "@/lib/labels";

type Props = {
  /** All variants of the same peptide (≥2). Sorted by vial_size_mg ASC. */
  variants: Product[];
};

export function GroupedProductCard({ variants }: Props) {
  const locale = useLocale();
  // Pick smallest size as default (cheapest entry — best for "от €X" framing)
  const sorted = [...variants].sort(
    (a, b) => (Number(a.vial_size_mg) || 0) - (Number(b.vial_size_mg) || 0),
  );
  const [activeId, setActiveId] = useState(sorted[0].id);
  const active = sorted.find((p) => p.id === activeId) ?? sorted[0];

  const minPrice = Math.min(...sorted.map((p) => p.price_eur));
  const baseName = (locale === "bg" ? active.name_bg : active.name) || active.name;
  const cleanedName = baseName.replace(/\s*\d+\s*(mg|мг|mcg|мкг|ml|мл\.|IU)\s*$/i, "").trim();
  const displayName = getProductDisplayName(active, locale);

  return (
    <div className="overflow-hidden rounded-lg border border-border transition-shadow hover:shadow-md">
      <Link
        href={`/products/${active.slug}`}
        className="product-card-cursor block"
      >
        <div
          className="relative flex h-36 items-center justify-center overflow-hidden rounded-t-lg bg-surface"
          role="img"
          aria-label={displayName}
          style={{ viewTransitionName: `product-image-${active.slug}` }}
        >
          {active.images && active.images.length > 0 ? (
            <Image
              src={active.images[0]}
              alt={displayName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-2"
            />
          ) : (
            <VialPlaceholder name={active.name} size="sm" />
          )}

          {active.coa_url && (
            <COABadge variant="overlay" className="absolute right-2 top-2" />
          )}

          <div className="absolute left-2 top-2 flex flex-col gap-1.5">
            <WishlistButton slug={active.slug} productName={displayName} />
            <CompareCheckbox slug={active.slug} productName={displayName} />
          </div>

          {/* Variant count badge */}
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-navy backdrop-blur-sm">
            {sorted.length}{" "}
            {locale === "bg" ? "размера" : "sizes"}
          </span>
        </div>

        <div className="px-4 pt-4 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-accent">
            {(locale === "bg" ? active.use_case_tag_bg : active.use_case_tag_en) ||
              getCategoryLabel(locale)}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-navy">
            {cleanedName}
          </h3>
          <p className="mt-1 font-mono text-[11px] text-muted tabular">
            {active.vial_size_mg ? (
              <span className="spec-value">{active.vial_size_mg}mg</span>
            ) : null}
            {active.vial_size_mg && active.form ? " · " : ""}
            {getFormLabel(active.form, locale)}
            {" · "}
            <span className="spec-value">{active.purity_percent}%</span>
          </p>
        </div>
      </Link>

      {/* Variant chips */}
      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-1">
          {sorted.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveId(v.id);
              }}
              className={`rounded-md px-2 py-1 text-[11px] font-mono tabular transition-colors ${
                v.id === activeId
                  ? "bg-navy text-white"
                  : "bg-surface text-secondary hover:bg-navy/10 hover:text-navy"
              }`}
              aria-label={`${v.vial_size_mg}mg — €${v.price_eur.toFixed(2)}`}
              aria-pressed={v.id === activeId}
            >
              {v.vial_size_mg}mg
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-4 pt-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
            {active.id === sorted[0].id && sorted.length > 1
              ? locale === "bg" ? "от" : "from"
              : ""}
          </span>
          <span className="text-base font-bold text-navy tabular leading-none">
            €{active.price_eur.toFixed(2)}
          </span>
          <span className="font-mono text-[10px] text-muted tabular leading-none mt-0.5">
            ≈ {(active.price_eur * 1.95583).toFixed(2)} лв
          </span>
          {sorted.length > 1 && active.price_eur > minPrice && (
            <span className="text-[10px] text-muted tabular leading-none mt-0.5">
              {locale === "bg" ? "най-малък" : "smallest"}: €{minPrice.toFixed(2)}
            </span>
          )}
        </div>
        <AddToCartButton product={active} />
      </div>
    </div>
  );
}

/* ── Helper: group products by canonical peptide name ── */
export type ProductGroupOrSingle =
  | { kind: "group"; key: string; variants: Product[] }
  | { kind: "single"; product: Product };

export function groupProductVariants(products: Product[]): ProductGroupOrSingle[] {
  // Group key: canonical English name (stable across locales)
  // Only group when ≥2 variants share the same name AND have vial_size_mg.
  // Accessories (no vial_size_mg) and unique products stay single.
  const groups = new Map<string, Product[]>();
  for (const p of products) {
    if (p.vial_size_mg == null) continue;
    const key = (p.name ?? "").trim().toLowerCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }

  const consumed = new Set<string>();
  const result: ProductGroupOrSingle[] = [];

  for (const p of products) {
    if (consumed.has(p.id)) continue;
    const key = (p.name ?? "").trim().toLowerCase();
    const group = groups.get(key);
    if (group && group.length >= 2 && p.vial_size_mg != null) {
      // Add the group once at the position of its first member
      result.push({ kind: "group", key, variants: group });
      group.forEach((g) => consumed.add(g.id));
    } else {
      result.push({ kind: "single", product: p });
      consumed.add(p.id);
    }
  }

  return result;
}
