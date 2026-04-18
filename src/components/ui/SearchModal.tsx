"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

type SearchProduct = {
  name: string;
  name_bg: string | null;
  slug: string;
  vial_size_mg: number | null;
  price_bgn: number;
  price_eur: number;
  form: string;
  purity_percent: number;
  use_case_tag_bg: string | null;
  use_case_tag_en: string | null;
};

import { getFormLabel } from "@/lib/labels";
import type { Product } from "@/lib/types";
import { VialPlaceholder } from "@/components/ui/VialPlaceholder";

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (open && !loaded) {
      fetch("/api/products/search")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setLoaded(true);
        })
        .catch(() => {
          setProducts([]);
          setLoaded(true);
        });
    }
  }, [open, loaded]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    },
    [open, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Global Ctrl+K / Cmd+K is handled in Header

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const filtered = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.name_bg ?? "").toLowerCase().includes(q)
      )
    : products;

  function handleSelect(slug: string) {
    onClose();
    router.push(`/products/${slug}`);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-auto mt-24 p-0 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <Search size={20} className="text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={locale === "bg" ? "Търси продукти..." : "Search products..."}
            className="text-lg w-full text-navy placeholder:text-muted focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-muted hover:text-navy transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {!loaded ? (
            <div className="px-6 py-8 text-center text-sm text-muted">
              {locale === "bg" ? "Зареждане..." : "Loading..."}
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-muted">
              {locale === "bg" ? "Няма резултати" : "No results"}
            </div>
          ) : (
            <ul>
              {filtered.map((product) => (
                <li key={product.slug}>
                  <button
                    onClick={() => handleSelect(product.slug)}
                    className="w-full text-left px-6 py-3 hover:bg-surface transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="shrink-0 flex h-16 w-12 items-center justify-center overflow-hidden rounded-md bg-surface">
                        <VialPlaceholder name={product.name} size="xs" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-navy truncate">
                          {locale === "bg" && product.name_bg
                            ? product.name_bg
                            : product.name}
                          {(() => {
                            const tag = locale === "bg" ? product.use_case_tag_bg : product.use_case_tag_en;
                            return tag ? <span className="ml-1.5 text-[10px] font-medium text-accent">{tag}</span> : null;
                          })()}
                        </p>
                        <p className="text-xs font-mono text-muted">
                          {product.vial_size_mg
                            ? `${product.vial_size_mg}mg`
                            : ""}
                          {product.vial_size_mg && product.form ? " · " : ""}
                          {getFormLabel(product.form as Product["form"], locale)}
                          {` · ≥${product.purity_percent}%`}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-navy shrink-0 tabular">
                      €{product.price_eur.toFixed(2)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
