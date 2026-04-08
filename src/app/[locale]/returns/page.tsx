import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "returns" });
  return { title: t("title") };
}

export default async function ReturnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("returns");

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <h1 className="text-3xl font-bold text-navy mb-4">{t("title")}</h1>
        <p className="mb-10 max-w-3xl text-sm text-secondary leading-relaxed">
          {t("intro")}
        </p>

        {/* Policy overview */}
        <section className="mb-10">
          <p className="text-secondary leading-relaxed max-w-2xl">
            {t("policyOverview")}
          </p>
        </section>

        {/* Conditions */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-navy mb-4">
            {t("conditionsTitle")}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-secondary">
            <li>{t("condition1")}</li>
            <li>{t("condition2")}</li>
            <li>{t("condition3")}</li>
            <li>{t("condition4")}</li>
          </ul>
        </section>

        {/* How to return */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-navy mb-4">
            {t("howToTitle")}
          </h2>
          <p className="text-sm text-secondary leading-relaxed max-w-2xl">
            {t("howToDesc")}
          </p>
        </section>

        {/* Refund timeline */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-navy mb-4">
            {t("refundTitle")}
          </h2>
          <p className="text-sm text-secondary leading-relaxed max-w-2xl">
            {t("refundDesc")}
          </p>
        </section>

        {/* Damaged product */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-navy mb-3">
            {t("damagedTitle")}
          </h2>
          <p className="text-sm text-secondary leading-relaxed max-w-3xl">
            {t("damagedText")}
          </p>
        </section>

        {/* Wrong product */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-navy mb-3">
            {t("wrongItemTitle")}
          </h2>
          <p className="text-sm text-secondary leading-relaxed max-w-3xl">
            {t("wrongItemText")}
          </p>
        </section>

        {/* Disclaimer */}
        <section className="border-t border-border pt-8">
          <p className="text-xs text-muted">{t("disclaimer")}</p>
        </section>
      </div>
    </main>
  );
}
