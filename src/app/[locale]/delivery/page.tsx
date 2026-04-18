import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  Package,
  CreditCard,
  Banknote,
  Truck,
  Globe,
  Clock,
  MapPin,
  Shield,
  Thermometer,
  ScanSearch,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHero } from "@/components/layout/PageHero";
import { PlaceholderVisual } from "@/components/ui/PlaceholderVisual";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "delivery" });
  return { title: t("title") };
}

export default async function DeliveryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("delivery");
  const isBg = locale === "bg";

  return (
    <main className="flex-1 bg-white">
      <PageHero
        crumbs={[{ label: t("title") }]}
        marker={isBg ? "[DELIVERY/01] ДОСТАВКА" : "[DELIVERY/01] SHIPPING"}
        title={t("title")}
        subtitle={t("intro")}
        locale={locale}
        aside={
          <div className="flex items-center gap-5 font-mono text-[11px] text-muted">
            <div className="text-right">
              <p className="uppercase tracking-widest">1-2 {isBg ? "дни" : "days"}</p>
              <p className="mt-1 text-[9px]">BG</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-right">
              <p className="uppercase tracking-widest">3-7 {isBg ? "дни" : "days"}</p>
              <p className="mt-1 text-[9px]">EU</p>
            </div>
          </div>
        }
      />

      {/* Delivery Zones — 2 styled cards + map placeholder */}
      <section className="mx-auto max-w-[1280px] px-6 pb-14">
        <FadeIn>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            {isBg ? "[DELIVERY/02] ЗОНИ" : "[DELIVERY/02] ZONES"}
          </p>
          <h2 className="font-display text-2xl font-bold text-navy mb-8 tracking-[-0.02em]">
            {t("shippingTitle")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Bulgaria card */}
            <div className="rounded-2xl border-2 border-teal-600/30 bg-teal-600/[0.03] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-teal-600/10 p-2.5">
                  <MapPin className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-navy">
                  {t("bulgaria")}
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-muted shrink-0" />
                  <p className="text-sm text-secondary">
                    Econt / Speedy
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted shrink-0" />
                  <p className="text-sm text-secondary">{t("bg1to2days")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted shrink-0" />
                  <p className="text-sm text-secondary">
                    <span className="font-mono font-medium text-navy">&euro;4.99</span>
                    <span className="text-muted mx-2">|</span>
                    {t("freeAboveLabel")}{" "}
                    <span className="font-mono font-medium text-teal-600">&euro;49</span>
                  </p>
                </div>
              </div>
            </div>

            {/* EU card */}
            <div className="rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-teal-600/10 p-2.5">
                  <Globe className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-navy">{t("eu")}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-muted shrink-0" />
                  <p className="text-sm text-secondary">{t("intlShipping")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted shrink-0" />
                  <p className="text-sm text-secondary">{t("eu3to7days")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted shrink-0" />
                  <p className="text-sm text-secondary">
                    <span className="font-mono font-medium text-navy">&euro;9.99</span>
                    <span className="text-muted mx-2">|</span>
                    {t("freeAboveLabel")}{" "}
                    <span className="font-mono font-medium text-teal-600">&euro;149</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <PlaceholderVisual
              variant="map"
              label={isBg ? "Карта на доставките в ЕС" : "EU delivery map"}
              className="aspect-[16/7]"
            />
          </div>
        </FadeIn>
      </section>

      {/* Packaging — 3 icon cards */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-14">
          <FadeIn>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
              {isBg ? "[DELIVERY/03] ОПАКОВКА" : "[DELIVERY/03] PACKAGING"}
            </p>
            <h2 className="font-display text-2xl font-bold text-navy mb-8 tracking-[-0.02em]">
              {t("packagingSectionTitle")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="bg-white rounded-2xl border border-border p-6">
                <Shield className="h-6 w-6 text-teal-600 mb-3" />
                <h3 className="font-semibold text-navy mb-2">
                  {t("packDiscreetTitle")}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t("packDiscreetDesc")}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-border p-6">
                <Thermometer className="h-6 w-6 text-teal-600 mb-3" />
                <h3 className="font-semibold text-navy mb-2">
                  {t("packThermalTitle")}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t("packThermalDesc")}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-border p-6">
                <ScanSearch className="h-6 w-6 text-teal-600 mb-3" />
                <h3 className="font-semibold text-navy mb-2">
                  {t("packTrackingTitle")}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t("packTrackingDesc")}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-[1280px] px-6 py-14">
        <FadeIn>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            {isBg ? "[DELIVERY/04] ПРОЦЕС" : "[DELIVERY/04] PROCESS"}
          </p>
          <h2 className="font-display text-2xl font-bold text-navy mb-4 tracking-[-0.02em]">
            {t("processTitle")}
          </h2>
          <p className="max-w-3xl text-sm text-secondary leading-relaxed">
            {t("processText")}
          </p>
        </FadeIn>
      </section>

      {/* Payment */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-14">
          <FadeIn>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
              {isBg ? "[DELIVERY/05] ПЛАЩАНЕ" : "[DELIVERY/05] PAYMENT"}
            </p>
            <h2 className="font-display text-2xl font-bold text-navy mb-8 tracking-[-0.02em]">
              {t("paymentTitle")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="bg-white border border-border rounded-2xl p-6">
                <CreditCard className="h-6 w-6 text-teal-600 mb-3" />
                <h3 className="font-semibold text-navy mb-2">
                  {t("cardTitle")}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t("cardDesc")}
                </p>
              </div>
              <div className="bg-white border border-border rounded-2xl p-6">
                <Banknote className="h-6 w-6 text-teal-600 mb-3" />
                <h3 className="font-semibold text-navy mb-2">
                  {t("codTitle")}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t("codDesc")}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[1280px] px-6 py-14">
        <FadeIn>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            {isBg ? "[DELIVERY/06] ЧЗВ" : "[DELIVERY/06] FAQ"}
          </p>
          <h2 className="font-display text-2xl font-bold text-navy mb-8 tracking-[-0.02em]">
            {t("faqTitle")}
          </h2>
          <div className="space-y-4 max-w-3xl">
            {[
              { q: t("faq1Q"), a: t("faq1A") },
              { q: t("faq2Q"), a: t("faq2A") },
              { q: t("faq3Q"), a: t("faq3A") },
              { q: t("faq4Q"), a: t("faq4A") },
            ].map((item, i) => (
              <details
                key={i}
                className="group border border-border rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-sm font-medium text-navy hover:bg-surface/50 transition-colors">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="h-4 w-4 text-teal-600 shrink-0" />
                    {item.q}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted group-open:rotate-180 transition-transform shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-4 pt-0">
                  <p className="text-sm text-secondary leading-relaxed pl-7">
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
