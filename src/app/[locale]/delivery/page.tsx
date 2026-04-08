import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Package, CreditCard, Banknote } from "lucide-react";

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

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <h1 className="text-3xl font-bold text-navy mb-4">{t("title")}</h1>
        <p className="mb-10 max-w-3xl text-sm text-secondary leading-relaxed">
          {t("intro")}
        </p>

        {/* How delivery works */}
        <section className="mb-14">
          <h2 className="text-lg font-semibold text-navy mb-3">
            {t("processTitle")}
          </h2>
          <p className="max-w-3xl text-sm text-secondary leading-relaxed">
            {t("processText")}
          </p>
        </section>

        {/* Shipping */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-navy mb-6">
            {t("shippingTitle")}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-border text-sm">
              <thead>
                <tr className="bg-surface text-left">
                  <th className="px-4 py-3 border-b border-border font-medium text-navy">
                    {t("destination")}
                  </th>
                  <th className="px-4 py-3 border-b border-border font-medium text-navy">
                    {t("carrier")}
                  </th>
                  <th className="px-4 py-3 border-b border-border font-medium text-navy">
                    {t("deliveryTime")}
                  </th>
                  <th className="px-4 py-3 border-b border-border font-medium text-navy">
                    {t("cost")}
                  </th>
                  <th className="px-4 py-3 border-b border-border font-medium text-navy">
                    {t("freeAbove")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-secondary">
                    {t("bulgaria")}
                  </td>
                  <td className="px-4 py-3 text-secondary">Econt / Speedy</td>
                  <td className="px-4 py-3 text-secondary">
                    {t("bg1to2days")}
                  </td>
                  <td className="px-4 py-3 text-secondary font-mono">
                    &euro;4.99
                  </td>
                  <td className="px-4 py-3 text-secondary font-mono">
                    &euro;49
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-secondary">{t("eu")}</td>
                  <td className="px-4 py-3 text-secondary">
                    {t("intlShipping")}
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    {t("eu3to7days")}
                  </td>
                  <td className="px-4 py-3 text-secondary font-mono">
                    &euro;9.99
                  </td>
                  <td className="px-4 py-3 text-secondary font-mono">
                    &euro;149
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex items-start gap-3 border border-border rounded-lg p-4">
            <Package className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-navy text-sm">
                {t("packagingTitle")}
              </p>
              <p className="text-sm text-muted mt-1">{t("packagingDesc")}</p>
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-navy mb-6">
            {t("paymentTitle")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-border rounded-lg p-6">
              <CreditCard className="h-6 w-6 text-teal-600 mb-3" />
              <h3 className="font-semibold text-navy mb-2">
                {t("cardTitle")}
              </h3>
              <p className="text-sm text-muted">{t("cardDesc")}</p>
            </div>
            <div className="border border-border rounded-lg p-6">
              <Banknote className="h-6 w-6 text-teal-600 mb-3" />
              <h3 className="font-semibold text-navy mb-2">{t("codTitle")}</h3>
              <p className="text-sm text-muted">{t("codDesc")}</p>
            </div>
          </div>
        </section>

        {/* Tracking */}
        <section>
          <h2 className="text-lg font-semibold text-navy mb-3">
            {t("trackingTitle")}
          </h2>
          <p className="max-w-3xl text-sm text-secondary leading-relaxed">
            {t("trackingText")}
          </p>
        </section>
      </div>
    </main>
  );
}
