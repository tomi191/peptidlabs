import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPeptides } from "@/lib/queries";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { EncyclopediaGrid } from "./EncyclopediaGrid";

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

  return (
    <main className="flex-1 bg-white">
      {/* Hero */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-12 md:py-16">
          <FadeIn>
            <div className="flex items-start gap-4 mb-4">
              <div className="rounded-xl bg-teal-600/10 p-3">
                <BookOpen className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-navy">
                  {t("title")}
                </h1>
                <p className="mt-2 text-secondary leading-relaxed max-w-2xl">
                  {t("subtitle")}
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm text-muted leading-relaxed">
              {t("heroDetail")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Grid with search */}
      <section className="mx-auto max-w-[1280px] px-6 py-12">
        <FadeIn>
          <EncyclopediaGrid peptides={peptides} />
        </FadeIn>
      </section>

      {/* Intro SEO content */}
      <section className="bg-surface border-t border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-12">
          <FadeIn>
            <h2 className="text-lg font-semibold text-navy mb-3">
              {t("whatIsTitle")}
            </h2>
            <p className="max-w-3xl text-sm text-secondary leading-relaxed">
              {t("intro")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-[1280px] px-6 py-8 border-t border-border">
        <p className="text-xs text-muted">
          {t("disclaimer")}
        </p>
      </section>
    </main>
  );
}
