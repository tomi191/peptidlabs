import { FlaskConical, FileCheck, Truck, Lock } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { TextWithAbbr } from "@/components/ui/TextWithAbbr";

export function TrustBar() {
  const t = useTranslations("trust");
  const locale = useLocale();

  const items = [
    { icon: FlaskConical, title: t("hplcTitle"), sub: t("hplcSub") },
    { icon: FileCheck, title: t("coaTitle"), sub: t("coaSub") },
    { icon: Truck, title: t("shippingTitle"), sub: t("shippingSub") },
    { icon: Lock, title: t("paymentTitle"), sub: t("paymentSub") },
  ];

  return (
    <section className="w-full border-y border-border bg-surface py-6">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center px-4 py-3 text-center"
          >
            <item.icon size={20} className="text-secondary" />
            <p className="mt-2 text-xs font-semibold text-navy">
              <TextWithAbbr text={item.title} locale={locale} />
            </p>
            <p className="mt-0.5 text-[11px] text-muted">
              <TextWithAbbr text={item.sub} locale={locale} />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
