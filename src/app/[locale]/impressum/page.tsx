import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Mail, Phone, MapPin, FileText, Building2 } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { InfoTile } from "@/components/ui/InfoTile";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title =
    locale === "bg" ? "Информация за доставчика" : "Legal Notice (Impressum)";
  return {
    title,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://peptidlabs.eu/${locale}/impressum`,
      languages: {
        bg: "https://peptidlabs.eu/bg/impressum",
        en: "https://peptidlabs.eu/en/impressum",
      },
    },
  };
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isBg = locale === "bg";

  const company = {
    legalName: "PeptidLabs EOOD",
    tradeName: "PeptidLabs",
    registration: "BG000000000",
    vatId: "BG000000000",
    eori: "BG000000000",
    address: "ул. Примерна 1, 1000 София, България",
    email: "info@peptidlabs.eu",
    support: "support@peptidlabs.eu",
    privacy: "privacy@peptidlabs.eu",
    phone: "+359 000 000 000",
    responsiblePerson: "—",
  };

  return (
    <main className="flex-1 bg-white">
      <PageHero
        crumbs={[{ label: isBg ? "Импресум" : "Impressum" }]}
        title={isBg ? "Информация за доставчика" : "Legal Notice (Impressum)"}
        subtitle={
          isBg
            ? "Задължителна информация съгласно чл. 5 от ТМ Директива 2000/31/EО и § 5 TMG (Германия) за опериращите в ЕС онлайн магазини."
            : "Required disclosure under Directive 2000/31/EC (E-Commerce) and § 5 TMG (Germany) for EU-operating online shops."
        }
        locale={locale}
        aside={
          <div className="rounded-xl border border-border bg-surface px-4 py-2.5 font-mono text-[11px] text-muted">
            <p className="uppercase tracking-widest">Updated</p>
            <p className="mt-1 font-bold text-navy tabular">2026-04-17</p>
          </div>
        }
      />

      <div className="mx-auto max-w-[1280px] px-6 pb-16 space-y-12">
        {/* Placeholder banner */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 leading-relaxed">
          <strong>
            {isBg
              ? "Забележка: поставете реалните данни"
              : "Note: replace with real company data"}
          </strong>{" "}
          —{" "}
          {isBg
            ? "долните стойности са placeholder-и. Преди продуктовия launch заменете с актуалната информация от Търговския регистър."
            : "values below are placeholders. Replace with your Commercial Registry data before launch."}
        </div>

        <section>
          <h2 className="font-display text-2xl font-bold text-navy mb-6 tracking-[-0.02em]">
            {isBg ? "Данни за дружеството" : "Company details"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoTile
              icon={Building2}
              title={isBg ? "Юридическо наименование" : "Legal entity"}
              body={
                <>
                  <p className="font-mono text-navy font-semibold">
                    {company.legalName}
                  </p>
                  <p className="text-muted mt-1">
                    {isBg ? "Търговско име" : "Trade name"}: {company.tradeName}
                  </p>
                </>
              }
            />
            <InfoTile
              icon={FileText}
              title={isBg ? "Регистрационни номера" : "Registration numbers"}
              body={
                <div className="space-y-1 font-mono text-xs">
                  <p>
                    {isBg ? "ЕИК" : "Reg. No."}: {company.registration}
                  </p>
                  <p>VAT: {company.vatId}</p>
                  <p>EORI: {company.eori}</p>
                </div>
              }
            />
            <InfoTile
              icon={MapPin}
              title={isBg ? "Седалище" : "Registered address"}
              body={<p>{company.address}</p>}
            />
            <InfoTile
              icon={Mail}
              title={isBg ? "Отговорно лице" : "Responsible person"}
              body={
                <>
                  <p>{company.responsiblePerson}</p>
                  <p className="text-muted text-xs mt-1">
                    {isBg
                      ? "отговорен за съдържанието съгл. § 55 абз. 2 RStV / чл. 5 EC Directive"
                      : "responsible for content pursuant to § 55 Abs. 2 RStV / Art. 5 EC Directive"}
                  </p>
                </>
              }
            />
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-navy mb-6 tracking-[-0.02em]">
            {isBg ? "Връзка с нас" : "Contact channels"}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <InfoTile
              icon={Mail}
              title="Email"
              body={
                <div className="space-y-1">
                  <a
                    href={`mailto:${company.email}`}
                    className="block text-teal-600 font-mono hover:underline"
                  >
                    {company.email}
                  </a>
                  <a
                    href={`mailto:${company.support}`}
                    className="block text-teal-600 font-mono hover:underline"
                  >
                    {company.support}
                  </a>
                  <a
                    href={`mailto:${company.privacy}`}
                    className="block text-teal-600 font-mono hover:underline"
                  >
                    {company.privacy}
                  </a>
                </div>
              }
            />
            <InfoTile
              icon={Phone}
              title={isBg ? "Телефон / WhatsApp" : "Phone / WhatsApp"}
              body={<p className="font-mono text-navy">{company.phone}</p>}
            />
            <InfoTile
              icon={FileText}
              title={isBg ? "Онлайн решаване на спорове" : "Online Dispute Resolution"}
              body={
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 font-mono text-xs hover:underline break-all"
                >
                  ec.europa.eu/consumers/odr
                </a>
              }
            />
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-navy mb-6 tracking-[-0.02em]">
            {isBg ? "Съответствие с ЕС" : "EU compliance"}
          </h2>
          <div className="rounded-xl border border-border bg-surface p-6 text-sm text-secondary leading-relaxed space-y-3">
            <p>
              {isBg
                ? "Ние не предлагаме продуктите си за човешка употреба. Всички пептиди са биохимични реагенти за in vitro изследвания съгласно Регламент (EO) 1907/2006 (REACH) за вещества, използвани в научни изследвания и разработки."
                : "We do not offer our products for human consumption. All peptides are biochemical reagents for in vitro research under Regulation (EC) 1907/2006 (REACH) for substances used in scientific research and development."}
            </p>
            <p>
              {isBg
                ? "Данните Ви обработваме съгласно Регламент (EС) 2016/679 (GDPR). Подробности — "
                : "We process your data under Regulation (EU) 2016/679 (GDPR). Details — "}
              <Link href="/privacy" className="text-teal-600 hover:underline">
                {isBg ? "Политика за поверителност" : "Privacy Policy"}
              </Link>
              .
            </p>
            <p>
              {isBg
                ? "Потребителски права съгласно Директива 2011/83/EO (права на потребителите) — включително 14-дневен срок за отказ, освен за запечатани реагенти, разпечатани след доставка. Вижте "
                : "Consumer rights under Directive 2011/83/EU — including 14-day right of withdrawal, except for sealed reagents unsealed after delivery. See "}
              <Link href="/terms" className="text-teal-600 hover:underline">
                {isBg ? "Общи условия" : "Terms & Conditions"}
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-t border-border pt-8">
          <p className="text-xs text-muted italic leading-relaxed">
            {isBg
              ? "Всички продукти са предназначени единствено за научноизследователски цели in vitro. Не са лекарствени средства. Не са одобрени за консумация от хора или животни."
              : "All products are for in vitro research use only. Not medicinal products. Not approved for human or animal consumption."}
          </p>
        </section>
      </div>
    </main>
  );
}
