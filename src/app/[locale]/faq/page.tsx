import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

const FAQ_KEYS = [
  "whatArePeptides",
  "purityTesting",
  "coaProvided",
  "storage",
  "paymentMethods",
  "shippingTime",
  "internationalShipping",
  "returnPolicy",
  "legality",
  "orderTracking",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_KEYS.map((key) => ({
      "@type": "Question",
      name: t(`${key}Q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`${key}A`),
      },
    })),
  };

  return {
    title: t("title"),
    other: {
      "script:ld+json": JSON.stringify(faqJsonLd),
    },
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_KEYS.map((key) => ({
      "@type": "Question",
      name: t(`${key}Q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`${key}A`),
      },
    })),
  };

  return (
    <main className="flex-1 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <h1 className="text-3xl font-bold text-navy mb-10">{t("title")}</h1>

        <div className="max-w-2xl space-y-0 divide-y divide-border border border-border rounded-lg">
          {FAQ_KEYS.map((key) => (
            <details key={key} className="group">
              <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-navy hover:bg-surface select-none list-none flex items-center justify-between">
                <span>{t(`${key}Q`)}</span>
                <span className="ml-4 text-muted transition-transform group-open:rotate-45 text-lg leading-none">
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm text-secondary leading-relaxed">
                {t(`${key}A`)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
