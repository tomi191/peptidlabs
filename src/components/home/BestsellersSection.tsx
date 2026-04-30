import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { BestsellerTabs } from "@/components/home/BestsellerTabs";
import { getCategorySlugsForProducts } from "@/lib/queries";
import type { Product } from "@/lib/types";

export async function BestsellersSection({
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

  // Fetch real category slugs for each product — used by tab filters.
  // (use_case_tag is a free-form Bulgarian/English string, not reliable for matching.)
  const slugsByProduct = await getCategorySlugsForProducts(
    products.map((p) => p.id),
  );
  const productCategories = products.map((p) => slugsByProduct[p.id] ?? []);

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
          productCategories={productCategories}
          locale={locale}
        />
      </div>
    </section>
  );
}
