"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { GitCompare, Check } from "lucide-react";
import { useCompare, MAX_COMPARE_ITEMS } from "@/lib/store/compare";
import { toast } from "sonner";

type Props = {
  slug: string;
  productName: string;
};

export function CompareCheckbox({ slug, productName }: Props) {
  const locale = useLocale();
  const isBg = locale === "bg";
  const toggle = useCompare((s) => s.toggle);
  const has = useCompare((s) => s.has);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSelected = mounted && has(slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggle(slug);
    if (!result.ok && result.reason === "max") {
      toast.error(
        isBg
          ? `Максимум ${MAX_COMPARE_ITEMS} продукта за сравнение`
          : `Maximum ${MAX_COMPARE_ITEMS} products to compare`,
        { duration: 2500 },
      );
      return;
    }
    if (isSelected) {
      toast(
        isBg
          ? `${productName} премахнат от сравнение`
          : `${productName} removed from compare`,
        { duration: 1800 },
      );
    } else {
      toast(
        isBg
          ? `${productName} добавен за сравнение`
          : `${productName} added to compare`,
        { duration: 1800 },
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
        isSelected
          ? "border-teal-300 bg-teal-50 text-teal-700"
          : "border-border bg-white/90 text-muted hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
      }`}
      aria-label={
        isSelected
          ? isBg
            ? "Премахни от сравнение"
            : "Remove from compare"
          : isBg
            ? "Добави за сравнение"
            : "Add to compare"
      }
      aria-pressed={isSelected}
    >
      {isSelected ? (
        <Check size={14} strokeWidth={2} />
      ) : (
        <GitCompare size={14} strokeWidth={1.8} />
      )}
    </button>
  );
}
