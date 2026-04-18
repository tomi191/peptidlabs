import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  FlaskConical,
  FileCheck,
  Thermometer,
  CreditCard,
  Truck,
  Globe,
  RotateCcw,
  Scale,
  Search,
  HelpCircle,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/layout/PageHero";

const FAQ_KEYS = [
  { key: "whatArePeptides", icon: FlaskConical, cat: "peptides" },
  { key: "purityTesting", icon: FlaskConical, cat: "peptides" },
  { key: "coaProvided", icon: FileCheck, cat: "peptides" },
  { key: "storage", icon: Thermometer, cat: "peptides" },
  { key: "paymentMethods", icon: CreditCard, cat: "payment" },
  { key: "shippingTime", icon: Truck, cat: "shipping" },
  { key: "internationalShipping", icon: Globe, cat: "shipping" },
  { key: "returnPolicy", icon: RotateCcw, cat: "other" },
  { key: "legality", icon: Scale, cat: "other" },
  { key: "orderTracking", icon: Search, cat: "shipping" },
] as const;

type Category = "peptides" | "shipping" | "payment" | "other";

const CATEGORIES: Record<Category, { bg: string; en: string; marker: string }> =
  {
    peptides: { bg: "Продукти", en: "Products", marker: "01" },
    shipping: { bg: "Доставка", en: "Shipping", marker: "02" },
    payment: { bg: "Плащане", en: "Payment", marker: "03" },
    other: { bg: "Други", en: "Other", marker: "04" },
  };

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
    mainEntity: FAQ_KEYS.map(({ key }) => ({
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
    alternates: {
      canonical: `https://peptidlabs.eu/${locale}/faq`,
      languages: {
        bg: "https://peptidlabs.eu/bg/faq",
        en: "https://peptidlabs.eu/en/faq",
      },
    },
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
  const isBg = locale === "bg";

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_KEYS.map(({ key }) => ({
      "@type": "Question",
      name: t(`${key}Q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`${key}A`),
      },
    })),
  };

  const byCategory: Record<Category, typeof FAQ_KEYS[number][]> = {
    peptides: [],
    shipping: [],
    payment: [],
    other: [],
  };
  FAQ_KEYS.forEach((item) => {
    byCategory[item.cat].push(item);
  });

  return (
    <main className="flex-1 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PageHero
        crumbs={[{ label: t("title") }]}
        marker={isBg ? "[FAQ/01] ПОМОЩ" : "[FAQ/01] HELP"}
        title={t("title")}
        subtitle={
          isBg
            ? "Най-често задавани въпроси — от научни спецификации, през доставка до гаранции. Не откривате отговор? Пишете на support@peptidlabs.eu."
            : "The most common questions — from scientific specs to shipping and warranties. Can't find an answer? Email support@peptidlabs.eu."
        }
        locale={locale}
        aside={
          <div className="flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/50 px-4 py-2 font-mono text-[11px]">
            <HelpCircle size={14} className="text-teal-600" />
            <span className="text-teal-700 uppercase tracking-widest">
              {FAQ_KEYS.length} {isBg ? "въпроса" : "questions"}
            </span>
          </div>
        }
      />

      <div className="mx-auto max-w-[1280px] px-6 pb-16">
        {/* Grid — sidebar TOC + categorized lists */}
        <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:items-start">
          {/* TOC */}
          <aside className="lg:sticky lg:top-24">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
              {isBg ? "Категории" : "Categories"}
            </p>
            <nav className="space-y-1">
              {(Object.keys(CATEGORIES) as Category[]).map((cat) => {
                const c = CATEGORIES[cat];
                const count = byCategory[cat].length;
                return (
                  <Link
                    key={cat}
                    href={`#${cat}` as `/${string}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-secondary hover:bg-surface hover:text-navy transition-colors"
                  >
                    <span>{isBg ? c.bg : c.en}</span>
                    <span className="font-mono text-[10px] text-muted">
                      {count}
                    </span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-6 rounded-xl border border-border p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
                {isBg ? "Все още имате въпрос?" : "Still stuck?"}
              </p>
              <Link
                href="/contact"
                className="text-sm text-navy font-semibold hover:text-teal-600 transition-colors"
              >
                {isBg ? "Пишете ни →" : "Contact us →"}
              </Link>
            </div>
          </aside>

          {/* Content */}
          <div>
            {(Object.keys(CATEGORIES) as Category[]).map((cat) => {
              const c = CATEGORIES[cat];
              const items = byCategory[cat];
              if (items.length === 0) return null;
              return (
                <section
                  id={cat}
                  key={cat}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                      [FAQ/{c.marker}]
                    </p>
                    <h2 className="font-display text-xl font-bold text-navy tracking-[-0.02em]">
                      {isBg ? c.bg : c.en}
                    </h2>
                  </div>
                  <div className="divide-y divide-border border border-border rounded-xl bg-white overflow-hidden">
                    {items.map(({ key, icon: Icon }) => (
                      <details key={key} className="group">
                        <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-navy hover:bg-surface select-none list-none flex items-start justify-between gap-4">
                          <span className="flex items-start gap-3">
                            <Icon
                              size={16}
                              className="text-teal-600 mt-0.5 shrink-0"
                            />
                            <span>{t(`${key}Q`)}</span>
                          </span>
                          <span className="ml-4 text-muted transition-transform group-open:rotate-45 text-lg leading-none">
                            +
                          </span>
                        </summary>
                        <div className="px-5 pb-4 pt-1 text-sm text-secondary leading-relaxed pl-12">
                          {t(`${key}A`)}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
