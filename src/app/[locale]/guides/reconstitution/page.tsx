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
  CheckCircle2,
  Info,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { PlaceholderVisual } from "@/components/ui/PlaceholderVisual";

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
      canonical: `https://peptidlabs.eu/${locale}/guides/reconstitution`,
      languages: {
        bg: "https://peptidlabs.eu/bg/guides/reconstitution",
        en: "https://peptidlabs.eu/en/guides/reconstitution",
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
  const isBg = locale === "bg";

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

      <PageHero
        crumbs={[
          { label: isBg ? "Помощ" : "Guides" },
          { label: t("title") },
        ]}
        marker={isBg ? "[GUIDE/01] РЕКОНСТИТУЦИЯ" : "[GUIDE/01] RECONSTITUTION"}
        title={t("title")}
        subtitle={t("intro")}
        locale={locale}
        aside={
          <div className="flex items-center gap-5 font-mono text-[11px] text-muted">
            <div className="text-right">
              <p className="uppercase tracking-widest">
                {STEP_KEYS.length} {isBg ? "стъпки" : "steps"}
              </p>
              <p className="mt-1 text-[9px]">
                {isBg ? "от флакон до инжекция" : "vial to draw"}
              </p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-right">
              <p className="uppercase tracking-widest">~10 min</p>
              <p className="mt-1 text-[9px]">
                {isBg ? "четене" : "read time"}
              </p>
            </div>
          </div>
        }
      />

      <div className="mx-auto max-w-[1280px] px-6 pb-16">
        {/* ─── [GUIDE/02] CHECKLIST + VISUAL ─── */}
        <section className="mb-16 grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
              {isBg ? "[GUIDE/02] ПРИГОТВЯНЕ" : "[GUIDE/02] PREPARATION"}
            </p>
            <h2 className="font-display text-2xl font-bold text-navy mb-5 tracking-[-0.02em]">
              {t("checklistTitle")}
            </h2>
            <div className="rounded-xl bg-surface border border-border p-6">
              <ul className="space-y-3">
                {CHECKLIST_KEYS.map((key) => (
                  <li
                    key={key}
                    className="flex items-start gap-3 text-sm text-secondary leading-relaxed"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-teal-600 mt-0.5 shrink-0"
                    />
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
          </div>
          <PlaceholderVisual
            variant="diagram"
            label={isBg ? "Работен процес" : "Workflow diagram"}
            className="aspect-[4/3]"
          />
        </section>

        {/* ─── [GUIDE/03] STEPS ─── */}
        <section className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            {isBg ? "[GUIDE/03] СТЪПКИ" : "[GUIDE/03] STEPS"}
          </p>
          <h2 className="font-display text-2xl font-bold text-navy mb-8 tracking-[-0.02em]">
            {t("stepsTitle")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {STEP_KEYS.map((key, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <div
                  key={key}
                  className="rounded-xl border border-border bg-white p-6 relative"
                >
                  <p className="absolute top-5 right-5 font-mono text-[11px] font-bold text-muted tabular">
                    0{i + 1}
                  </p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white">
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-base font-semibold text-navy">
                      {t(`steps.${key}.title`)}
                    </h3>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed whitespace-pre-line">
                    {t(`steps.${key}.body`)}
                  </p>
                  {key === "drawWater" && (
                    <Link
                      href="/calculator"
                      className="inline-flex items-center gap-2 mt-4 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                    >
                      <Calculator size={14} strokeWidth={1.5} />
                      {t("calculatorLink")}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── [GUIDE/04] TIPS ─── */}
        <section className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            {isBg ? "[GUIDE/04] ВАЖНИ СЪВЕТИ" : "[GUIDE/04] IMPORTANT TIPS"}
          </p>
          <h2 className="font-display text-2xl font-bold text-navy mb-6 tracking-[-0.02em]">
            {t("tipsTitle")}
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {TIP_KEYS.map((key) => (
              <div
                key={key}
                className="border-l-4 border-accent bg-accent-tint p-5 rounded-r-xl"
              >
                <div className="flex items-start gap-3">
                  <CircleAlert
                    size={16}
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

        {/* ─── [GUIDE/05] FAQ ─── */}
        <section className="mb-16 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
              {isBg ? "[GUIDE/05] ЧЗВ" : "[GUIDE/05] FAQ"}
            </p>
            <h2 className="font-display text-2xl font-bold text-navy mb-6 tracking-[-0.02em]">
              {t("faqTitle")}
            </h2>
            <div className="divide-y divide-border border border-border rounded-xl bg-white overflow-hidden">
              {FAQ_KEYS.map((key) => (
                <details key={key} className="group">
                  <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-navy hover:bg-surface select-none list-none flex items-center justify-between">
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
          </div>
          <aside className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-xl border border-border p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
                {isBg ? "Следваща стъпка" : "Next step"}
              </p>
              <h3 className="text-sm font-semibold text-navy mb-3">
                {t("ctaTitle")}
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-navy/90 transition-colors"
                >
                  <Calculator size={14} strokeWidth={1.5} />
                  {t("ctaCalculator")}
                </Link>
                <Link
                  href="/products/reconstitution-starter-kit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
                >
                  <ShoppingCart size={14} strokeWidth={1.5} />
                  {t("ctaStarterKit")}
                </Link>
                <Link
                  href="/shop/accessories"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-navy hover:bg-surface transition-colors"
                >
                  <Droplets size={14} strokeWidth={1.5} />
                  {t("ctaBacWater")}
                </Link>
              </div>
            </div>
          </aside>
        </section>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-surface p-5">
          <Info size={16} className="text-muted shrink-0 mt-0.5" />
          <p className="text-xs text-muted leading-relaxed">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </main>
  );
}
