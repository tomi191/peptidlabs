import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { privacyContent } from "@/lib/legal/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const doc = privacyContent[locale === "bg" ? "bg" : "en"];
  return {
    title: `${doc.title} | PeptidLabs`,
    description: doc.intro.slice(0, 160),
    alternates: {
      canonical: `https://peptidlabs.eu/${locale}/privacy`,
      languages: {
        bg: "https://peptidlabs.eu/bg/privacy",
        en: "https://peptidlabs.eu/en/privacy",
      },
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = privacyContent[locale === "bg" ? "bg" : "en"];

  return <LegalLayout document={doc} locale={locale} />;
}
