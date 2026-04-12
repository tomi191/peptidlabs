import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  FlaskConical,
  Truck,
  FileCheck,
  TestTubes,
  Package,
  ShieldCheck,
  ClipboardCheck,
  Send,
  CheckCircle2,
  Users,
  BookOpen,
  Globe,
} from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

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
      {/* Hero with stats */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-12 md:py-16">
          <FadeIn>
            <h1 className="text-3xl md:text-4xl font-bold text-navy">
              {t("title")}
            </h1>
            <p className="mt-4 max-w-2xl text-secondary leading-relaxed">
              {t("mission")}
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              <div className="flex items-center gap-3 bg-white rounded-2xl border border-border px-5 py-3">
                <TestTubes className="h-5 w-5 text-teal-600 shrink-0" />
                <div>
                  <p className="text-xl font-bold text-navy font-mono">65+</p>
                  <p className="text-xs text-muted">{t("statPeptides")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-2xl border border-border px-5 py-3">
                <BookOpen className="h-5 w-5 text-teal-600 shrink-0" />
                <div>
                  <p className="text-xl font-bold text-navy font-mono">25+</p>
                  <p className="text-xs text-muted">{t("statArticles")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-2xl border border-border px-5 py-3">
                <Globe className="h-5 w-5 text-teal-600 shrink-0" />
                <div>
                  <p className="text-xl font-bold text-navy font-mono">EU</p>
                  <p className="text-xs text-muted">{t("statDelivery")}</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Our Story — 2 columns */}
      <section className="mx-auto max-w-[1280px] px-6 py-14">
        <FadeIn>
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <h2 className="text-xl font-semibold text-navy mb-4">
                {t("storyTitle")}
              </h2>
              <p className="text-sm text-secondary leading-relaxed">
                {t("storyText")}
              </p>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-surface rounded-2xl border border-border p-6">
                <h3 className="text-sm font-semibold text-navy mb-4">
                  {t("storyStatsTitle")}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                    <p className="text-sm text-secondary">{t("storyStat1")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                    <p className="text-sm text-secondary">{t("storyStat2")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                    <p className="text-sm text-secondary">{t("storyStat3")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                    <p className="text-sm text-secondary">{t("storyStat4")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Why PeptideLab */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-14">
          <FadeIn>
            <h2 className="text-xl font-semibold text-navy mb-8">
              {t("whyTitle")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="bg-white border border-border rounded-2xl p-6">
                <FlaskConical className="h-6 w-6 text-teal-600 mb-3" />
                <h3 className="font-semibold text-navy mb-2">
                  {t("testedTitle")}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t("testedDesc")}
                </p>
              </div>
              <div className="bg-white border border-border rounded-2xl p-6">
                <Truck className="h-6 w-6 text-teal-600 mb-3" />
                <h3 className="font-semibold text-navy mb-2">
                  {t("euTitle")}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t("euDesc")}
                </p>
              </div>
              <div className="bg-white border border-border rounded-2xl p-6">
                <FileCheck className="h-6 w-6 text-teal-600 mb-3" />
                <h3 className="font-semibold text-navy mb-2">
                  {t("coaTitle")}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t("coaDesc")}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Quality Standards — 3 cards */}
      <section className="mx-auto max-w-[1280px] px-6 py-14">
        <FadeIn>
          <h2 className="text-xl font-semibold text-navy mb-3">
            {t("qualityStandardsTitle")}
          </h2>
          <p className="max-w-2xl text-sm text-secondary leading-relaxed mb-8">
            {t("qualityStandardsText")}
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="border border-border rounded-2xl p-6">
              <TestTubes className="h-6 w-6 text-teal-600 mb-3" />
              <h3 className="font-semibold text-navy mb-2">
                {t("qsHplcTitle")}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {t("qsHplcDesc")}
              </p>
            </div>
            <div className="border border-border rounded-2xl p-6">
              <ShieldCheck className="h-6 w-6 text-teal-600 mb-3" />
              <h3 className="font-semibold text-navy mb-2">
                {t("qsCoaTitle")}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {t("qsCoaDesc")}
              </p>
            </div>
            <div className="border border-border rounded-2xl p-6">
              <Package className="h-6 w-6 text-teal-600 mb-3" />
              <h3 className="font-semibold text-navy mb-2">
                {t("qsPackagingTitle")}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {t("qsPackagingDesc")}
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* How We Work — timeline */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-14">
          <FadeIn>
            <h2 className="text-xl font-semibold text-navy mb-8">
              {t("howWeWorkTitle")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: ClipboardCheck,
                  step: "1",
                  title: t("hwStep1Title"),
                  desc: t("hwStep1Desc"),
                },
                {
                  icon: FlaskConical,
                  step: "2",
                  title: t("hwStep2Title"),
                  desc: t("hwStep2Desc"),
                },
                {
                  icon: Package,
                  step: "3",
                  title: t("hwStep3Title"),
                  desc: t("hwStep3Desc"),
                },
                {
                  icon: Send,
                  step: "4",
                  title: t("hwStep4Title"),
                  desc: t("hwStep4Desc"),
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-white rounded-2xl border border-border p-6 relative"
                >
                  <span className="absolute top-4 right-4 text-3xl font-bold text-teal-600/15 font-mono">
                    {item.step}
                  </span>
                  <item.icon className="h-6 w-6 text-teal-600 mb-3" />
                  <h3 className="font-semibold text-navy mb-2">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Research disclaimer */}
      <section className="mx-auto max-w-[1280px] px-6 py-10 border-t border-border">
        <p className="text-xs text-muted">{t("disclaimer")}</p>
      </section>
    </main>
  );
}
