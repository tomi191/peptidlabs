import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getCategoriesWithCounts, getBestsellers, getPublishedBlogPosts, getPublishedPeptideCount } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo/schema";
import { HeroSection } from "@/components/home/HeroSection";
import { SocialProofBar } from "@/components/home/SocialProofBar";
import { GLP1Comparison } from "@/components/home/GLP1Comparison";
import { PeptideFinder } from "@/components/home/PeptideFinder";
import { ResearchOnlyBanner } from "@/components/home/ResearchOnlyBanner";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BestsellersSection } from "@/components/home/BestsellersSection";
import { IntroSection } from "@/components/home/IntroSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BlogPreview } from "@/components/home/BlogPreview";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { FadeIn } from "@/components/ui/FadeIn";

// Removed from homepage per 5-persona debate:
//   - LiveTrustTicker  → cognitive noise + drop-off, dup of SocialProofBar
//   - TrustBar         → third copy of trust info, marquee fatigue above-fold
//   - GoalNav          → duplicates CategoryGrid; SEO equity preserved by sitemap
//                        + Footer category links; remove from homepage scope.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBg = locale === "bg";
  const peptideTotal = await getPublishedPeptideCount();
  // Lead with locality + headline trust signals (HPLC + COA) for stronger
  // commercial intent match in SERP. PeptidLabs is appended via title template.
  const title = isBg
    ? `Изследователски пептиди България — ${peptideTotal}+ HPLC над 98%, COA с всяка партида`
    : `Research Peptides EU — ${peptideTotal}+ HPLC over 98%, COA with every batch`;
  const description = isBg
    ? `${peptideTotal}+ HPLC-тествани изследователски пептида с чистота над 98%. BPC-157, Семаглутид, Тирзепатид и още. Сертификат за анализ с всяка партида. Доставка в целия ЕС.`
    : `${peptideTotal}+ HPLC-tested research peptides at 98%+ purity. BPC-157, Semaglutide, Tirzepatide and more. Certificate of Analysis included with every batch. EU-wide shipping.`;
  return buildMetadata({ title, description, path: `/${locale}`, locale });
}

// ---- Async data wrappers — each fetches independently and streams in ----

async function BestsellersSectionAsync({ locale }: { locale: string }) {
  const bestsellers = await getBestsellers();
  return <BestsellersSection products={bestsellers} locale={locale} />;
}

async function CategoryGridAsync({ locale }: { locale: string }) {
  const categories = await getCategoriesWithCounts();
  return <CategoryGrid categories={categories} locale={locale} />;
}

async function BlogPreviewAsync({ locale }: { locale: string }) {
  const blogPosts = await getPublishedBlogPosts();
  return <BlogPreview posts={blogPosts} locale={locale} />;
}

// ---- Skeleton fallbacks ----

function BestsellersSkeleton() {
  return (
    <section className="w-full px-6 py-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-6 w-36 animate-pulse rounded bg-surface" />
          <div className="h-4 w-16 animate-pulse rounded bg-surface" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-border"
            >
              <div className="h-36 animate-pulse bg-surface" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-16 animate-pulse rounded bg-surface" />
                <div className="h-4 w-24 animate-pulse rounded bg-surface" />
                <div className="h-3 w-32 animate-pulse rounded bg-surface" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryGridSkeleton() {
  return (
    <section className="w-full px-6 py-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto h-8 w-56 animate-pulse rounded bg-surface" />
        <div className="mt-10 flex gap-4 overflow-x-auto px-6 pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[9/16] w-56 shrink-0 animate-pulse rounded-2xl bg-surface"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPreviewSkeleton() {
  return (
    <section className="w-full px-6 py-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto mb-10 h-8 w-48 animate-pulse rounded bg-surface" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="rounded-2xl border border-border p-8 md:col-span-3 space-y-3">
            <div className="h-3 w-24 animate-pulse rounded bg-surface" />
            <div className="h-5 w-full animate-pulse rounded bg-surface" />
            <div className="h-3 w-full animate-pulse rounded bg-surface" />
            <div className="h-3 w-full animate-pulse rounded bg-surface" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-surface" />
          </div>
          <div className="flex flex-col gap-4 md:col-span-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-1 flex-col rounded-2xl border border-border p-6 space-y-2"
              >
                <div className="h-3 w-20 animate-pulse rounded bg-surface" />
                <div className="h-4 w-full animate-pulse rounded bg-surface" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-surface" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const peptideTotal = await getPublishedPeptideCount();

  return (
    <main className="w-full">
      {/* 1. Compliance banner — top, sticky */}
      <ResearchOnlyBanner locale={locale as "bg" | "en"} />

      {/* 2. Hero — primary hook + portrait + CTAs */}
      <HeroSection peptideTotal={peptideTotal} />

      {/* 3. Single trust block — static, indexable. (LiveTrustTicker removed) */}
      <SocialProofBar />

      {/* 4. Categories — discovery hub right after trust signal.
              For an informed-researcher audience the molecule comes first;
              ordering reassurance follows interest, doesn't precede it. */}
      <div className="bg-surface">
        <FadeIn>
          <Suspense fallback={<CategoryGridSkeleton />}>
            <CategoryGridAsync locale={locale} />
          </Suspense>
        </FadeIn>
      </div>

      {/* 5. Bestsellers — curated picks after the discovery hub */}
      <div className="bg-white">
        <FadeIn>
          <Suspense fallback={<BestsellersSkeleton />}>
            <BestsellersSectionAsync locale={locale} />
          </Suspense>
        </FadeIn>
      </div>

      {/* 6. How It Works — reassurance / friction-kill AFTER interest is
              established (user has seen what we sell, now show how to buy). */}
      <div className="bg-surface">
        <FadeIn>
          <HowItWorks peptideTotal={peptideTotal} />
        </FadeIn>
      </div>

      {/* 7. PeptideFinder — rescue mechanic for users who didn't find what
              they wanted in Bestsellers and want guided discovery. */}
      <div className="bg-white">
        <FadeIn>
          <PeptideFinder locale={locale as "bg" | "en"} />
        </FadeIn>
      </div>

      {/* 8. GLP-1 Comparison — interactive deep-dive for expert visitors */}
      <div className="bg-surface">
        <FadeIn>
          <GLP1Comparison locale={locale as "bg" | "en"} />
        </FadeIn>
      </div>

      {/* 9. Brand narrative pause */}
      <div className="bg-white">
        <FadeIn>
          <IntroSection peptideTotal={peptideTotal} />
        </FadeIn>
      </div>

      {/* 10. Social proof — testimonials with avatars (after product context) */}
      <div className="bg-surface">
        <FadeIn>
          <TestimonialsSection />
        </FadeIn>
      </div>

      {/* 11. Educational content — blog covers (low commitment, SEO equity) */}
      <div className="bg-white">
        <FadeIn>
          <Suspense fallback={<BlogPreviewSkeleton />}>
            <BlogPreviewAsync locale={locale} />
          </Suspense>
        </FadeIn>
      </div>

      {/* 12. Final low-friction conversion — newsletter signup */}
      <FadeIn>
        <NewsletterSection />
      </FadeIn>
    </main>
  );
}
