import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPeptides } from "@/lib/queries";
import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/FadeIn";
import { EncyclopediaGrid } from "./EncyclopediaGrid";
import { PageHero } from "@/components/layout/PageHero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "encyclopedia" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `https://peptidlabs.eu/${locale}/encyclopedia`,
      languages: {
        bg: "https://peptidlabs.eu/bg/encyclopedia",
        en: "https://peptidlabs.eu/en/encyclopedia",
      },
    },
  };
}

export default async function EncyclopediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("encyclopedia");
  const peptides = await getPeptides();
  const isBg = locale === "bg";

  return (
    <main className="flex-1 bg-white">
      <PageHero
        crumbs={[{ label: t("title") }]}
        marker={isBg ? "[ENCY/01] НАУЧНА БАЗА" : "[ENCY/01] KNOWLEDGE BASE"}
        title={t("title")}
        subtitle={t("subtitle")}
        locale={locale}
        aside={
          <div className="rounded-xl border border-teal-200 bg-teal-50/50 px-5 py-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-teal-700">
              {isBg ? "Библиотека" : "Library"}
            </p>
            <p className="font-mono text-lg font-bold text-teal-700 mt-0.5 tabular">
              {peptides.length} {isBg ? "пептида" : "peptides"}
            </p>
          </div>
        }
      />

      {/* Detail paragraph */}
      <div className="mx-auto max-w-[1280px] px-6 pb-6 -mt-4">
        <p className="max-w-3xl text-sm text-muted leading-relaxed">
          {t("heroDetail")}
        </p>
      </div>

      {/* ─── [ENCY/02] CATALOG ─── */}
      <section className="mx-auto max-w-[1280px] px-6 py-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
          {isBg ? "[ENCY/02] КАТАЛОГ" : "[ENCY/02] CATALOG"}
        </p>
        <FadeIn>
          <EncyclopediaGrid peptides={peptides} />
        </FadeIn>
      </section>

      {/* ─── [ENCY/03] INTRO ─── */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-12">
          <FadeIn>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
              {isBg ? "[ENCY/03] ВЪВЕДЕНИЕ" : "[ENCY/03] INTRO"}
            </p>
            <h2 className="font-display text-2xl font-bold text-navy mb-4 tracking-[-0.02em]">
              {t("whatIsTitle")}
            </h2>
            <p className="max-w-3xl text-secondary leading-relaxed">
              {t("intro")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-[1280px] px-6 py-8 border-t border-border">
        <p className="text-xs text-muted italic">{t("disclaimer")}</p>
      </section>
    </main>
  );
}
