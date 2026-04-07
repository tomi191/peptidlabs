"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import type { Product } from "@/lib/types";

export function QuantitySelector({
  product,
  label,
}: {
  product: Product;
  label: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((s) => s.addItem);

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increment() {
    setQuantity((q) => Math.min(99, q + 1));
  }

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-3">
        <button
          onClick={decrement}
          aria-label="Decrease quantity"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-secondary transition-colors hover:bg-surface"
        >
          <Minus size={16} />
        </button>
        <span className="w-10 text-center text-sm font-semibold text-navy">
          {quantity}
        </span>
        <button
          onClick={increment}
          aria-label="Increase quantity"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-secondary transition-colors hover:bg-surface"
        >
          <Plus size={16} />
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-4 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
      >
        <span>{label}</span>
      </button>
    </div>
  );
}
