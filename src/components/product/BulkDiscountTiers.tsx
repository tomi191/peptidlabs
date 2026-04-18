import { Package2 } from "lucide-react";

type Tier = { minQty: number; discountPercent: number };

const TIERS: Tier[] = [
  { minQty: 3, discountPercent: 5 },
  { minQty: 5, discountPercent: 10 },
  { minQty: 10, discountPercent: 15 },
];

type Props = {
  pricePerUnit: number;
  locale: string;
};

/**
 * Displays bulk-discount tiers inline on the product page.
 * Pricing math is already enforced server-side in checkout routes.
 */
export function BulkDiscountTiers({ pricePerUnit, locale }: Props) {
  const isBg = locale === "bg";

  return (
    <div className="mt-4 rounded-xl border border-dashed border-border bg-surface p-4">
      <div className="flex items-center gap-2 mb-3">
        <Package2 size={14} className="text-teal-600" />
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {isBg ? "Отстъпка за количество" : "Bulk discount"}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {TIERS.map((t) => {
          const discounted = pricePerUnit * (1 - t.discountPercent / 100);
          return (
            <div
              key={t.minQty}
              className="rounded-lg bg-white border border-border p-3 text-center"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                {t.minQty}+ {isBg ? "бр." : "pcs"}
              </p>
              <p className="mt-1 font-mono text-sm font-bold text-navy tabular">
                €{discounted.toFixed(2)}
              </p>
              <p className="mt-0.5 text-[10px] text-teal-700 font-semibold">
                −{t.discountPercent}%
              </p>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-muted leading-relaxed">
        {isBg
          ? "Отстъпката се прилага автоматично на финалната стъпка при оформяне на поръчката."
          : "Discount is applied automatically at checkout."}
      </p>
    </div>
  );
}
