"use client";

import { useState } from "react";
import { Plus, ShoppingBag, Loader2, Check, Bell } from "lucide-react";
import { useLocale } from "next-intl";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useCart } from "@/lib/store/cart";
import type { Product } from "@/lib/types";
import { getProductDisplayName } from "@/lib/labels";
import { PRE_LAUNCH_MODE } from "@/lib/config";
import { NotifyMeButton } from "@/components/waitlist/NotifyMeButton";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";

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
  const displayName = getProductDisplayName(product, locale);

  // Pre-launch: replace with bell icon (icon variant) or NotifyMe button (full)
  if (PRE_LAUNCH_MODE) {
    if (variant === "icon") {
      return (
        <NotifyMeButtonWrapper product={product} />
      );
    }
    return (
      <div className="mt-4">
        <NotifyMeButton
          peptideSlug={product.slug}
          source={`atc:${product.slug}`}
          size="md"
          fullWidth
        />
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (state !== "idle") return;

    setState("adding");
    addItem(product);

    // Haptic feedback on mobile
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // no-op
      }
    }

    setTimeout(() => {
      setState("added");

      const addedLabel = isBg
        ? `${displayName} добавен в кошницата`
        : `${displayName} added to cart`;
      const viewLabel = isBg ? "Виж" : "View";

      toast.success(addedLabel, {
        description: `€${product.price_eur.toFixed(2)}`,
        duration: 2500,
        action: {
          label: viewLabel,
          onClick: () => {
            // Cart drawer is opened from Header; dispatch custom event for it to pick up
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("peptidelab:open-cart"));
            }
          },
        },
      });

      setTimeout(() => setState("idle"), 1500);
    }, 300);
  };

  const pressProps = {
    whileTap: { scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 400, damping: 20 },
  };

  if (variant === "icon") {
    return (
      <motion.button
        onClick={handleClick}
        disabled={state !== "idle"}
        aria-label={
          state === "added"
            ? isBg
              ? "Добавено в кошницата"
              : "Added to cart"
            : isBg
            ? `Добави ${displayName} в кошницата`
            : `Add ${displayName} to cart`
        }
        className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 ${
          state === "added"
            ? "bg-accent text-white"
            : "bg-navy text-white hover:bg-navy/90"
        }`}
        {...pressProps}
      >
        {state === "idle" && <Plus size={16} />}
        {state === "adding" && <Loader2 size={16} className="animate-spin" />}
        {state === "added" && <Check size={16} />}
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={state !== "idle"}
      aria-label={
        state === "added"
          ? isBg
            ? "Добавено в кошницата"
            : "Added to cart"
          : isBg
          ? `Добави ${displayName} в кошницата`
          : `Add ${displayName} to cart`
      }
      className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-colors duration-200 ${
        state === "added"
          ? "bg-accent text-white"
          : "bg-navy text-white hover:bg-navy/90"
      }`}
      {...pressProps}
    >
      {state === "idle" && (
        <>
          <ShoppingBag size={16} />
          {label || (isBg ? "Добави в кошницата" : "Add to Cart")}
        </>
      )}
      {state === "adding" && (
        <>
          <Loader2 size={16} className="animate-spin" />
          {isBg ? "Добавяне..." : "Adding..."}
        </>
      )}
      {state === "added" && (
        <>
          <Check size={16} />
          {isBg ? "Добавено!" : "Added!"}
        </>
      )}
    </motion.button>
  );
}

/** Inline icon-only "bell" button used during pre-launch in product card grid. */
function NotifyMeButtonWrapper({ product }: { product: Product }) {
  const locale = useLocale();
  const isBg = locale === "bg";
  const displayName = getProductDisplayName(product, locale);
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label={isBg ? `Уведоми ме за ${displayName}` : `Notify me about ${displayName}`}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-navy text-white hover:bg-navy/90 transition-colors"
        whileTap={{ scale: 0.92 }}
      >
        <Bell size={14} />
      </motion.button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setOpen(false)}
              aria-label={isBg ? "Затвори" : "Close"}
              className="absolute right-4 top-4 text-muted hover:text-navy text-xl leading-none"
            >
              ×
            </button>
            <WaitlistForm
              variant="card"
              source={`card:${product.slug}`}
              interestedPeptide={product.slug}
              title={
                isBg
                  ? `Уведоми ме за ${displayName}`
                  : `Notify me about ${displayName}`
              }
            />
          </div>
        </div>
      )}
    </>
  );
}
