"use client";

import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import type { Product } from "@/lib/types";

export function StickyAddToCart({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) {
  const [visible, setVisible] = useState(false);
  const cart = useCart();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const price = `\u20AC${product.price_eur.toFixed(2)}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white px-4 py-3 shadow-lg lg:hidden">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-navy">
            {product.name}
          </p>
          <p className="text-sm font-bold text-navy">{price}</p>
        </div>
        <button
          onClick={() => cart.addItem(product)}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white"
        >
          <ShoppingBag size={16} />
          {locale === "bg" ? "Добави" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
