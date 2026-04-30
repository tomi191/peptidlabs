"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Heart } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useWishlist } from "@/lib/store/wishlist";
import { toast } from "sonner";

type Props = {
  slug: string;
  productName: string;
  variant?: "card" | "page";
};

export function WishlistButton({ slug, productName, variant = "card" }: Props) {
  const locale = useLocale();
  const isBg = locale === "bg";
  const toggle = useWishlist((s) => s.toggle);
  const has = useWishlist((s) => s.has);
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSaved = mounted && has(slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(slug);
    const wasSaved = isSaved;
    toast(
      wasSaved
        ? isBg
          ? `${productName} премахнат от Любими`
          : `${productName} removed from Wishlist`
        : isBg
          ? `${productName} запазен в Любими ❤️`
          : `${productName} saved to Wishlist ❤️`,
      { duration: 2000 },
    );
  };

  const sizeClass =
    variant === "page" ? "h-11 w-11" : "h-8 w-8";
  const iconSize = variant === "page" ? 18 : 14;

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.85 }}
      className={`${sizeClass} flex items-center justify-center rounded-full border transition-colors ${
        isSaved
          ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
          : "border-border bg-white/90 text-muted hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
      }`}
      aria-label={
        isSaved
          ? isBg
            ? "Премахни от Любими"
            : "Remove from Wishlist"
          : isBg
            ? "Запази в Любими"
            : "Save to Wishlist"
      }
      aria-pressed={isSaved}
    >
      <Heart
        size={iconSize}
        strokeWidth={1.8}
        className={isSaved ? "fill-current" : ""}
      />
    </motion.button>
  );
}
