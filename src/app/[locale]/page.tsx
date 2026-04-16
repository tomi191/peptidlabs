import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { getCategories, getBestsellers, getPublishedBlogPosts } from "@/lib/queries";
import { HeroSection } from "@/components/home/HeroSection";
import { SocialProofBar } from "@/components/home/SocialProofBar";
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
import { SectionMarker } from "@/components/ui/SectionMarker";

function Marker({ index, label }: { index: string; label: string }) {
  return (
    <div className="mx-auto max-w-[1280px] px-6 pt-10">
      <SectionMarker index={index} total="09" label={label} />
    </div>
  );
}

// ---- Async data wrappers — each fetches independently and streams in ----

async function BestsellersSectionAsync({ locale }: { locale: string }) {
  const bestsellers = await getBestsellers();
  return <BestsellersSection products={bestsellers} locale={locale} />;
}

async function CategoryGridAsync({ locale }: { locale: string }) {
  const categories = await getCategories();
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
        <div className="mt-8 flex gap-3 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-32 w-40 shrink-0 animate-pulse rounded-2xl bg-surface lg:w-auto"
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

  const isBg = locale === "bg";
  return (
    <main className="w-full">
      {/* Hero renders instantly — no data dependency */}
      <HeroSection />
      <div className="bg-white">
        <Marker index="02" label={isBg ? "ТРЪСТ" : "TRUST"} />
      </div>
      <SocialProofBar />

      <div className="bg-white">
        <Marker index="03" label={isBg ? "ЦЕЛ" : "GOAL"} />
        <FadeIn>
          <GoalNav />
        </FadeIn>
      </div>

      <div className="bg-surface">
        <Marker index="04" label={isBg ? "ПРОЦЕС" : "PROCESS"} />
        <FadeIn>
          <HowItWorks />
        </FadeIn>
      </div>

      {/* Bestsellers — streams in when getBestsellers() resolves */}
      <div className="bg-white">
        <Marker index="05" label={isBg ? "ПРОДУКТИ" : "PRODUCTS"} />
        <FadeIn>
          <Suspense fallback={<BestsellersSkeleton />}>
            <BestsellersSectionAsync locale={locale} />
          </Suspense>
        </FadeIn>
      </div>

      {/* Categories — streams in when getCategories() resolves */}
      <div className="bg-surface">
        <Marker index="06" label={isBg ? "КАТЕГОРИИ" : "CATEGORIES"} />
        <FadeIn>
          <Suspense fallback={<CategoryGridSkeleton />}>
            <CategoryGridAsync locale={locale} />
          </Suspense>
        </FadeIn>
      </div>

      <div className="bg-white">
        <Marker index="07" label={isBg ? "МИСИЯ" : "MISSION"} />
        <FadeIn>
          <IntroSection />
        </FadeIn>
      </div>

      <div className="bg-surface">
        <Marker index="08" label={isBg ? "КЛИЕНТИ" : "CLIENTS"} />
        <FadeIn>
          <TestimonialsSection />
        </FadeIn>
      </div>

      <div className="bg-white">
        <FadeIn>
          <TrustBar />
        </FadeIn>
      </div>

      {/* Blog preview — streams in when getPublishedBlogPosts() resolves */}
      <div className="bg-surface">
        <Marker index="09" label={isBg ? "ИЗСЛЕДВАНИЯ" : "RESEARCH"} />
        <FadeIn>
          <Suspense fallback={<BlogPreviewSkeleton />}>
            <BlogPreviewAsync locale={locale} />
          </Suspense>
        </FadeIn>
      </div>

      <div className="bg-white">
        <FadeIn>
          <NewsletterSection />
        </FadeIn>
      </div>
    </main>
  );
}
