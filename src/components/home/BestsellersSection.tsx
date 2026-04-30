import { ArrowRight, Flame } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { BestsellerTabs } from "@/components/home/BestsellerTabs";
import { getCategorySlugsForProducts } from "@/lib/queries";
import type { Product } from "@/lib/types";
import { ShinyText } from "@/components/ui/ShinyText";
import { Magnet } from "@/components/ui/Magnet";

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
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-tint px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-accent ring-1 ring-accent-border">
              <Flame size={11} strokeWidth={2} />
              {`TOP ${products.length}`}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold leading-none tracking-tight">
              <ShinyText speed={5}>{t("bestsellers")}</ShinyText>
            </h2>
          </div>
          <Magnet strength={0.35} radius={70}>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-navy transition-colors hover:border-navy/40 hover:bg-surface"
            >
              {t("viewAll")}
              <ArrowRight size={14} />
            </Link>
          </Magnet>
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
