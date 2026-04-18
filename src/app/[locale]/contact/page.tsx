import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  Mail,
  MessageCircle,
  Clock,
  HelpCircle,
  Package,
  FileCheck,
  FlaskConical,
  MapPin,
} from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { ContactForm } from "./ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { PlaceholderVisual } from "@/components/ui/PlaceholderVisual";
import { InfoTile } from "@/components/ui/InfoTile";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    alternates: {
      canonical: `https://peptidlabs.eu/${locale}/contact`,
      languages: {
        bg: "https://peptidlabs.eu/bg/contact",
        en: "https://peptidlabs.eu/en/contact",
      },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const isBg = locale === "bg";

  return (
    <main className="flex-1 bg-white">
      <PageHero
        crumbs={[{ label: t("title") }]}
        marker={isBg ? "[CONTACT/01] ВРЪЗКА" : "[CONTACT/01] REACH OUT"}
        title={t("title")}
        subtitle={t("intro")}
        locale={locale}
        aside={
          <div className="rounded-xl border border-teal-200 bg-teal-50/50 px-5 py-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-teal-700">
              {isBg ? "Отговаряме в" : "We reply within"}
            </p>
            <p className="font-mono text-lg font-bold text-teal-700 mt-0.5 tabular">
              &lt; 24h
            </p>
          </div>
        }
      />

      <div className="mx-auto max-w-[1280px] px-6 pb-16">
        {/* ─── [CONTACT/02] CHANNELS + FORM ─── */}
        <section className="mb-16">
          <FadeIn>
            <div className="grid gap-10 lg:grid-cols-2">
              {/* Left — contact info cards */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
                  {isBg ? "[CONTACT/02] КАНАЛИ" : "[CONTACT/02] CHANNELS"}
                </p>
                <h2 className="font-display text-2xl font-bold text-navy mb-6 tracking-[-0.02em]">
                  {isBg ? "Как да се свържете" : "How to reach us"}
                </h2>
                <div className="space-y-3">
                  <div className="border border-border rounded-xl p-5 flex items-start gap-4 hover:border-navy/30 transition-colors">
                    <div className="rounded-lg bg-teal-600/10 p-2.5 shrink-0">
                      <Mail className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy text-sm">
                        {t("emailLabel")}
                      </p>
                      <a
                        href="mailto:info@peptidlabs.eu"
                        className="text-sm text-teal-600 hover:underline font-mono"
                      >
                        info@peptidlabs.eu
                      </a>
                    </div>
                  </div>

                  <div className="border border-border rounded-xl p-5 flex items-start gap-4 hover:border-navy/30 transition-colors">
                    <div className="rounded-lg bg-teal-600/10 p-2.5 shrink-0">
                      <MessageCircle className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy text-sm">WhatsApp</p>
                      <p className="text-sm text-muted">{t("whatsappNote")}</p>
                    </div>
                  </div>

                  <div className="border border-border rounded-xl p-5 flex items-start gap-4 hover:border-navy/30 transition-colors">
                    <div className="rounded-lg bg-teal-600/10 p-2.5 shrink-0">
                      <Clock className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy text-sm">
                        {t("hoursLabel")}
                      </p>
                      <p className="text-sm text-muted">{t("hoursValue")}</p>
                    </div>
                  </div>

                  <div className="border border-border rounded-xl p-5 flex items-start gap-4 hover:border-navy/30 transition-colors">
                    <div className="rounded-lg bg-teal-600/10 p-2.5 shrink-0">
                      <MapPin className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy text-sm">
                        {t("locationLabel")}
                      </p>
                      <p className="text-sm text-muted">{t("locationValue")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — form */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
                  {isBg ? "[CONTACT/03] ФОРМА" : "[CONTACT/03] FORM"}
                </p>
                <div className="border border-border rounded-xl p-6 lg:p-8">
                  <h2 className="text-lg font-semibold text-navy mb-5">
                    {t("formTitle")}
                  </h2>
                  <ContactForm />
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ─── [CONTACT/04] WHEN ─── */}
        <section className="mb-16">
          <FadeIn>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
              {isBg ? "[CONTACT/04] КАТЕГОРИИ" : "[CONTACT/04] CATEGORIES"}
            </p>
            <h2 className="font-display text-2xl font-bold text-navy mb-8 tracking-[-0.02em]">
              {t("whenToContact")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <InfoTile
                icon={HelpCircle}
                index="01"
                title={isBg ? "Общ въпрос" : "General"}
                body={<>{t("whenReason1")}</>}
              />
              <InfoTile
                icon={Package}
                index="02"
                title={isBg ? "Поръчка" : "Order"}
                body={<>{t("whenReason2")}</>}
              />
              <InfoTile
                icon={FileCheck}
                index="03"
                title="COA"
                body={<>{t("whenReason3")}</>}
              />
              <InfoTile
                icon={FlaskConical}
                index="04"
                title={isBg ? "Наука" : "Science"}
                body={<>{t("whenReason4")}</>}
              />
            </div>
          </FadeIn>
        </section>

        {/* ─── [CONTACT/05] LOCATION ─── */}
        <section>
          <FadeIn>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
              {isBg ? "[CONTACT/05] ЛОКАЦИЯ" : "[CONTACT/05] LOCATION"}
            </p>
            <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
              <div>
                <h2 className="font-display text-2xl font-bold text-navy mb-4 tracking-[-0.02em]">
                  {isBg ? "EU склад & доставка" : "EU warehouse & shipping"}
                </h2>
                <p className="text-secondary leading-relaxed">
                  {isBg
                    ? "Изпращаме от EU-базиран склад с Еконт и Спиди за България (1-2 работни дни) и международни куриери за останалите страни в ЕС (3-7 работни дни). Не приемаме самовземане."
                    : "We ship from an EU-based warehouse with Econt and Speedy for Bulgaria (1-2 business days) and international couriers for the rest of the EU (3-7 business days). We do not offer pickup."}
                </p>
              </div>
              <PlaceholderVisual
                variant="map"
                label={isBg ? "Карта на доставките" : "Shipping map"}
                className="aspect-[4/3]"
              />
            </div>
          </FadeIn>
        </section>
      </div>
    </main>
  );
}
