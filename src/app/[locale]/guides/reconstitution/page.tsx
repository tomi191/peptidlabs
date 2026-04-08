import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import {
  Beaker,
  Droplets,
  ShieldCheck,
  Thermometer,
  Syringe,
  FlaskConical,
  ArrowRight,
  CircleAlert,
  Calculator,
  ShoppingCart,
} from "lucide-react";

const STEP_KEYS = [
  "preparation",
  "disinfection",
  "drawWater",
  "addWater",
  "dissolve",
  "storage",
] as const;

const STEP_ICONS = [
  Beaker,
  ShieldCheck,
  Droplets,
  Syringe,
  FlaskConical,
  Thermometer,
] as const;

const FAQ_KEYS = [
  "bacVsSterile",
  "stability",
  "freeze",
  "notDissolving",
] as const;

const CHECKLIST_KEYS = [
  "peptideVial",
  "bacWater",
  "insulinSyringe",
  "mixingSyringe",
  "alcoholSwabs",
  "cleanWorkspace",
] as const;

const TIP_KEYS = ["useBacWater", "dontTouchCap", "newSyringe"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reconstitution" });

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_KEYS.map((key) => ({
      "@type": "Question",
      name: t(`faq.${key}Q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq.${key}A`),
      },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("metaTitle"),
    description: t("metaDescription"),
    step: STEP_KEYS.map((key, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: t(`steps.${key}.title`),
      text: t(`steps.${key}.body`),
    })),
  };

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `https://peptidelab.bg/${locale}/guides/reconstitution`,
      languages: {
        bg: "https://peptidelab.bg/bg/guides/reconstitution",
        en: "https://peptidelab.bg/en/guides/reconstitution",
      },
    },
    other: {
      "script:ld+json": JSON.stringify([faqJsonLd, howToJsonLd]),
    },
  };
}

export default async function ReconstitutionGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reconstitution");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_KEYS.map((key) => ({
      "@type": "Question",
      name: t(`faq.${key}Q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq.${key}A`),
      },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("metaTitle"),
    description: t("metaDescription"),
    step: STEP_KEYS.map((key, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: t(`steps.${key}.title`),
      text: t(`steps.${key}.body`),
    })),
  };

  return (
    <main className="flex-1 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([faqJsonLd, howToJsonLd]),
        }}
      />

      <div className="mx-auto max-w-[800px] px-6 py-12">
        {/* Header */}
        <h1 className="text-3xl font-bold text-navy mb-4">{t("title")}</h1>
        <p className="text-secondary text-sm leading-relaxed mb-10">
          {t("intro")}
        </p>

        {/* What You'll Need */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-navy mb-4">
            {t("checklistTitle")}
          </h2>
          <div className="bg-surface rounded-xl p-6 border border-border">
            <ul className="space-y-3">
              {CHECKLIST_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-3 text-sm text-secondary leading-relaxed"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border bg-white text-muted">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 6L5 8.5L9.5 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{t(`checklist.${key}`)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-4 border-t border-border">
              <Link
                href="/products/reconstitution-starter-kit"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
              >
                {t("checklistCta")}
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-navy mb-6">
            {t("stepsTitle")}
          </h2>
          <div className="space-y-4">
            {STEP_KEYS.map((key, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <div
                  key={key}
                  className="bg-surface rounded-xl p-6 border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white font-bold text-lg">
                        {i + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon
                          size={18}
                          strokeWidth={1.5}
                          className="text-accent shrink-0"
                        />
                        <h3 className="text-lg font-semibold text-navy">
                          {t(`steps.${key}.title`)}
                        </h3>
                      </div>
                      <p className="text-sm text-secondary leading-relaxed whitespace-pre-line">
                        {t(`steps.${key}.body`)}
                      </p>
                      {key === "drawWater" && (
                        <Link
                          href="/calculator"
                          className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                        >
                          <Calculator size={14} strokeWidth={1.5} />
                          {t("calculatorLink")}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Important Tips */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-navy mb-4">
            {t("tipsTitle")}
          </h2>
          <div className="space-y-3">
            {TIP_KEYS.map((key) => (
              <div
                key={key}
                className="border-l-4 border-accent bg-accent-tint p-4 rounded-r-lg"
              >
                <div className="flex items-start gap-3">
                  <CircleAlert
                    size={18}
                    strokeWidth={1.5}
                    className="text-accent shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-secondary leading-relaxed">
                    {t(`tips.${key}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-navy mb-4">
            {t("faqTitle")}
          </h2>
          <div className="space-y-0 divide-y divide-border border border-border rounded-lg">
            {FAQ_KEYS.map((key) => (
              <details key={key} className="group">
                <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-navy hover:bg-surface select-none list-none flex items-center justify-between">
                  <span>{t(`faq.${key}Q`)}</span>
                  <span className="ml-4 text-muted transition-transform group-open:rotate-45 text-lg leading-none">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 text-sm text-secondary leading-relaxed">
                  {t(`faq.${key}A`)}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Bottom CTAs */}
        <section className="bg-surface rounded-xl p-6 border border-border">
          <h2 className="text-lg font-semibold text-navy mb-4">
            {t("ctaTitle")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/calculator"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy/90 transition-colors"
            >
              <Calculator size={16} strokeWidth={1.5} />
              {t("ctaCalculator")}
            </Link>
            <Link
              href="/products/reconstitution-starter-kit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
            >
              <ShoppingCart size={16} strokeWidth={1.5} />
              {t("ctaStarterKit")}
            </Link>
            <Link
              href="/shop/accessories"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-medium text-navy hover:bg-surface transition-colors"
            >
              <Droplets size={16} strokeWidth={1.5} />
              {t("ctaBacWater")}
            </Link>
          </div>
        </section>

        {/* Research disclaimer */}
        <p className="mt-8 text-muted text-xs text-center leading-relaxed">
          {t("disclaimer")}
        </p>
      </div>
    </main>
  );
}
