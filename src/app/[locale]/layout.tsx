import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { routing } from "@/i18n/routing";
import { getPublishedPeptideCount } from "@/lib/queries";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CookieConsent from "@/components/ui/CookieConsent";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { LenisProvider } from "@/components/ui/LenisProvider";
import { Toaster } from "sonner";
import { PlausibleScript } from "@/components/analytics/Plausible";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { DesktopAppRail } from "@/components/layout/DesktopAppRail";
import { InstallPrompt } from "@/components/ui/InstallPrompt";
import { PreLaunchBanner } from "@/components/waitlist/PreLaunchBanner";
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

const SITE_META = {
  bg: {
    title: "PeptidLabs — Изследователски пептиди от ЕС",
    description: (count: number) =>
      `${count}+ HPLC-тествани изследователски пептида с чистота над 98%. Сертификат за анализ (COA) с всяка поръчка. Доставка в целия ЕС.`,
    ogLocale: "bg_BG",
    altLocale: "en_US",
  },
  en: {
    title: "PeptidLabs — Research Grade Peptides",
    description: (count: number) =>
      `${count}+ HPLC-tested research peptides at 98%+ purity. Certificate of Analysis (COA) included with every order. EU-wide shipping.`,
    ogLocale: "en_US",
    altLocale: "bg_BG",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang: "bg" | "en" = locale === "en" ? "en" : "bg";
  const meta = SITE_META[lang];
  const peptideCount = await getPublishedPeptideCount();
  const description = meta.description(peptideCount);

  return {
    metadataBase: new URL("https://peptidlabs.eu"),
    title: {
      default: meta.title,
      template: "%s | PeptidLabs",
    },
    description,
    applicationName: "PeptidLabs",
    appleWebApp: {
      capable: true,
      title: "PeptidLabs",
      statusBarStyle: "black-translucent",
    },
    formatDetection: { telephone: false },
    openGraph: {
      type: "website",
      siteName: "PeptidLabs",
      title: meta.title,
      description,
      locale: meta.ogLocale,
      alternateLocale: meta.altLocale,
      url: `https://peptidlabs.eu/${lang}`,
    },
    twitter: {
      card: "summary",
      title: meta.title,
      description,
    },
    alternates: {
      canonical: `https://peptidlabs.eu/${lang}`,
      languages: {
        bg: "https://peptidlabs.eu/bg",
        en: "https://peptidlabs.eu/en",
      },
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  colorScheme: "light",
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
      className={`${inter.variable} ${jetbrainsMono.variable} ${GeistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-app">
        <PlausibleScript />
        <ServiceWorkerRegister />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <NextIntlClientProvider messages={messages}>
          <LenisProvider>
            <GrainOverlay />
            <PreLaunchBanner />
            <Header />
            <main
              id="main-content"
              className="flex-1 pb-[calc(env(safe-area-inset-bottom)+5rem)] md:pb-0"
            >
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
            <MobileTabBar />
            <DesktopAppRail />
            <InstallPrompt />
            <CookieConsent />
            <Toaster
              position="top-center"
              offset="calc(env(safe-area-inset-top) + 12px)"
              toastOptions={{
                style: {
                  background: "#0f172a",
                  color: "#fff",
                  border: "1px solid #1e293b",
                  borderRadius: "16px",
                  fontFamily: "var(--font-sans)",
                },
              }}
            />
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
