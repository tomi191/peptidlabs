import type { Product } from "@/lib/types";
import { getFormLabel } from "@/lib/labels";

export function QuickSpecBar({ product, locale = "en" }: { product: Product; locale?: string }) {
  const specs: string[] = [];

  if (product.purity_percent != null) {
    specs.push(`\u2265${product.purity_percent}%`);
  }
  if (product.vial_size_mg != null) {
    specs.push(`${product.vial_size_mg}mg`);
  }
  if (product.form) {
    specs.push(getFormLabel(product.form, locale));
  }
  if (product.molecular_weight != null) {
    specs.push(`MW: ${product.molecular_weight}`);
  }

  if (specs.length === 0) return null;

  return (
    <p className="font-mono text-xs text-muted">
      {specs.join(" \u00B7 ")}
    </p>
  );
}
