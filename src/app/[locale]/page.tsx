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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [categories, bestsellers, blogPosts] = await Promise.all([
    getCategories(),
    getBestsellers(),
    getPublishedBlogPosts(),
  ]);

  const isBg = locale === "bg";
  return (
    <main className="w-full">
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

      <div className="bg-white">
        <Marker index="05" label={isBg ? "ПРОДУКТИ" : "PRODUCTS"} />
        <FadeIn>
          <BestsellersSection products={bestsellers} locale={locale} />
        </FadeIn>
      </div>

      <div className="bg-surface">
        <Marker index="06" label={isBg ? "КАТЕГОРИИ" : "CATEGORIES"} />
        <FadeIn>
          <CategoryGrid categories={categories} locale={locale} />
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

      <div className="bg-surface">
        <Marker index="09" label={isBg ? "ИЗСЛЕДВАНИЯ" : "RESEARCH"} />
        <FadeIn>
          <BlogPreview posts={blogPosts} locale={locale} />
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
