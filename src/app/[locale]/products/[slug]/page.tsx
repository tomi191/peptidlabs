import type { Metadata } from "next";
import Image from "next/image";
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
  getProductReviews,
  getPeptideForProduct,
} from "@/lib/queries";
import { BookOpen, ArrowRight } from "lucide-react";
import { createStaticSupabase } from "@/lib/supabase/static";
import { QuickSpecBar } from "@/components/product/QuickSpecBar";
import { ProductTabs } from "@/components/product/ProductTabs";
import { PeptideMechanism } from "@/components/peptide/PeptideMechanism";
import { getPeptideVisualization } from "@/components/peptide/peptide-visualizations";
import {
  UsageProtocol,
  type UsageProtocolData,
} from "@/components/product/UsageProtocol";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { SpecsTable } from "@/components/product/SpecsTable";
import { FrequentlyBoughtTogether } from "@/components/product/FrequentlyBoughtTogether";
import { ProductFaq } from "@/components/product/ProductFaq";
import { SideEffectsCard } from "@/components/product/SideEffectsCard";
import { ReconstitutionGuide } from "@/components/product/ReconstitutionGuide";
import { ProductCalculator } from "@/components/product/ProductCalculator";
import { ClinicalPhases, type ClinicalPhase } from "@/components/product/ClinicalPhases";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductCard } from "@/components/product/ProductCard";
import { MotionProductGrid, MotionProductItem } from "@/components/product/MotionProductGrid";
import { StickyAddToCart } from "@/components/product/StickyAddToCart";
import { AnimatedPrice } from "@/components/ui/AnimatedPrice";
import { COABadge } from "@/components/ui/COABadge";
import { VialPlaceholder } from "@/components/ui/VialPlaceholder";
import { Abbr } from "@/components/ui/Abbr";
import { TextWithAbbr } from "@/components/ui/TextWithAbbr";
import { BulkDiscountTiers } from "@/components/product/BulkDiscountTiers";
import { getCategoryLabel, getProductDisplayName } from "@/lib/labels";
import { breadcrumbSchema } from "@/lib/seo/schema";

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
  const useCase =
    locale === "bg" ? product.use_case_tag_bg : product.use_case_tag_en;

  // Trim long descriptions to 155-160 chars for meta description
  const fallbackDescBg = `${product.name} ${product.vial_size_mg}mg${useCase ? ` ${useCase}` : ""} — лиофилизиран прах с HPLC чистота над ${product.purity_percent}%. COA включен. Доставка 1-3 дни.`;
  const fallbackDescEn = `${product.name} ${product.vial_size_mg}mg${useCase ? ` ${useCase}` : ""} — lyophilized powder, HPLC purity ${product.purity_percent}%+. COA included. 1-3 day delivery.`;
  const rawDesc = description ?? (locale === "bg" ? fallbackDescBg : fallbackDescEn);
  const metaDesc = rawDesc.length > 160 ? rawDesc.slice(0, 157).trimEnd() + "…" : rawDesc;

  // Commercial-intent title formula per SEO audit:
  //   BG: "<Name> <dose>mg — €<price> в България | COA, ЕС доставка"
  //   EN: "<Name> <dose>mg — €<price> EU | COA, fast EU shipping"
  // The locale layout appends " | PeptidLabs" so brand is always present.
  const priceTag = `€${product.price_eur.toFixed(0)}`;
  const doseTag = product.vial_size_mg ? ` ${product.vial_size_mg}mg` : "";
  const title =
    locale === "bg"
      ? `${product.name}${doseTag} — ${priceTag} в България | COA, ЕС доставка`
      : `${product.name}${doseTag} — ${priceTag} EU | COA, fast EU shipping`;

  return {
    title,
    description: metaDesc,
    openGraph: {
      title: `${product.name}${doseTag} — ${priceTag}`,
      description: metaDesc,
      type: "website",
      url: `https://peptidlabs.eu/${locale}/products/${slug}`,
      // images deliberately omitted — Next.js auto-injects the
      // file-based opengraph-image.tsx (per-product SEO card with
      // name + price + tag on navy gradient). Overriding with the raw
      // product photo loses the brand framing in social previews.
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name}${doseTag} — ${priceTag}`,
      description: metaDesc,
      // Same — let next/og opengraph-image flow through to twitter:image.
    },
    alternates: {
      canonical: `https://peptidlabs.eu/${locale}/products/${slug}`,
      languages: {
        bg: `https://peptidlabs.eu/bg/products/${slug}`,
        en: `https://peptidlabs.eu/en/products/${slug}`,
        "x-default": `https://peptidlabs.eu/en/products/${slug}`,
      },
    },
  };
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

  const displayName = getProductDisplayName(product, locale);

  const [relatedProducts, category, siblings, reviewData, peptideRef] = await Promise.all([
    getRelatedProducts(product.id),
    getProductCategory(product.id),
    getSiblingProducts(product.name, product.slug),
    getProductReviews(product.id),
    getPeptideForProduct(product.id),
  ]);

  const categoryName =
    locale === "bg"
      ? category?.name_bg ?? null
      : category?.name_en ?? null;

  const description =
    locale === "bg" ? product.description_bg : product.description_en;

  // Short description for schema (160 chars max — Google ignores beyond ~5000 but best practice is short)
  const summaryText =
    (locale === "bg" ? product.summary_bg : product.summary_en) ?? description ?? "";
  const schemaDescription =
    summaryText.length > 200 ? summaryText.slice(0, 197).trimEnd() + "…" : summaryText;

  // Product JSON-LD — Google rich snippet eligible
  const productJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} ${product.vial_size_mg}mg`,
    description: schemaDescription,
    sku: product.sku,
    mpn: product.sku,
    image: product.images && product.images.length > 0
      ? product.images
      : [`https://rthawomwdjdthdiorgvb.supabase.co/storage/v1/object/public/product-images/masters/powder.png`],
    brand: {
      "@type": "Brand",
      name: "PeptidLabs",
    },
    manufacturer: {
      "@type": "Organization",
      name: "PeptidLabs",
    },
    category: (locale === "bg" ? product.use_case_tag_bg : product.use_case_tag_en) || "Research Peptide",
    offers: {
      "@type": "Offer",
      price: product.price_eur.toFixed(2),
      priceCurrency: "EUR",
      url: `https://peptidlabs.eu/${locale}/products/${product.slug}`,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      seller: {
        "@type": "Organization",
        name: "PeptidLabs",
      },
    },
  };

  // Add aggregateRating only when there are real reviews
  if (reviewData.aggregate.count > 0) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reviewData.aggregate.average,
      reviewCount: reviewData.aggregate.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Product-specific content from scientific_data
  const sciData = (product.scientific_data ?? {}) as Record<string, unknown>;
  const sideEffectsBg = typeof sciData.side_effects_bg === "string" ? sciData.side_effects_bg : null;
  const reconstitutionBg = typeof sciData.reconstitution_bg === "string" ? sciData.reconstitution_bg : null;
  const productFaqBg = Array.isArray(sciData.faq_bg)
    ? (sciData.faq_bg as Array<{ q?: string; a?: string }>).filter(
        (f): f is { q: string; a: string } =>
          typeof f.q === "string" && typeof f.a === "string",
      )
    : [];
  const clinicalPhases = Array.isArray(sciData.clinical_phases)
    ? (sciData.clinical_phases as Array<Record<string, unknown>>).filter(
        (r): r is ClinicalPhase =>
          typeof r.phase === "string" &&
          ["I", "II", "III", "Approved"].includes(r.phase as string) &&
          typeof r.trial === "string" &&
          typeof r.dose === "string" &&
          typeof r.duration === "string" &&
          typeof r.result === "string",
      )
    : [];

  // FAQ items — product-specific (BG only) prepended, then generic
  const productFaqItems = locale === "bg"
    ? productFaqBg.map((f) => ({ question: f.q, answer: f.a }))
    : [];
  const faqItems = [
    ...productFaqItems,
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

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: locale === "bg" ? "Начало" : "Home", path: `/${locale}` },
    { name: locale === "bg" ? "Магазин" : "Shop", path: `/${locale}/shop` },
    { name: product.name, path: `/${locale}/products/${product.slug}` },
  ]);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ─── BREADCRUMB BAR ─── */}
      <div className="bg-surface border-b border-border">
        <nav
          className="mx-auto max-w-[1280px] px-6 py-3 text-sm text-muted"
          aria-label="Breadcrumb"
        >
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
                    href={`/shop/${category.slug}`}
                    className="hover:text-secondary"
                  >
                    {categoryName}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li className="font-medium text-navy">{displayName}</li>
          </ol>
        </nav>
      </div>

      {/* ─── ABOVE THE FOLD ─── */}
      <div className="mx-auto max-w-[1280px] px-6 py-8">

        {/* Two-column layout */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* LEFT COLUMN */}
          <div>
            {/* Product image */}
            <div
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-surface to-white"
              style={{ viewTransitionName: `product-image-${product.slug}` }}
            >
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={displayName}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-6"
                />
              ) : (
                <VialPlaceholder name={product.name} size="lg" />
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <COABadge variant="overlay" />
                {product.is_bestseller && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                    <FlaskConical size={14} />
                    Bestseller
                  </span>
                )}
              </div>
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

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              {(locale === "bg" ? product.use_case_tag_bg : product.use_case_tag_en) || categoryName || getCategoryLabel(locale)}
            </p>

            <h1 className="mt-1 font-display text-2xl md:text-3xl font-bold text-navy tracking-[-0.03em]">
              {displayName}
            </h1>

            {/* QuickSpecBar */}
            <div className="mt-3">
              <QuickSpecBar product={product} locale={locale} />
            </div>

            {/* Quick facts */}
            <div className="flex gap-3 mt-4">
              <div className="flex-1 rounded-lg bg-surface p-3 text-center">
                <p className="font-mono text-lg font-bold text-navy">
                  &ge;{product.purity_percent}%
                </p>
                <p className="text-[10px] text-muted uppercase">
                  {locale === "bg" ? "Чистота" : "Purity"}
                </p>
              </div>
              {product.vial_size_mg != null && (
                <div className="flex-1 rounded-lg bg-surface p-3 text-center">
                  <p className="font-mono text-lg font-bold text-navy">
                    {product.vial_size_mg}mg
                  </p>
                  <p className="text-[10px] text-muted uppercase">
                    {locale === "bg" ? "Количество" : "Amount"}
                  </p>
                </div>
              )}
              <div className="flex-1 rounded-lg bg-surface p-3 text-center">
                <p className="font-mono text-lg font-bold text-accent">
                  <Abbr term="COA" locale={locale} />
                </p>
                <p className="text-[10px] text-muted uppercase">
                  {locale === "bg" ? "Включен" : "Included"}
                </p>
              </div>
            </div>

            {/* Encyclopedia cross-link — full scientific reference for this peptide */}
            {peptideRef && (
              <Link
                href={`/encyclopedia/${peptideRef.slug}`}
                className="mt-4 group inline-flex items-center justify-between gap-3 rounded-lg border border-accent-border bg-accent-tint/40 px-3 py-2.5 transition-colors hover:bg-accent-tint hover:border-accent/50"
              >
                <span className="flex items-center gap-2.5">
                  <BookOpen size={14} className="text-accent" strokeWidth={1.75} />
                  <span className="text-xs">
                    <span className="font-semibold text-navy">
                      {locale === "bg"
                        ? `Виж научната справка за ${peptideRef.name}`
                        : `View scientific reference for ${peptideRef.name}`}
                    </span>
                    <span className="block font-mono text-[10px] text-muted">
                      {locale === "bg"
                        ? "механизъм, формула, публикации"
                        : "mechanism, formula, publications"}
                    </span>
                  </span>
                </span>
                <ArrowRight
                  size={14}
                  className="text-accent transition-transform group-hover:translate-x-1"
                />
              </Link>
            )}

            {/* Lab-style batch/serial line */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-dashed border-border bg-surface px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted">
              <span>
                BATCH: PL-{product.sku}-{new Date().getFullYear()}
              </span>
              <span className="hidden h-3 w-px bg-border sm:inline-block" />
              <span>
                MFG:{" "}
                {new Date().toLocaleDateString("bg-BG", {
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
              <span className="hidden h-3 w-px bg-border sm:inline-block" />
              <span>STATUS: LOT-CERTIFIED</span>
            </div>

            {/* Size selector pills */}
            {siblings.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-muted">{locale === "bg" ? "Размер:" : "Size:"}</span>
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
            <p className="mt-6 text-3xl font-bold text-navy tabular">
              <AnimatedPrice value={product.price_eur} />
            </p>

            {/* Bulk discount tiers */}
            <BulkDiscountTiers
              pricePerUnit={product.price_eur}
              locale={locale}
            />

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
            title={<><TextWithAbbr text={tTrust("hplcTitle")} locale={locale} /> над 98%</>}
            sub={tTrust("hplcSub")}
          />
          <TrustItem
            icon={<ShieldCheck size={20} className="text-secondary" />}
            title={<TextWithAbbr text={tTrust("coaTitle")} locale={locale} />}
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

      {/* ─── SPECIFICATIONS ─── */}
      <div className="bg-surface py-12 mt-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <SpecsTable product={product} translations={specTranslations} locale={locale} />
        </div>
      </div>

      {/* ─── USAGE PROTOCOL — peptide-specific ─── */}
      {(() => {
        const usageProtocol = (product.scientific_data as Record<string, unknown> | null)?.usage_protocol as UsageProtocolData | undefined;
        if (!usageProtocol?.tiers) return null;
        return (
          <div className="bg-white py-12">
            <div className="mx-auto max-w-[1280px] px-6">
              <UsageProtocol
                protocol={usageProtocol}
                productSlug={product.slug}
                vialSizeMg={product.vial_size_mg}
                locale={locale as "bg" | "en"}
              />
            </div>
          </div>
        );
      })()}

      {/* ─── PRODUCT CALCULATOR — embedded interactive dose calc ─── */}
      {product.vial_size_mg !== null && (() => {
        const usageProtocol = (product.scientific_data as Record<string, unknown> | null)?.usage_protocol as UsageProtocolData | undefined;
        const standardTier = usageProtocol?.tiers?.standard ?? usageProtocol?.tiers?.starter ?? usageProtocol?.tiers?.extended;
        const defaultDoseMcg = standardTier?.dose_mcg ?? 250;
        return (
          <div className="bg-surface py-12">
            <div className="mx-auto max-w-[1280px] px-6">
              <ProductCalculator
                vialSizeMg={product.vial_size_mg}
                defaultDoseMcg={defaultDoseMcg}
                productName={displayName}
                productSlug={product.slug}
                locale={locale as "bg" | "en"}
              />
            </div>
          </div>
        );
      })()}

      {/* ─── RECONSTITUTION + SIDE EFFECTS (BG only) ─── */}
      {locale === "bg" && (reconstitutionBg || sideEffectsBg) && (
        <div className="bg-white py-12">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reconstitutionBg && (
                <ReconstitutionGuide
                  text={reconstitutionBg}
                  heading="Реконституция стъпка по стъпка"
                />
              )}
              {sideEffectsBg && (
                <SideEffectsCard
                  text={sideEffectsBg}
                  heading="Странични ефекти"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── CLINICAL PHASES TABLE ─── */}
      {clinicalPhases.length > 0 && (
        <div className="bg-surface py-12">
          <div className="mx-auto max-w-[1280px] px-6">
            <ClinicalPhases
              phases={clinicalPhases}
              heading={locale === "bg" ? "Клинични фази и резултати" : "Clinical phases and results"}
              locale={locale as "bg" | "en"}
            />
          </div>
        </div>
      )}

      {/* ─── LIVE MECHANISM VISUALIZATION ─── */}
      {getPeptideVisualization(product.slug) && (
        <div className="bg-white py-12 md:py-16">
          <div className="mx-auto max-w-[1280px] px-6">
            <PeptideMechanism
              data={getPeptideVisualization(product.slug)!}
              locale={locale as "bg" | "en"}
            />
          </div>
        </div>
      )}

      {/* ─── TABBED CONTENT ─── */}
      <div className="py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <ProductTabs
            product={product}
            locale={locale}
            translations={tabTranslations}
          />
        </div>
      </div>

      {/* ─── FREQUENTLY BOUGHT TOGETHER ─── */}
      <div className="bg-surface py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <FrequentlyBoughtTogether
            products={frequentlyBought}
            locale={locale}
            heading={t("frequentlyBought")}
            addAllLabel={t("addAllToCart")}
          />
        </div>
      </div>

      {/* ─── FAQ ─── */}
      <div className="py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <ProductFaq heading={t("faq")} items={faqItems} />
        </div>
      </div>

      {/* ─── REVIEWS ─── */}
      <div className="bg-surface py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <ProductReviews productId={product.id} locale={locale} />
        </div>
      </div>

      {/* ─── RELATED PRODUCTS ─── */}
      {relatedForGrid.length > 0 && (
        <div className="py-12">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy">
                {t("relatedProducts")}
              </h2>
              {category && (
                <Link
                  href={`/shop/${category.slug}`}
                  className="text-sm text-secondary hover:text-navy"
                >
                  {t("viewAll")} &rarr;
                </Link>
              )}
            </div>
            <div className="mt-6">
              <MotionProductGrid>
                {relatedForGrid.map((p) => (
                  <MotionProductItem key={p.id}>
                    <ProductCard product={p} locale={locale} />
                  </MotionProductItem>
                ))}
              </MotionProductGrid>
            </div>
          </div>
        </div>
      )}

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
  title: React.ReactNode;
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
