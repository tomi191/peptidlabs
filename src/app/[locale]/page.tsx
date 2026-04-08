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

  return (
    <main className="w-full">
      <HeroSection />
      <SocialProofBar />

      <div className="bg-white">
        <FadeIn>
          <GoalNav />
        </FadeIn>
      </div>

      <div className="bg-surface">
        <FadeIn>
          <HowItWorks />
        </FadeIn>
      </div>

      <div className="bg-white">
        <FadeIn>
          <BestsellersSection products={bestsellers} locale={locale} />
        </FadeIn>
      </div>

      <div className="bg-surface">
        <FadeIn>
          <CategoryGrid categories={categories} locale={locale} />
        </FadeIn>
      </div>

      <div className="bg-white">
        <FadeIn>
          <IntroSection />
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

      <div className="bg-surface">
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
