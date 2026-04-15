import { ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import type { Product } from "@/lib/types";
import { getFormLabel, getCategoryLabel } from "@/lib/labels";

function formatPrice(product: Product) {
  return `€${product.price_eur.toFixed(2)}`;
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
      <Link href={`/products/${product.slug}`} className="product-card-cursor block">
        <div className="relative flex h-36 items-center justify-center rounded-t-lg bg-surface" role="img" aria-label={`${product.name} product image`}>
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
            {(locale === "bg" ? product.use_case_tag_bg : product.use_case_tag_en) || getCategoryLabel(locale)}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-navy">
            {product.name}
          </h3>
          <p className="mt-1 font-mono text-[11px] text-muted tabular">
            {product.vial_size_mg ? (
              <>
                <span className="spec-value">{product.vial_size_mg}mg</span>
              </>
            ) : null}
            {product.vial_size_mg && product.form ? " · " : ""}
            {getFormLabel(product.form, locale)}
            {" · ≥"}
            <span className="spec-value">{product.purity_percent}%</span>
          </p>
        </div>
      </Link>

      <div className="flex items-center justify-between px-4 pb-4 pt-1">
        <span className="text-base font-bold text-navy tabular">
          {formatPrice(product)}
        </span>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
