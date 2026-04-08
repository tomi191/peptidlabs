import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import {
  FlaskConical,
  ShieldCheck,
  CircleCheck,
  Truck,
  Lock,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  getProductBySlug,
  getRelatedProducts,
  getProductCategory,
  getSiblingProducts,
} from "@/lib/queries";
import { createStaticSupabase } from "@/lib/supabase/static";
import { QuickSpecBar } from "@/components/product/QuickSpecBar";
import { ProductTabs } from "@/components/product/ProductTabs";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { SpecsTable } from "@/components/product/SpecsTable";
import { FrequentlyBoughtTogether } from "@/components/product/FrequentlyBoughtTogether";
import { ProductFaq } from "@/components/product/ProductFaq";
import { ReviewsPlaceholder } from "@/components/product/ReviewsPlaceholder";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { StickyAddToCart } from "@/components/product/StickyAddToCart";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const supabase = createStaticSupabase();
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("status", "published");
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
    title: `${product.name} ${product.vial_size_mg}mg`,
    description:
      description ??
      `${product.name} research peptide. HPLC tested \u2265${product.purity_percent}% purity.`,
    openGraph: {
      title: `${product.name} | PeptideLab`,
      description: description ?? undefined,
      type: "website",
      url: `https://peptidelab.bg/${locale}/products/${slug}`,
    },
    alternates: {
      canonical: `https://peptidelab.bg/${locale}/products/${slug}`,
      languages: {
        bg: `https://peptidelab.bg/bg/products/${slug}`,
        en: `https://peptidelab.bg/en/products/${slug}`,
      },
    },
  };
}

function formatPrice(product: { price_eur: number }) {
  return `\u20AC${product.price_eur.toFixed(2)}`;
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [product, t, tTrust] = await Promise.all([
    getProductBySlug(slug),
    getTranslations("product"),
    getTranslations("trust"),
  ]);

  if (!product) notFound();

  const [relatedProducts, category, siblings] = await Promise.all([
    getRelatedProducts(product.id),
    getProductCategory(product.id),
    getSiblingProducts(product.name, product.slug),
  ]);

  const categoryName =
    locale === "bg"
      ? category?.name_bg ?? null
      : category?.name_en ?? null;

  const description =
    locale === "bg" ? product.description_bg : product.description_en;

  // Product JSON-LD
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    sku: product.sku,
    image: product.images?.[0] || `https://peptidelab.bg/placeholder-vial.svg`,
    brand: {
      "@type": "Brand",
      name: "PeptideLab",
    },
    offers: {
      "@type": "Offer",
      price: product.price_eur,
      priceCurrency: "EUR",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  // FAQ items
  const faqItems = [
    {
      question: t("faqWhat", { name: product.name }),
      answer: description ?? t("researchDisclaimer"),
    },
    { question: t("faqPurity"), answer: t("faqPurityAnswer") },
    { question: t("faqStorage"), answer: t("faqStorageAnswer") },
    { question: t("faqCoa"), answer: t("faqCoaAnswer") },
    { question: t("faqShipping"), answer: t("faqShippingAnswer") },
    { question: t("faqReturns"), answer: t("faqReturnsAnswer") },
  ];

  // FAQ JSON-LD
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const tabTranslations = {
    overview: t("overview"),
    science: t("science"),
    coa: t("coa"),
    researchDisclaimer: t("researchDisclaimer"),
    scienceComingSoon: t("scienceComingSoon"),
    coaRequest: t("coaRequest"),
    downloadCoa: t("downloadCoa"),
    researchApplications: t("researchApplications"),
    keyFeatures: t("keyFeatures"),
    keyFeature1: t("keyFeature1"),
    keyFeature2: t("keyFeature2"),
    keyFeature3: t("keyFeature3"),
    keyFeature4: t("keyFeature4"),
    aminoAcidSequence: t("aminoAcidSequence"),
    mechanismOfAction: t("mechanismOfAction"),
    halfLife: t("halfLife"),
    storageHandling: t("storageHandling"),
    pubmedReferences: t("pubmedReferences"),
    batchNumber: t("batchNumber"),
    thirdPartyNote: t("thirdPartyNote"),
  };

  const specTranslations = {
    specifications: t("specifications"),
    specName: t("specName"),
    specCas: t("specCas"),
    specFormula: t("specFormula"),
    specMw: t("specMw"),
    specPurity: t("specPurity"),
    specForm: t("specForm"),
    specAppearance: t("specAppearance"),
    specVialSize: t("specVialSize"),
    specStorage: t("specStorage"),
    specShelfLife: t("specShelfLife"),
  };

  // Split related products for "frequently bought" (3) and "related" (4)
  const frequentlyBought = relatedProducts.slice(0, 3);
  const relatedForGrid = relatedProducts.slice(0, 4);

  const inStock = product.stock > 0;

  return (
    <main className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ─── ABOVE THE FOLD ─── */}
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-secondary">
                {t("home")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/shop" className="hover:text-secondary">
                {locale === "bg" ? "Магазин" : "Shop"}
              </Link>
            </li>
            {categoryName && category && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href={`/shop?category=${category.slug}`}
                    className="hover:text-secondary"
                  >
                    {categoryName}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li className="font-medium text-navy">{product.name}</li>
          </ol>
        </nav>

        {/* Two-column layout */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* LEFT COLUMN */}
          <div>
            {/* Product image placeholder */}
            <div className="flex aspect-square items-center justify-center rounded-xl bg-surface">
              <div className="h-32 w-12 rounded border border-border bg-white" />
            </div>

            {/* Trust strip below image */}
            <div className="mt-4 flex items-center justify-center gap-6">
              <span className="inline-flex items-center gap-1 text-xs text-secondary">
                <FlaskConical size={14} className="shrink-0" />
                {t("purityGuaranteed")}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-secondary">
                <ShieldCheck size={14} className="shrink-0" />
                {t("coaIncluded")}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-secondary">
                <CircleCheck size={14} className="shrink-0" />
                {inStock ? t("inStock") : t("outOfStock")}
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            {/* Category label */}
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              {categoryName ?? "Research Peptide"}
            </p>

            {/* Product name */}
            <h1 className="mt-1 text-2xl font-bold text-navy md:text-3xl">
              {product.name}
            </h1>

            {/* QuickSpecBar */}
            <div className="mt-3">
              <QuickSpecBar product={product} />
            </div>

            {/* Size selector pills */}
            {siblings.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-muted">Size:</span>
                <Link
                  href={`/products/${product.slug}`}
                  className="px-3 py-1.5 rounded-md border-2 border-navy bg-surface text-sm font-mono font-semibold text-navy"
                >
                  {product.vial_size_mg}mg
                </Link>
                {siblings.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/products/${s.slug}`}
                    className="px-3 py-1.5 rounded-md border border-border text-sm font-mono text-secondary hover:border-navy hover:text-navy"
                  >
                    {s.vial_size_mg}mg
                  </Link>
                ))}
              </div>
            )}

            {/* Price */}
            <p className="mt-6 text-3xl font-bold text-navy">
              {formatPrice(product)}
            </p>

            {/* Bulk discount note */}
            <p className="mt-1 text-xs text-accent">{t("bulkDiscount")}</p>

            {/* Quantity selector + add to cart */}
            <QuantitySelector product={product} label={t("addToCart")} />

            {/* Stock & shipping info */}
            <div className="mt-3 space-y-1.5">
              <p className="flex items-center gap-1.5 text-xs text-secondary">
                <CircleCheck size={14} className="shrink-0 text-green-600" />
                {inStock ? (
                  <>
                    {t("inStock")} — {t("shipsWithin")}
                  </>
                ) : (
                  t("outOfStock")
                )}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-secondary">
                <Truck size={14} className="shrink-0" />
                {t("freeShippingNote")}
              </p>
            </div>

            {/* Research disclaimer */}
            <p className="mt-4 border-t border-border pt-4 text-xs italic text-muted">
              {t("researchDisclaimer")}
            </p>
          </div>
        </div>
      </div>

      {/* ─── TRUST BAR ─── */}
      <section className="w-full border-y border-border bg-surface py-6">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-y-4 px-6 lg:grid-cols-4">
          <TrustItem
            icon={<FlaskConical size={20} className="text-secondary" />}
            title={tTrust("hplcTitle") + " ≥98%"}
            sub={tTrust("hplcSub")}
          />
          <TrustItem
            icon={<ShieldCheck size={20} className="text-secondary" />}
            title={tTrust("coaTitle")}
            sub={tTrust("coaSub")}
          />
          <TrustItem
            icon={<Truck size={20} className="text-secondary" />}
            title={tTrust("shippingTitle")}
            sub={tTrust("shippingSub")}
          />
          <TrustItem
            icon={<Lock size={20} className="text-secondary" />}
            title={tTrust("paymentTitle")}
            sub={tTrust("paymentSub")}
          />
        </div>
      </section>

      {/* ─── BELOW THE FOLD CONTENT ─── */}
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Specifications */}
        <SpecsTable product={product} translations={specTranslations} />

        {/* Tabbed content */}
        <div className="mt-12">
          <ProductTabs
            product={product}
            locale={locale}
            translations={tabTranslations}
          />
        </div>

        {/* Frequently Bought Together */}
        <FrequentlyBoughtTogether
          products={frequentlyBought}
          locale={locale}
          heading={t("frequentlyBought")}
          addAllLabel={t("addAllToCart")}
        />

        {/* FAQ */}
        <ProductFaq heading={t("faq")} items={faqItems} />

        {/* Reviews placeholder */}
        <ReviewsPlaceholder
          heading={t("reviews")}
          noReviews={t("noReviews")}
          writeReview={t("writeReview")}
        />

        {/* Related Products */}
        {relatedForGrid.length > 0 && (
          <section className="mt-16 pb-16">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy">
                {t("relatedProducts")}
              </h2>
              {category && (
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="text-sm text-secondary hover:text-navy"
                >
                  {locale === "bg" ? "Виж всички" : "View all"} →
                </Link>
              )}
            </div>
            <div className="mt-6">
              <ProductGrid>
                {relatedForGrid.map((p) => (
                  <ProductCard key={p.id} product={p} locale={locale} />
                ))}
              </ProductGrid>
            </div>
          </section>
        )}
      </div>

      <StickyAddToCart product={product} locale={locale} />
    </main>
  );
}

function TrustItem({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col items-center px-4 py-3 text-center">
      {icon}
      <p className="mt-2 text-xs font-semibold text-navy">{title}</p>
      <p className="mt-0.5 text-[11px] text-muted">{sub}</p>
    </div>
  );
}
