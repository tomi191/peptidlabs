import { setRequestLocale } from "next-intl/server";
import { getCategories, getBestsellers } from "@/lib/queries";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BestsellersSection } from "@/components/home/BestsellersSection";
import { TrustBar } from "@/components/home/TrustBar";

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
      <CategoryGrid categories={categories} locale={locale} />
      <BestsellersSection products={bestsellers} locale={locale} />
      <TrustBar />
    </main>
  );
}
