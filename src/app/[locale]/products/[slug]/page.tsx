import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getProductBySlug, getPublishedProducts } from "@/lib/queries";
import { createStaticSupabase } from "@/lib/supabase/static";
import { QuickSpecBar } from "@/components/product/QuickSpecBar";
import { ProductTabs } from "@/components/product/ProductTabs";
import { AddToCartButton } from "@/components/ui/AddToCartButton";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const supabase = createStaticSupabase();
  const { data } = await supabase.from("products").select("slug").eq("status", "published");
  const slugs = (data ?? []).map((p) => p.slug);
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const description =
    locale === "bg" ? product.description_bg : product.description_en;

  return {
    title: `${product.name} | PeptideLab.bg`,
    description: description ?? undefined,
  };
}

function formatPrice(product: { price_bgn: number; price_eur: number }, locale: string) {
  if (locale === "bg") {
    return `${product.price_bgn.toFixed(2)} лв`;
  }
  return `\u20AC${product.price_eur.toFixed(2)}`;
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [product, t] = await Promise.all([
    getProductBySlug(slug),
    getTranslations("product"),
  ]);

  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      locale === "bg" ? product.description_bg : product.description_en,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      price: locale === "bg" ? product.price_bgn : product.price_eur,
      priceCurrency: locale === "bg" ? "BGN" : "EUR",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  const tabTranslations = {
    overview: t("overview"),
    science: t("science"),
    coa: t("coa"),
    researchDisclaimer: t("researchDisclaimer"),
    scienceComingSoon: t("scienceComingSoon"),
    coaRequest: t("coaRequest"),
    downloadCoa: t("downloadCoa"),
  };

  return (
    <main className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[1280px] px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-secondary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/shop" className="hover:text-secondary">
                {locale === "bg" ? "Магазин" : "Shop"}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-navy font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Two-column layout */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Product image area */}
          <div className="flex aspect-square items-center justify-center rounded-xl bg-surface">
            <div className="h-32 w-12 rounded border border-border bg-white" />
          </div>

          {/* Right: Product info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Research Peptide
            </p>

            <h1 className="mt-2 text-2xl font-bold text-navy md:text-3xl">
              {product.name}
            </h1>

            <div className="mt-2">
              <QuickSpecBar product={product} />
            </div>

            <p className="mt-6 text-2xl font-bold text-navy">
              {formatPrice(product, locale)}
            </p>

            <AddToCartButton
              product={product}
              variant="full"
              label={t("addToCart")}
            />

            <p className="mt-3 text-xs italic text-muted">
              {t("researchDisclaimer")}
            </p>
          </div>
        </div>

        {/* Tabs — full width below */}
        <div className="mt-12">
          <ProductTabs
            product={product}
            locale={locale}
            translations={tabTranslations}
          />
        </div>
      </div>
    </main>
  );
}
