import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Calculator from "./Calculator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calculator" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `https://peptidelab.bg/${locale}/calculator`,
      languages: {
        bg: "https://peptidelab.bg/bg/calculator",
        en: "https://peptidelab.bg/en/calculator",
      },
    },
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("calculator");

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[800px] px-6 py-12">
        <h1 className="text-3xl font-bold text-navy mb-3">{t("title")}</h1>
        <p className="text-secondary text-sm leading-relaxed mb-10">
          {t("subtitle")}
        </p>

        <Calculator />

        {/* How to use */}
        <section className="mt-12 bg-surface rounded-xl p-6 border border-border">
          <h2 className="text-lg font-semibold text-navy mb-3">
            {t("howToUse")}
          </h2>
          <p className="text-secondary text-sm leading-relaxed whitespace-pre-line">
            {t("howToUseText")}
          </p>
        </section>

        {/* Research disclaimer */}
        <p className="mt-8 text-muted text-xs text-center leading-relaxed">
          {t("disclaimer")}
        </p>
      </div>
    </main>
  );
}
