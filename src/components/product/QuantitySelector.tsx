"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useLocale } from "next-intl";
import { useCart } from "@/lib/store/cart";
import type { Product } from "@/lib/types";
import { PRE_LAUNCH_MODE } from "@/lib/config";
import { NotifyMeButton } from "@/components/waitlist/NotifyMeButton";

export function QuantitySelector({
  product,
  label,
}: {
  product: Product;
  label: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const locale = useLocale();
  const isBg = locale === "bg";

  // Pre-launch: replace cart UI with waitlist signup
  if (PRE_LAUNCH_MODE) {
    return (
      <div className="mt-4">
        <NotifyMeButton
          peptideSlug={product.slug}
          source={`product:${product.slug}`}
          size="lg"
          fullWidth
        />
        <p className="mt-2 text-xs text-muted text-center">
          {isBg
            ? "Каталогът все още не приема поръчки. Запиши се в списъка."
            : "The catalog is not yet accepting orders. Join the list."}
        </p>
      </div>
    );
  }

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
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // no-op
      }
    }
    const addedLabel = isBg
      ? `${quantity} x ${product.name} добавен в кошницата`
      : `${quantity} x ${product.name} added to cart`;
    toast.success(addedLabel, {
      description: `€${(product.price_eur * quantity).toFixed(2)}`,
      duration: 2500,
      action: {
        label: isBg ? "Виж" : "View",
        onClick: () => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("peptidelab:open-cart"));
          }
        },
      },
    });
  }

  const press = {
    whileTap: { scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 400, damping: 20 },
  };

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

      <motion.button
        onClick={handleAddToCart}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-4 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
        {...press}
      >
        <span>{label}</span>
      </motion.button>
    </div>
  );
}
