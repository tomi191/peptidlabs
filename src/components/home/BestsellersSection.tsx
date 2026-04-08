import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { BestsellerTabs } from "@/components/home/BestsellerTabs";
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

  // Pre-render all product cards so the client component receives ReactNode[]
  const productCards = products.map((product) => (
    <ProductCard key={product.id} product={product} locale={locale} />
  ));

  // Extract filter tags from the products for the client-side filtering
  const productTags = products.map((p) =>
    locale === "bg" ? p.use_case_tag_bg : p.use_case_tag_en
  );

  return (
    <section className="w-full px-6 py-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
        <BestsellerTabs
          productCards={productCards}
          productTags={productTags}
          locale={locale}
        />
      </div>
    </section>
  );
}
