import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { termsContent } from "@/lib/legal/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const doc = termsContent[locale === "bg" ? "bg" : "en"];
  return {
    title: `${doc.title} | PeptidLabs`,
    description: doc.intro.slice(0, 160),
    alternates: {
      canonical: `https://peptidlabs.eu/${locale}/terms`,
      languages: {
        bg: "https://peptidlabs.eu/bg/terms",
        en: "https://peptidlabs.eu/en/terms",
      },
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = termsContent[locale === "bg" ? "bg" : "en"];

  return <LegalLayout document={doc} locale={locale} />;
}
