import { ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import type { Product } from "@/lib/types";

function formatPrice(product: Product, locale: string) {
  if (locale === "bg") {
    return `${product.price_bgn.toFixed(2)} лв`;
  }
  return `€${product.price_eur.toFixed(2)}`;
}

function formatForm(form: Product["form"]) {
  const map: Record<Product["form"], string> = {
    lyophilized: "Lyophilized",
    solution: "Solution",
    nasal_spray: "Nasal Spray",
    capsule: "Capsule",
    accessory: "Accessory",
  };
  return map[form];
}

export function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`}>
        <div className="relative flex h-36 items-center justify-center rounded-t-lg bg-surface">
          {/* Placeholder vial */}
          <div className="h-16 w-6 rounded-sm border border-border bg-white" />

          {product.coa_url && (
            <span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded border border-accent-border bg-accent-tint px-1.5 py-0.5 text-[10px] font-semibold text-accent">
              <ShieldCheck size={14} />
              COA
            </span>
          )}
        </div>

        <div className="px-4 pt-4 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-accent">
            Research Peptide
          </p>
          <h3 className="mt-1 text-sm font-semibold text-navy">
            {product.name}
          </h3>
          <p className="mt-1 font-mono text-[11px] text-muted">
            {product.vial_size_mg ? `${product.vial_size_mg}mg` : ""}
            {product.vial_size_mg && product.form ? " · " : ""}
            {formatForm(product.form)}
            {` · ≥${product.purity_percent}%`}
          </p>
        </div>
      </Link>

      <div className="flex items-center justify-between px-4 pb-4 pt-1">
        <span className="text-base font-bold text-navy">
          {formatPrice(product, locale)}
        </span>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
