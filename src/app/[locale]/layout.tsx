import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Inter, JetBrains_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CookieConsent from "@/components/ui/CookieConsent";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://peptidelab.bg"),
  title: {
    default: "PeptideLab — Research Grade Peptides",
    template: "%s | PeptideLab",
  },
  description:
    "65+ HPLC-tested research peptides. COA included with every order. EU shipping.",
  openGraph: {
    type: "website",
    siteName: "PeptideLab",
    locale: "bg_BG",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "https://peptidelab.bg",
    languages: {
      bg: "https://peptidelab.bg/bg",
      en: "https://peptidelab.bg/en",
    },
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <Footer />
          <WhatsAppButton />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
