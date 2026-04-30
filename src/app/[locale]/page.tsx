import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getCategoriesWithCounts, getBestsellers, getPublishedBlogPosts, getPublishedPeptideCount } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo/schema";
import { HeroSection } from "@/components/home/HeroSection";
import { SocialProofBar } from "@/components/home/SocialProofBar";
import { LiveTrustTicker } from "@/components/home/LiveTrustTicker";
import { GLP1Comparison } from "@/components/home/GLP1Comparison";
import { PeptideFinder } from "@/components/home/PeptideFinder";
import { ResearchOnlyBanner } from "@/components/home/ResearchOnlyBanner";
import { GoalNav } from "@/components/home/GoalNav";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BestsellersSection } from "@/components/home/BestsellersSection";
import { IntroSection } from "@/components/home/IntroSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { TrustBar } from "@/components/home/TrustBar";
import { BlogPreview } from "@/components/home/BlogPreview";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { FadeIn } from "@/components/ui/FadeIn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBg = locale === "bg";
  const peptideTotal = await getPublishedPeptideCount();
  const title = isBg
    ? `PeptidLabs — ${peptideTotal}+ изследователски пептида от ЕС`
    : `PeptidLabs — ${peptideTotal}+ Research Peptides from EU`;
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
      {/* Research-only positioning banner — Meta/FB ads compliance + EU regulatory framing */}
      <ResearchOnlyBanner locale={locale as "bg" | "en"} />
      <HeroSection peptideTotal={peptideTotal} />
      {/* Live trust ticker — rotating psychological signals */}
      <LiveTrustTicker locale={locale as "bg" | "en"} />
      <SocialProofBar />

      {/* Peptide Finder Wizard — interactive 2-step quiz → personalized recommendations */}
      <div className="bg-surface">
        <FadeIn>
          <PeptideFinder locale={locale as "bg" | "en"} />
        </FadeIn>
      </div>

      <div className="bg-white">
        <FadeIn>
          <GoalNav />
        </FadeIn>
      </div>

      <div className="bg-surface">
        <FadeIn>
          <HowItWorks peptideTotal={peptideTotal} />
        </FadeIn>
      </div>

      {/* Bestsellers — streams in when getBestsellers() resolves */}
      <div className="bg-white">
        <FadeIn>
          <Suspense fallback={<BestsellersSkeleton />}>
            <BestsellersSectionAsync locale={locale} />
          </Suspense>
        </FadeIn>
      </div>

      {/* Categories — streams in when getCategories() resolves */}
      <div className="bg-surface">
        <FadeIn>
          <Suspense fallback={<CategoryGridSkeleton />}>
            <CategoryGridAsync locale={locale} />
          </Suspense>
        </FadeIn>
      </div>

      {/* GLP-1 Comparison Widget */}
      <div className="bg-white">
        <FadeIn>
          <GLP1Comparison locale={locale as "bg" | "en"} />
        </FadeIn>
      </div>

      <div className="bg-white">
        <FadeIn>
          <IntroSection peptideTotal={peptideTotal} />
        </FadeIn>
      </div>

      <div className="bg-surface">
        <FadeIn>
          <TestimonialsSection />
        </FadeIn>
      </div>

      <div className="bg-white">
        <FadeIn>
          <TrustBar />
        </FadeIn>
      </div>

      {/* Blog preview */}
      <div className="bg-surface">
        <FadeIn>
          <Suspense fallback={<BlogPreviewSkeleton />}>
            <BlogPreviewAsync locale={locale} />
          </Suspense>
        </FadeIn>
      </div>

      <FadeIn>
        <NewsletterSection />
      </FadeIn>
    </main>
  );
}
