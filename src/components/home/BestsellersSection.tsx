import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

export function BestsellersSection({
  products,
  locale,
}: {
  products: Product[];
  locale: string;
}) {
  const t = useTranslations("common");

  if (products.length === 0) return null;

  return (
    <section className="w-full px-6 py-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy">
            {t("bestsellers")}
          </h2>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-medium text-navy transition-colors hover:text-navy/70"
          >
            {t("viewAll")}
            <ArrowRight size={14} />
          </Link>
        </div>
        <ProductGrid>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </ProductGrid>
      </div>
    </section>
  );
}
