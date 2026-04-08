"use client";

import { useState } from "react";
import { Plus, ShoppingBag, Loader2, Check } from "lucide-react";
import { useLocale } from "next-intl";
import { useCart } from "@/lib/store/cart";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  variant?: "icon" | "full";
  label?: string;
};

export function AddToCartButton({ product, variant = "icon", label }: Props) {
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");
  const addItem = useCart((s) => s.addItem);
  const locale = useLocale();
  const isBg = locale === "bg";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (state !== "idle") return;

    setState("adding");
    addItem(product);

    setTimeout(() => {
      setState("added");
      setTimeout(() => setState("idle"), 1500);
    }, 300);
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        disabled={state !== "idle"}
        aria-label={state === "added" ? (isBg ? "Добавено в кошницата" : "Added to cart") : (isBg ? `Добави ${product.name} в кошницата` : `Add ${product.name} to cart`)}
        className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 ${
          state === "added"
            ? "bg-accent text-white"
            : "bg-navy text-white hover:bg-navy/90"
        }`}
      >
        {state === "idle" && <Plus size={16} />}
        {state === "adding" && <Loader2 size={16} className="animate-spin" />}
        {state === "added" && <Check size={16} />}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={state !== "idle"}
      aria-label={state === "added" ? (isBg ? "Добавено в кошницата" : "Added to cart") : (isBg ? `Добави ${product.name} в кошницата` : `Add ${product.name} to cart`)}
      className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-colors duration-200 ${
        state === "added"
          ? "bg-accent text-white"
          : "bg-navy text-white hover:bg-navy/90"
      }`}
    >
      {state === "idle" && <><ShoppingBag size={16} />{label || (isBg ? "Добави в кошницата" : "Add to Cart")}</>}
      {state === "adding" && <><Loader2 size={16} className="animate-spin" />{isBg ? "Добавяне..." : "Adding..."}</>}
      {state === "added" && <><Check size={16} />{isBg ? "Добавено!" : "Added!"}</>}
    </button>
  );
}
