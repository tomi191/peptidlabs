"use client";

import { Plus } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        addItem(product);
      }}
      aria-label="Add to cart"
      className="flex h-8 w-8 items-center justify-center rounded-md bg-navy text-white transition-colors hover:bg-navy/90"
    >
      <Plus size={16} />
    </button>
  );
}
