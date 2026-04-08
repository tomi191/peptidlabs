import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { FlaskConical, Truck, FileCheck } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <main className="flex-1 bg-white">
      {/* Hero */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <h1 className="text-3xl font-bold text-navy">{t("title")}</h1>
          <p className="mt-4 max-w-2xl text-secondary leading-relaxed">
            {t("mission")}
          </p>
        </div>
      </section>

      {/* Why PeptideLab */}
      <section className="mx-auto max-w-[1280px] px-6 py-16">
        <h2 className="text-xl font-semibold text-navy mb-8">
          {t("whyTitle")}
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="border border-border rounded-lg p-6">
            <FlaskConical className="h-6 w-6 text-teal-600 mb-3" />
            <h3 className="font-semibold text-navy mb-2">
              {t("testedTitle")}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {t("testedDesc")}
            </p>
          </div>
          <div className="border border-border rounded-lg p-6">
            <Truck className="h-6 w-6 text-teal-600 mb-3" />
            <h3 className="font-semibold text-navy mb-2">{t("euTitle")}</h3>
            <p className="text-sm text-muted leading-relaxed">
              {t("euDesc")}
            </p>
          </div>
          <div className="border border-border rounded-lg p-6">
            <FileCheck className="h-6 w-6 text-teal-600 mb-3" />
            <h3 className="font-semibold text-navy mb-2">{t("coaTitle")}</h3>
            <p className="text-sm text-muted leading-relaxed">
              {t("coaDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* Quality */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <h2 className="text-xl font-semibold text-navy mb-4">
            {t("qualityTitle")}
          </h2>
          <p className="max-w-2xl text-secondary leading-relaxed">
            {t("qualityDesc")}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-[1280px] px-6 py-16">
        <h2 className="text-lg font-semibold text-navy mb-3">
          {t("storyTitle")}
        </h2>
        <p className="max-w-3xl text-sm text-secondary leading-relaxed">
          {t("storyText")}
        </p>
      </section>

      {/* Quality Standards */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <h2 className="text-lg font-semibold text-navy mb-3">
            {t("qualityStandardsTitle")}
          </h2>
          <p className="max-w-3xl text-sm text-secondary leading-relaxed">
            {t("qualityStandardsText")}
          </p>
        </div>
      </section>

      {/* Shipping & Packaging */}
      <section className="mx-auto max-w-[1280px] px-6 py-16">
        <h2 className="text-lg font-semibold text-navy mb-3">
          {t("shippingInfoTitle")}
        </h2>
        <p className="max-w-3xl text-sm text-secondary leading-relaxed">
          {t("shippingInfoText")}
        </p>
      </section>

      {/* Research disclaimer */}
      <section className="mx-auto max-w-[1280px] px-6 py-10 border-t border-border">
        <p className="text-xs text-muted">{t("disclaimer")}</p>
      </section>
    </main>
  );
}
