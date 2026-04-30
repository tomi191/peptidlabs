"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useWishlist } from "@/lib/store/wishlist";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

type Props = {
  /** All published products — filtered by wishlist on client */
  allProducts: Product[];
};

export function WishlistClient({ allProducts }: Props) {
  const locale = useLocale();
  const isBg = locale === "bg";
  const slugs = useWishlist((s) => s.slugs);
  const clear = useWishlist((s) => s.clear);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[40vh] grid place-items-center">
        <div className="text-sm text-muted">{isBg ? "Зареждане…" : "Loading…"}</div>
      </div>
    );
  }

  const items = allProducts.filter((p) => slugs.includes(p.slug));

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <Heart size={32} className="mx-auto mb-4 text-muted" strokeWidth={1.5} />
        <h2 className="font-display text-xl font-bold text-navy">
          {isBg ? "Списъкът ти е празен" : "Your wishlist is empty"}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-secondary">
          {isBg
            ? "Натисни сърцето на всеки продукт, за да го запазиш тук за по-късно."
            : "Tap the heart on any product to save it here for later."}
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy/90 transition-colors"
        >
          <ShoppingBag size={16} />
          {isBg ? "Към магазина" : "Browse shop"}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-secondary">
          {isBg
            ? `${items.length} ${items.length === 1 ? "продукт" : "продукта"} в любими`
            : `${items.length} ${items.length === 1 ? "product" : "products"} saved`}
        </p>
        <button
          type="button"
          onClick={() => clear()}
          className="text-xs text-muted hover:text-rose-600 transition-colors"
        >
          {isBg ? "Изчисти всички" : "Clear all"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} locale={locale} />
        ))}
      </div>
    </>
  );
}
