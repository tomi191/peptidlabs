import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Mail, MessageCircle, Clock } from "lucide-react";
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
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <h1 className="text-3xl font-bold text-navy mb-4">{t("title")}</h1>
        <p className="mb-10 max-w-3xl text-sm text-secondary leading-relaxed">
          {t("intro")}
        </p>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
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
            <div className="flex items-start gap-4">
              <MessageCircle className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-navy text-sm">WhatsApp</p>
                <p className="text-sm text-muted">{t("whatsappNote")}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-navy text-sm">
                  {t("hoursLabel")}
                </p>
                <p className="text-sm text-muted">{t("hoursValue")}</p>
              </div>
            </div>

            {/* When to contact */}
            <div className="mt-8 pt-6 border-t border-border">
              <h2 className="text-lg font-semibold text-navy mb-3">
                {t("whenToContact")}
              </h2>
              <p className="text-sm text-secondary leading-relaxed">
                {t("whenToContactText")}
              </p>
            </div>
          </div>

          {/* Contact form */}
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
