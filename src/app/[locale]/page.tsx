import { setRequestLocale } from "next-intl/server";
import { getCategories, getBestsellers } from "@/lib/queries";
import { HeroSection } from "@/components/home/HeroSection";
import { SocialProofBar } from "@/components/home/SocialProofBar";
import { GoalNav } from "@/components/home/GoalNav";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BestsellersSection } from "@/components/home/BestsellersSection";
import { TrustBar } from "@/components/home/TrustBar";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [categories, bestsellers] = await Promise.all([
    getCategories(),
    getBestsellers(),
  ]);

  return (
    <main className="w-full">
      <HeroSection />
      <SocialProofBar />
      <GoalNav />
      <CategoryGrid categories={categories} locale={locale} />
      <BestsellersSection products={bestsellers} locale={locale} />
      <TrustBar />
      <NewsletterSection />
    </main>
  );
}
