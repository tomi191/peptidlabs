import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPublishedPeptideCount } from "@/lib/queries";
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
  BookOpen,
  Globe,
} from "lucide-react";
import Image from "next/image";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHero } from "@/components/layout/PageHero";
import { InfoTile } from "@/components/ui/InfoTile";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ABOUT_LAB_BENCH = SUPABASE_URL
  ? `${SUPABASE_URL}/storage/v1/object/public/product-images/about/lab-bench.png`
  : null;
const ABOUT_TEAM_PORTRAIT = SUPABASE_URL
  ? `${SUPABASE_URL}/storage/v1/object/public/product-images/about/team-portrait.png`
  : null;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    alternates: {
      canonical: `https://peptidlabs.eu/${locale}/about`,
      languages: {
        bg: "https://peptidlabs.eu/bg/about",
        en: "https://peptidlabs.eu/en/about",
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const isBg = locale === "bg";
  const peptideTotal = await getPublishedPeptideCount();

  return (
    <main className="flex-1 bg-white">
      <PageHero
        crumbs={[{ label: t("title") }]}
        title={t("title")}
        subtitle={t("mission")}
        locale={locale}
        aside={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-white px-4 py-2.5">
              <TestTubes className="h-4 w-4 text-teal-600 shrink-0" />
              <div>
                <p className="text-base font-bold text-navy font-mono tabular">
                  {peptideTotal}+
                </p>
                <p className="text-[10px] text-muted uppercase tracking-widest">
                  {t("statPeptides")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-white px-4 py-2.5">
              <Globe className="h-4 w-4 text-teal-600 shrink-0" />
              <div>
                <p className="text-base font-bold text-navy font-mono tabular">
                  EU
                </p>
                <p className="text-[10px] text-muted uppercase tracking-widest">
                  {t("statDelivery")}
                </p>
              </div>
            </div>
          </div>
        }
      />

      <div className="mx-auto max-w-[1280px] px-6 pb-16">
        <section className="mb-16">
          <FadeIn>
            <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
              <div>
                <h2 className="font-display text-2xl font-bold text-navy mb-5 tracking-[-0.02em]">
                  {t("storyTitle")}
                </h2>
                <p className="text-sm text-secondary leading-relaxed mb-6">
                  {t("storyText")}
                </p>
                <div className="rounded-xl border border-border bg-surface p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                    {t("storyStatsTitle")}
                  </p>
                  <ul className="space-y-2">
                    {(["storyStat1", "storyStat2", "storyStat3", "storyStat4"] as const).map(
                      (k) => (
                        <li
                          key={k}
                          className="flex items-start gap-2 text-sm text-secondary"
                        >
                          <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{t(k)}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_40px_-24px_rgba(15,23,42,0.18)]">
                {ABOUT_LAB_BENCH && (
                  <Image
                    src={ABOUT_LAB_BENCH}
                    alt={isBg ? "HPLC лаборатория" : "HPLC laboratory"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    quality={95}
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          </FadeIn>
        </section>

        <section className="mb-16">
          <FadeIn>
            <h2 className="font-display text-2xl font-bold text-navy mb-8 tracking-[-0.02em]">
              {t("whyTitle")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <InfoTile
                icon={FlaskConical}
                index="01"
                title={t("testedTitle")}
                body={<>{t("testedDesc")}</>}
              />
              <InfoTile
                icon={Truck}
                index="02"
                title={t("euTitle")}
                body={<>{t("euDesc")}</>}
              />
              <InfoTile
                icon={FileCheck}
                index="03"
                title={t("coaTitle")}
                body={<>{t("coaDesc")}</>}
              />
            </div>
          </FadeIn>
        </section>

        <section className="mb-16">
          <FadeIn>
            <h2 className="font-display text-2xl font-bold text-navy mb-4 tracking-[-0.02em]">
              {t("qualityStandardsTitle")}
            </h2>
            <p className="max-w-2xl text-sm text-secondary leading-relaxed mb-8">
              {t("qualityStandardsText")}
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <InfoTile
                icon={TestTubes}
                index="01"
                title={t("qsHplcTitle")}
                body={<>{t("qsHplcDesc")}</>}
              />
              <InfoTile
                icon={ShieldCheck}
                index="02"
                title={t("qsCoaTitle")}
                body={<>{t("qsCoaDesc")}</>}
              />
              <InfoTile
                icon={Package}
                index="03"
                title={t("qsPackagingTitle")}
                body={<>{t("qsPackagingDesc")}</>}
              />
            </div>
          </FadeIn>
        </section>

        <section className="mb-16">
          <FadeIn>
            <h2 className="font-display text-2xl font-bold text-navy mb-8 tracking-[-0.02em]">
              {t("howWeWorkTitle")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: ClipboardCheck,
                  title: t("hwStep1Title"),
                  desc: t("hwStep1Desc"),
                },
                {
                  icon: FlaskConical,
                  title: t("hwStep2Title"),
                  desc: t("hwStep2Desc"),
                },
                {
                  icon: Package,
                  title: t("hwStep3Title"),
                  desc: t("hwStep3Desc"),
                },
                {
                  icon: Send,
                  title: t("hwStep4Title"),
                  desc: t("hwStep4Desc"),
                },
              ].map((item, i) => (
                <InfoTile
                  key={i}
                  icon={item.icon}
                  index={`0${i + 1}`}
                  title={item.title}
                  body={<>{item.desc}</>}
                />
              ))}
            </div>
          </FadeIn>
        </section>

        <section className="mb-16">
          <FadeIn>
            <div className="grid gap-10 lg:grid-cols-[420px_1fr] lg:items-center">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_40px_-24px_rgba(15,23,42,0.18)]">
                {ABOUT_TEAM_PORTRAIT && (
                  <Image
                    src={ABOUT_TEAM_PORTRAIT}
                    alt={isBg ? "Научен екип" : "Science team"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    quality={95}
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-navy mb-4 tracking-[-0.02em]">
                  {isBg
                    ? "Хората зад лабораторията"
                    : "The people behind the lab"}
                </h2>
                <p className="text-secondary leading-relaxed">
                  {isBg
                    ? "PeptidLabs е основан от екип от биотехнолози, фармацевти и разработчици с опит в европейски научни институции. Работим с независими акредитирани лаборатории в Гърция и Полша за HPLC верификация и масспектрометричен анализ на всяка партида."
                    : "PeptidLabs is founded by a team of biotechnologists, pharmacists and engineers with experience in European research institutions. We work with independent accredited labs in Greece and Poland for HPLC verification and mass spectrometry analysis of every batch."}
                </p>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Disclaimer */}
        <section className="border-t border-border pt-8">
          <p className="text-xs text-muted italic leading-relaxed">
            {t("disclaimer")}
          </p>
        </section>
      </div>
    </main>
  );
}
