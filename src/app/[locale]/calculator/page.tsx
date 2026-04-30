import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import {
  FlaskConical,
  Droplets,
  Calculator as CalcIcon,
  Syringe,
  Info,
} from "lucide-react";
import Calculator from "./Calculator";
import { Abbr } from "@/components/ui/Abbr";

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
      canonical: `https://peptidlabs.eu/${locale}/calculator`,
      languages: {
        bg: "https://peptidlabs.eu/bg/calculator",
        en: "https://peptidlabs.eu/en/calculator",
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
  const isBg = locale === "bg";

  const howToSteps = [
    {
      icon: FlaskConical,
      title: isBg ? "Размер на флакона" : "Vial size",
      text: isBg
        ? "Въведете количеството пептид, посочено на етикета (в mg)."
        : "Enter the peptide amount shown on the label (in mg).",
    },
    {
      icon: Droplets,
      title: isBg ? "Бактериостатична вода" : "Bacteriostatic water",
      text: isBg
        ? "Количеството разтворител, което сте инжектирали във флакона."
        : "The volume of solvent you injected into the vial.",
    },
    {
      icon: CalcIcon,
      title: isBg ? "Желана доза" : "Desired dose",
      text: isBg
        ? "Дозата за един единичен експеримент, в микрограми (mcg)."
        : "The target dose per single experiment, in micrograms (mcg).",
    },
    {
      icon: Syringe,
      title: isBg ? "Тип спринцовка" : "Syringe type",
      text: isBg
        ? "Обикновено инсулинови спринцовки — 0.3, 0.5 или 1.0 ml."
        : "Usually insulin syringes — 0.3, 0.5, or 1.0 ml.",
    },
  ];

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-6">
          <Link href="/" className="hover:text-teal-600">
            {isBg ? "Начало" : "Home"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">{t("title")}</span>
        </nav>

        <div className="mb-10 flex items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-navy tracking-[-0.03em]">
              {t("title")}
            </h1>
            <p className="mt-4 text-secondary leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-6 font-mono text-[11px] text-muted">
            <div className="text-right">
              <p className="uppercase tracking-widest">
                <Abbr term="HPLC" /> над 98%
              </p>
              <p className="mt-1 text-[9px]">
                {isBg ? "верифицирана чистота" : "verified purity"}
              </p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-right">
              <p className="uppercase tracking-widest">
                {isBg ? "in vitro" : "in vitro"}
              </p>
              <p className="mt-1 text-[9px]">
                {isBg ? "само изследователска употреба" : "research use only"}
              </p>
            </div>
          </div>
        </div>

        {/* Calculator component */}
        <Calculator />

        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold text-navy mb-8 tracking-[-0.02em]">
            {isBg ? "Как работи калкулаторът" : "How the calculator works"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howToSteps.map((step, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-white p-5 relative"
              >
                <p className="absolute top-4 right-4 font-mono text-[10px] text-muted tabular">
                  0{i + 1}
                </p>
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-navy mb-3">
                  <step.icon size={18} strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-navy text-sm">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs text-secondary leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="sr-only">{isBg ? "Добри практики" : "Best practices"}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-3">
                <Droplets size={16} className="text-teal-600" />
                <h3 className="font-semibold text-navy text-sm">
                  {isBg ? "Реконституция" : "Reconstitution"}
                </h3>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                {isBg
                  ? "Инжектирайте бактериостатичната вода бавно по стената на флакона. Не разклащайте — завъртете леко за разтваряне."
                  : "Inject the bacteriostatic water slowly down the vial wall. Do not shake — gently swirl to dissolve."}
              </p>
            </div>
            <div className="rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-3">
                <FlaskConical size={16} className="text-teal-600" />
                <h3 className="font-semibold text-navy text-sm">
                  {isBg ? "Съхранение" : "Storage"}
                </h3>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                {isBg
                  ? "Лиофилизираният продукт — при 2–8°C. След реконституция — в хладилник до 28 дни (при бактериостатична вода)."
                  : "Lyophilized product — at 2–8°C. After reconstitution — refrigerated up to 28 days (with bacteriostatic water)."}
              </p>
            </div>
            <div className="rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-3">
                <Syringe size={16} className="text-teal-600" />
                <h3 className="font-semibold text-navy text-sm">
                  {isBg ? "Избор на спринцовка" : "Syringe selection"}
                </h3>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                {isBg
                  ? "За малки обеми (<0.3 ml) ползвайте 0.3 ml (30 U) спринцовка за по-точно измерване."
                  : "For small volumes (<0.3 ml), use a 0.3 ml (30 U) syringe for accurate measurement."}
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-16 flex items-start gap-3 rounded-xl border border-dashed border-border bg-surface p-5">
          <Info size={16} className="text-muted shrink-0 mt-0.5" />
          <p className="text-xs text-muted leading-relaxed">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </main>
  );
}
