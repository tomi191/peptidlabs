"use client";

import { motion } from "motion/react";
import { toast } from "sonner";
import { useLocale } from "next-intl";
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
  const activeLocale = useLocale();
  const isBg = activeLocale === "bg";

  if (products.length === 0) return null;

  const displayed = products.slice(0, 3);

  function handleAddAll() {
    for (const p of displayed) {
      addItem(p);
    }
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // no-op
      }
    }
    const total = displayed.reduce((sum, p) => sum + p.price_eur, 0);
    toast.success(
      isBg
        ? `${displayed.length} продукта добавени в кошницата`
        : `${displayed.length} products added to cart`,
      {
        description: `€${total.toFixed(2)}`,
        duration: 2500,
        action: {
          label: isBg ? "Виж" : "View",
          onClick: () => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("peptidelab:open-cart"));
            }
          },
        },
      }
    );
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-navy">{heading}</h2>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
      <div className="mt-4">
        <motion.button
          onClick={handleAddAll}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-surface"
        >
          {addAllLabel}
        </motion.button>
      </div>
    </section>
  );
}
