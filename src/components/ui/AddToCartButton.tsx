"use client";

import { Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import type { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  variant = "icon",
  label,
}: {
  product: Product;
  variant?: "icon" | "full";
  label?: string;
}) {
  const addItem = useCart((s) => s.addItem);

  if (variant === "full") {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          addItem(product);
        }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
      >
        <ShoppingBag size={18} />
        {label ?? "Add to Cart"}
      </button>
    );
  }

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
