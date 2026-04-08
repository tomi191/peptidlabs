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
      <GoalNav />
      <HowItWorks />
      <BestsellersSection products={bestsellers} locale={locale} />
      <CategoryGrid categories={categories} locale={locale} />
      <IntroSection />
      <TestimonialsSection />
      <TrustBar />
      <BlogPreview posts={blogPosts} locale={locale} />
      <NewsletterSection />
    </main>
  );
}
