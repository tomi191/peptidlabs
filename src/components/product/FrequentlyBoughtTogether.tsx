"use client";

import { useCart } from "@/lib/store/cart";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

export function FrequentlyBoughtTogether({
  products,
  locale,
  heading,
  addAllLabel,
}: {
  products: Product[];
  locale: string;
  heading: string;
  addAllLabel: string;
}) {
  const addItem = useCart((s) => s.addItem);

  if (products.length === 0) return null;

  const displayed = products.slice(0, 3);

  function handleAddAll() {
    for (const p of displayed) {
      addItem(p);
    }
  }

  return (
    <section className="mt-16">
      <h2 className="text-lg font-bold text-navy">{heading}</h2>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
      <div className="mt-4">
        <button
          onClick={handleAddAll}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-surface"
        >
          {addAllLabel}
        </button>
      </div>
    </section>
  );
}
