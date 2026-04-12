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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <main className="flex-1 bg-white">
      {/* Hero */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-12 md:py-16">
          <FadeIn>
            <h1 className="text-3xl md:text-4xl font-bold text-navy">
              {t("title")}
            </h1>
            <p className="mt-4 max-w-2xl text-secondary leading-relaxed">
              {t("intro")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2-column: info + form */}
      <section className="mx-auto max-w-[1280px] px-6 py-14">
        <FadeIn>
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left — contact info cards */}
            <div className="space-y-5">
              <div className="border border-border rounded-2xl p-5 flex items-start gap-4">
                <div className="rounded-xl bg-teal-600/10 p-2.5 shrink-0">
                  <Mail className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-navy text-sm">
                    {t("emailLabel")}
                  </p>
                  <a
                    href="mailto:info@peptidelab.bg"
                    className="text-sm text-teal-600 hover:underline"
                  >
                    info@peptidelab.bg
                  </a>
                </div>
              </div>

              <div className="border border-border rounded-2xl p-5 flex items-start gap-4">
                <div className="rounded-xl bg-teal-600/10 p-2.5 shrink-0">
                  <MessageCircle className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-navy text-sm">WhatsApp</p>
                  <p className="text-sm text-muted">{t("whatsappNote")}</p>
                </div>
              </div>

              <div className="border border-border rounded-2xl p-5 flex items-start gap-4">
                <div className="rounded-xl bg-teal-600/10 p-2.5 shrink-0">
                  <Clock className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-navy text-sm">
                    {t("hoursLabel")}
                  </p>
                  <p className="text-sm text-muted">{t("hoursValue")}</p>
                </div>
              </div>

              {/* Location card */}
              <div className="border border-border rounded-2xl p-5 flex items-start gap-4">
                <div className="rounded-xl bg-teal-600/10 p-2.5 shrink-0">
                  <MapPin className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-navy text-sm">
                    {t("locationLabel")}
                  </p>
                  <p className="text-sm text-muted">{t("locationValue")}</p>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="border border-border rounded-2xl p-6 lg:p-8">
              <h2 className="text-lg font-semibold text-navy mb-5">
                {t("formTitle")}
              </h2>
              <ContactForm />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* When to contact */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-14">
          <FadeIn>
            <h2 className="text-xl font-semibold text-navy mb-8">
              {t("whenToContact")}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-2xl border border-border p-5 flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
                <p className="text-sm text-secondary leading-relaxed">
                  {t("whenReason1")}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-border p-5 flex items-start gap-3">
                <Package className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
                <p className="text-sm text-secondary leading-relaxed">
                  {t("whenReason2")}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-border p-5 flex items-start gap-3">
                <FileCheck className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
                <p className="text-sm text-secondary leading-relaxed">
                  {t("whenReason3")}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-border p-5 flex items-start gap-3">
                <FlaskConical className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
                <p className="text-sm text-secondary leading-relaxed">
                  {t("whenReason4")}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
