"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { getFormLabel } from "@/lib/labels";
import type { Product } from "@/lib/types";

type FormValue = Product["form"];

const PURITY_BUCKETS: number[] = [98, 99];
const VIAL_BUCKETS: (number | "other")[] = [2, 5, 10, 50, "other"];
const FORM_BUCKETS: FormValue[] = [
  "lyophilized",
  "solution",
  "nasal_spray",
  "capsule",
  "accessory",
];

export type ActiveFilters = {
  priceMin: number;
  priceMax: number;
  purities: number[];
  sizes: (number | "other")[];
  forms: FormValue[];
};

/**
 * Parse filter state from a read-only URLSearchParams instance.
 * Expected URL shape: ?price=0-100&purity=98,99&size=5,10,other&form=lyophilized,solution
 */
export function parseFilters(
  params: URLSearchParams,
  absMin: number,
  absMax: number,
): ActiveFilters {
  const priceRaw = params.get("price");
  let priceMin = absMin;
  let priceMax = absMax;
  if (priceRaw) {
    const [minStr, maxStr] = priceRaw.split("-");
    const parsedMin = Number(minStr);
    const parsedMax = Number(maxStr);
    if (!Number.isNaN(parsedMin)) priceMin = Math.max(absMin, parsedMin);
    if (!Number.isNaN(parsedMax)) priceMax = Math.min(absMax, parsedMax);
  }

  const purities = (params.get("purity") ?? "")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => PURITY_BUCKETS.includes(n));

  const sizes = (params.get("size") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s === "other" ? "other" : Number(s)))
    .filter((v) =>
      v === "other" ? true : typeof v === "number" && VIAL_BUCKETS.includes(v),
    ) as (number | "other")[];

  const forms = (params.get("form") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is FormValue =>
      FORM_BUCKETS.includes(s as FormValue),
    );

  return { priceMin, priceMax, purities, sizes, forms };
}

/**
 * Apply active filters to a products list.
 */
export function applyFilters(products: Product[], filters: ActiveFilters): Product[] {
  return products.filter((p) => {
    if (p.price_eur < filters.priceMin || p.price_eur > filters.priceMax) return false;

    if (filters.purities.length > 0) {
      const pass = filters.purities.some((threshold) => p.purity_percent >= threshold);
      if (!pass) return false;
    }

    if (filters.sizes.length > 0) {
      const pass = filters.sizes.some((s) => {
        if (s === "other") {
          return p.vial_size_mg == null || ![2, 5, 10, 50].includes(p.vial_size_mg);
        }
        return p.vial_size_mg === s;
      });
      if (!pass) return false;
    }

    if (filters.forms.length > 0) {
      if (!filters.forms.includes(p.form)) return false;
    }

    return true;
  });
}

function countForPurity(products: Product[], threshold: number): number {
  return products.filter((p) => p.purity_percent >= threshold).length;
}

function countForSize(products: Product[], size: number | "other"): number {
  return products.filter((p) => {
    if (size === "other") {
      return p.vial_size_mg == null || ![2, 5, 10, 50].includes(p.vial_size_mg);
    }
    return p.vial_size_mg === size;
  }).length;
}

function countForForm(products: Product[], form: FormValue): number {
  return products.filter((p) => p.form === form).length;
}

type Props = {
  products: Product[];
  layout?: "sidebar" | "mobile";
};

export function ShopFilters({ products, layout = "sidebar" }: Props) {
  const t = useTranslations("shop.filters");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { absMin, absMax } = useMemo(() => {
    if (products.length === 0) return { absMin: 0, absMax: 200 };
    const prices = products.map((p) => p.price_eur);
    return {
      absMin: Math.floor(Math.min(...prices)),
      absMax: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const urlFilters = useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString()), absMin, absMax),
    [searchParams, absMin, absMax],
  );

  // Pending drag state: only populated while the user is actively dragging.
  // null means "show the URL values". This avoids a setState-in-effect sync.
  const [pendingPrice, setPendingPrice] = useState<{ min: number; max: number } | null>(null);
  const localMin = pendingPrice?.min ?? urlFilters.priceMin;
  const localMax = pendingPrice?.max ?? urlFilters.priceMax;

  const priceDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const qs = params.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    },
    [searchParams, pathname, router],
  );

  const commitPrice = useCallback(
    (min: number, max: number) => {
      updateParams((params) => {
        if (min <= absMin && max >= absMax) {
          params.delete("price");
        } else {
          params.set("price", `${min}-${max}`);
        }
      });
      setPendingPrice(null);
    },
    [updateParams, absMin, absMax],
  );

  const handlePriceChange = useCallback(
    (next: { min?: number; max?: number }) => {
      const nextMin = next.min ?? localMin;
      const nextMax = next.max ?? localMax;
      // Keep min <= max.
      const safeMin = Math.min(nextMin, nextMax);
      const safeMax = Math.max(nextMin, nextMax);
      setPendingPrice({ min: safeMin, max: safeMax });
      if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
      priceDebounceRef.current = setTimeout(() => {
        commitPrice(safeMin, safeMax);
      }, 300);
    },
    [localMin, localMax, commitPrice],
  );

  const toggleListValue = useCallback(
    (key: "purity" | "size" | "form", value: string) => {
      updateParams((params) => {
        const current = (params.get(key) ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const idx = current.indexOf(value);
        if (idx >= 0) current.splice(idx, 1);
        else current.push(value);
        if (current.length === 0) params.delete(key);
        else params.set(key, current.join(","));
      });
    },
    [updateParams],
  );

  const clearAll = useCallback(() => {
    if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
    setPendingPrice(null);
    updateParams((params) => {
      params.delete("price");
      params.delete("purity");
      params.delete("size");
      params.delete("form");
    });
  }, [updateParams]);

  // Clean up any pending debounce when the component unmounts.
  useEffect(
    () => () => {
      if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
    },
    [],
  );

  const activeCount =
    (urlFilters.priceMin > absMin || urlFilters.priceMax < absMax ? 1 : 0) +
    urlFilters.purities.length +
    urlFilters.sizes.length +
    urlFilters.forms.length;

  // Count products per option, excluding the filter group being counted
  // (shows how many products you'd see if you toggled that option on top of the rest).
  const productsExceptPurity = useMemo(
    () =>
      applyFilters(products, {
        priceMin: urlFilters.priceMin,
        priceMax: urlFilters.priceMax,
        purities: [],
        sizes: urlFilters.sizes,
        forms: urlFilters.forms,
      }),
    [products, urlFilters],
  );
  const productsExceptSize = useMemo(
    () =>
      applyFilters(products, {
        priceMin: urlFilters.priceMin,
        priceMax: urlFilters.priceMax,
        purities: urlFilters.purities,
        sizes: [],
        forms: urlFilters.forms,
      }),
    [products, urlFilters],
  );
  const productsExceptForm = useMemo(
    () =>
      applyFilters(products, {
        priceMin: urlFilters.priceMin,
        priceMax: urlFilters.priceMax,
        purities: urlFilters.purities,
        sizes: urlFilters.sizes,
        forms: [],
      }),
    [products, urlFilters],
  );

  const body = (
    <div className={isPending ? "opacity-80 transition-opacity" : "transition-opacity"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-navy" />
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">
            {t("filtersTitle")}
          </p>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-navy text-white text-[10px] font-semibold tabular-nums">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-[11px] font-medium text-secondary hover:text-navy transition-colors"
          >
            <X size={12} />
            {t("clearFilters")}
          </button>
        )}
      </div>

      {/* Price range */}
      <PriceRange
        label={t("priceRange")}
        min={absMin}
        max={absMax}
        valueMin={localMin}
        valueMax={localMax}
        onChange={handlePriceChange}
      />

      {/* Purity */}
      <FilterSection title={t("purity")}>
        <ul className="space-y-1.5">
          {PURITY_BUCKETS.map((threshold) => {
            const checked = urlFilters.purities.includes(threshold);
            const count = countForPurity(productsExceptPurity, threshold);
            return (
              <li key={threshold}>
                <CheckboxRow
                  label={`HPLC над ${threshold}%`}
                  checked={checked}
                  onChange={() => toggleListValue("purity", String(threshold))}
                  count={count}
                />
              </li>
            );
          })}
        </ul>
      </FilterSection>

      {/* Vial size */}
      <FilterSection title={t("vialSize")}>
        <div className="flex flex-wrap gap-1.5">
          {VIAL_BUCKETS.map((size) => {
            const key = String(size);
            const checked = urlFilters.sizes.includes(size);
            const label = size === "other" ? t("other") : `${size} ${t("mg")}`;
            const count = countForSize(productsExceptSize, size);
            return (
              <ChipButton
                key={key}
                label={label}
                checked={checked}
                count={count}
                onClick={() => toggleListValue("size", key)}
              />
            );
          })}
        </div>
      </FilterSection>

      {/* Form */}
      <FilterSection title={t("form")} last>
        <div className="flex flex-wrap gap-1.5">
          {FORM_BUCKETS.map((form) => {
            const checked = urlFilters.forms.includes(form);
            const count = countForForm(productsExceptForm, form);
            return (
              <ChipButton
                key={form}
                label={getFormLabel(form, locale)}
                checked={checked}
                count={count}
                onClick={() => toggleListValue("form", form)}
              />
            );
          })}
        </div>
      </FilterSection>

      {/* Visually hidden live region for screen readers. */}
      <p className="sr-only" aria-live="polite">
        {activeCount > 0
          ? t("activeFiltersCount", { count: activeCount })
          : t("noActiveFilters")}
      </p>
    </div>
  );

  if (layout === "mobile") {
    return (
      <details className="group lg:hidden rounded-2xl border border-border bg-white overflow-hidden">
        <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold text-navy list-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={14} />
            {t("filtersTitle")}
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-navy text-white text-[10px] font-semibold tabular-nums">
                {activeCount}
              </span>
            )}
          </span>
          <ChevronDown
            size={16}
            className="text-muted transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="border-t border-border px-4 pt-4 pb-5">{body}</div>
      </details>
    );
  }

  return (
    <div className="sticky top-24 rounded-2xl border border-border p-4 bg-white">
      {body}
    </div>
  );
}

/* ------------------------------- Subcomponents ------------------------------ */

function FilterSection({
  title,
  children,
  last,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={last ? "mt-5" : "mt-5 pb-5 border-b border-border"}>
      <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2.5">
        {title}
      </p>
      {children}
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count: number;
}) {
  const disabled = !checked && count === 0;
  return (
    <label
      className={`flex items-center justify-between gap-2 cursor-pointer group ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      }`}
    >
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="h-3.5 w-3.5 rounded border-border text-navy focus:ring-1 focus:ring-navy accent-navy"
        />
        <span
          className={`text-sm transition-colors ${
            checked ? "text-navy font-medium" : "text-secondary group-hover:text-navy"
          }`}
        >
          {label}
        </span>
      </span>
      <span className="text-[11px] font-mono tabular-nums text-muted">{count}</span>
    </label>
  );
}

function ChipButton({
  label,
  checked,
  count,
  onClick,
}: {
  label: string;
  checked: boolean;
  count: number;
  onClick: () => void;
}) {
  const disabled = !checked && count === 0;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={checked}
      className={
        checked
          ? "inline-flex items-center gap-1.5 rounded-full border border-navy bg-navy px-3 py-1 text-xs font-semibold text-white transition-colors"
          : disabled
            ? "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted opacity-40 cursor-not-allowed"
            : "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-secondary hover:border-navy hover:text-navy transition-colors"
      }
    >
      <span>{label}</span>
      <span
        className={`font-mono tabular-nums text-[10px] ${
          checked ? "text-white/80" : "text-muted"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function PriceRange({
  label,
  min,
  max,
  valueMin,
  valueMax,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (next: { min?: number; max?: number }) => void;
}) {
  const id = useId();
  const pctMin = max === min ? 0 : ((valueMin - min) / (max - min)) * 100;
  const pctMax = max === min ? 100 : ((valueMax - min) / (max - min)) * 100;

  return (
    <div className="mt-1">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xs font-mono tabular-nums text-navy">
          €{valueMin}
          <span className="text-muted px-1">—</span>€{valueMax}
        </p>
      </div>

      <div className="relative h-5 px-1">
        {/* Track */}
        <div className="absolute inset-x-1 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-border" />
        {/* Active range */}
        <div
          className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-navy"
          style={{
            left: `calc(${pctMin}% + 0.25rem)`,
            right: `calc(${100 - pctMax}% + 0.25rem)`,
          }}
        />
        {/* Min thumb */}
        <input
          id={`${id}-min`}
          type="range"
          min={min}
          max={max}
          value={valueMin}
          step={1}
          onChange={(e) => onChange({ min: Number(e.target.value) })}
          aria-label={`${label} min`}
          className="price-range-input absolute inset-0 w-full appearance-none bg-transparent pointer-events-none"
        />
        {/* Max thumb */}
        <input
          id={`${id}-max`}
          type="range"
          min={min}
          max={max}
          value={valueMax}
          step={1}
          onChange={(e) => onChange({ max: Number(e.target.value) })}
          aria-label={`${label} max`}
          className="price-range-input absolute inset-0 w-full appearance-none bg-transparent pointer-events-none"
        />
      </div>

      <style jsx>{`
        .price-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: auto;
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #0f172a;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          transition: transform 0.15s;
        }
        .price-range-input::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .price-range-input::-moz-range-thumb {
          pointer-events: auto;
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #0f172a;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .price-range-input::-webkit-slider-runnable-track {
          background: transparent;
        }
        .price-range-input::-moz-range-track {
          background: transparent;
        }
        .price-range-input:focus-visible::-webkit-slider-thumb {
          outline: 2px solid #0f172a;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
