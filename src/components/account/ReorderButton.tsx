"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCart } from "@/lib/store/cart";
import { RotateCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";

export type ReorderLine = {
  product: Product;
  quantity: number;
};

export default function ReorderButton({
  lines,
  orderId,
  skippedCount,
}: {
  lines: ReorderLine[];
  orderId: string;
  skippedCount: number;
}) {
  const t = useTranslations("account");
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const [loading, setLoading] = useState(false);

  async function handleReorder() {
    if (loading) return;
    if (lines.length === 0) {
      toast.error(t("reorderEmpty"));
      return;
    }

    setLoading(true);
    try {
      for (const { product, quantity } of lines) {
        for (let i = 0; i < quantity; i++) addItem(product);
      }

      toast.success(
        skippedCount > 0
          ? t("reorderPartial", {
              count: lines.length,
              skipped: skippedCount,
            })
          : t("reorderSuccess", { count: lines.length })
      );

      router.push("/checkout");
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || lines.length === 0;

  return (
    <button
      type="button"
      onClick={handleReorder}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 hover:text-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      aria-label={t("reorder") + " " + orderId}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
      ) : (
        <RotateCw className="h-3.5 w-3.5" strokeWidth={1.5} />
      )}
      {t("reorder")}
    </button>
  );
}
