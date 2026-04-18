import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  RotateCcw,
  ClipboardCheck,
  CircleCheck,
  AlertTriangle,
  Truck,
  Info,
  Package,
  Calendar,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { InfoTile } from "@/components/ui/InfoTile";
import { PlaceholderVisual } from "@/components/ui/PlaceholderVisual";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "returns" });
  return {
    title: t("title"),
    alternates: {
      canonical: `https://peptidlabs.eu/${locale}/returns`,
      languages: {
        bg: "https://peptidlabs.eu/bg/returns",
        en: "https://peptidlabs.eu/en/returns",
      },
    },
  };
}

export default async function ReturnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("returns");
  const isBg = locale === "bg";

  const conditions = [
    { key: "condition1", icon: Package },
    { key: "condition2", icon: Calendar },
    { key: "condition3", icon: ClipboardCheck },
    { key: "condition4", icon: CircleCheck },
  ] as const;

  return (
    <main className="flex-1 bg-white">
      <PageHero
        crumbs={[{ label: t("title") }]}
        marker={isBg ? "[RETURNS/01] ПОЛИТИКА" : "[RETURNS/01] POLICY"}
        title={t("title")}
        subtitle={t("intro")}
        locale={locale}
        aside={
          <div className="flex items-center gap-5 font-mono text-[11px] text-muted">
            <div className="text-right">
              <p className="uppercase tracking-widest">14 {isBg ? "дни" : "days"}</p>
              <p className="mt-1 text-[9px]">
                {isBg ? "право на отказ" : "right of withdrawal"}
              </p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-right">
              <p className="uppercase tracking-widest">48h</p>
              <p className="mt-1 text-[9px]">
                {isBg ? "за рекламация" : "damage claim"}
              </p>
            </div>
          </div>
        }
      />

      <div className="mx-auto max-w-[1280px] px-6 pb-16">
        {/* ─── Policy overview + illustrative placeholder ─── */}
        <section className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start mb-16">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
              {isBg ? "[RETURNS/02] КРАТКО" : "[RETURNS/02] OVERVIEW"}
            </p>
            <h2 className="font-display text-2xl font-bold text-navy mb-4 tracking-[-0.02em]">
              {isBg
                ? "Какво можем да върнем"
                : "What we can refund"}
            </h2>
            <p className="text-secondary leading-relaxed">
              {t("policyOverview")}
            </p>
          </div>
          <PlaceholderVisual
            variant="certificate"
            label={isBg ? "Процес на рекламация" : "Return flow"}
            className="aspect-[4/3]"
          />
        </section>

        {/* ─── Conditions ─── */}
        <section className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            {isBg ? "[RETURNS/03] УСЛОВИЯ" : "[RETURNS/03] CONDITIONS"}
          </p>
          <h2 className="font-display text-2xl font-bold text-navy mb-8 tracking-[-0.02em]">
            {t("conditionsTitle")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {conditions.map((c, i) => (
              <InfoTile
                key={c.key}
                icon={c.icon}
                index={`0${i + 1}`}
                title={t(c.key).split(" ").slice(0, 3).join(" ") + "…"}
                body={<>{t(c.key)}</>}
              />
            ))}
          </div>
        </section>

        {/* ─── Process — how to return ─── */}
        <section className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            {isBg ? "[RETURNS/04] ПРОЦЕС" : "[RETURNS/04] PROCESS"}
          </p>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy mb-4 tracking-[-0.02em]">
                {t("howToTitle")}
              </h2>
              <p className="text-secondary leading-relaxed mb-6">
                {t("howToDesc")}
              </p>
              <div className="rounded-xl border border-border bg-surface p-5 flex items-start gap-3">
                <RotateCcw className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <p className="text-sm text-secondary leading-relaxed">
                  {isBg
                    ? "Пишете на support@peptidlabs.eu със снимки на продукта и кратко описание. Отговаряме в рамките на 24 часа."
                    : "Email support@peptidlabs.eu with photos of the product and a short description. We respond within 24 hours."}
                </p>
              </div>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-navy mb-4 tracking-[-0.02em]">
                {t("refundTitle")}
              </h2>
              <p className="text-secondary leading-relaxed mb-6">
                {t("refundDesc")}
              </p>
              <div className="rounded-xl border border-border bg-surface p-5 flex items-start gap-3">
                <Truck className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <p className="text-sm text-secondary leading-relaxed">
                  {isBg
                    ? "Сумата се възстановява по оригиналния начин на плащане в рамките на 5-10 работни дни след получаване и проверка на върнатата пратка."
                    : "The amount is refunded via the original payment method within 5-10 business days after receipt and inspection of the returned shipment."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Edge cases ─── */}
        <section className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            {isBg ? "[RETURNS/05] СПЕЦИАЛНИ СЛУЧАИ" : "[RETURNS/05] EDGE CASES"}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoTile
              icon={AlertTriangle}
              title={t("damagedTitle")}
              body={<>{t("damagedText")}</>}
              accent
            />
            <InfoTile
              icon={Info}
              title={t("wrongItemTitle")}
              body={<>{t("wrongItemText")}</>}
              accent
            />
          </div>
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
