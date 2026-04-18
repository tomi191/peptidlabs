import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { cookieContent } from "@/lib/legal/content";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const doc = cookieContent[locale === "bg" ? "bg" : "en"];
  return {
    title: `${doc.title} | PeptidLabs`,
    description: doc.intro.slice(0, 160),
    alternates: {
      canonical: `https://peptidlabs.eu/${locale}/cookie-policy`,
      languages: {
        bg: "https://peptidlabs.eu/bg/cookie-policy",
        en: "https://peptidlabs.eu/en/cookie-policy",
      },
    },
  };
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = cookieContent[locale === "bg" ? "bg" : "en"];

  return <LegalLayout document={doc} locale={locale} />;
}
