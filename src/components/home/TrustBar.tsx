"use client";

import { FlaskConical, FileCheck, Truck, Lock, ShieldCheck, Microscope } from "lucide-react";
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
    // Two extra to enrich the marquee — reuse copy keys that exist
    { icon: ShieldCheck, title: t("hplcTitle"), sub: t("hplcSub") },
    { icon: Microscope, title: t("coaTitle"), sub: t("coaSub") },
  ];

  function Pill({ Icon, title, sub }: { Icon: typeof FlaskConical; title: string; sub: string }) {
    return (
      <div className="flex shrink-0 items-center gap-3 rounded-full border border-border bg-white px-5 py-2.5">
        <Icon size={18} className="shrink-0 text-accent" strokeWidth={1.75} />
        <div className="min-w-0">
          <p className="whitespace-nowrap text-xs font-semibold text-navy">
            <TextWithAbbr text={title} locale={locale} />
          </p>
          <p className="whitespace-nowrap text-[10px] text-muted">
            <TextWithAbbr text={sub} locale={locale} />
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      className="category-marquee-pause w-full border-y border-border bg-surface py-5 overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0, #000 5%, #000 95%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, #000 5%, #000 95%, transparent 100%)",
      }}
      aria-label={locale === "bg" ? "Гаранции за качество" : "Quality guarantees"}
    >
      <div className="category-marquee-track flex w-max">
        <div className="flex shrink-0 gap-3 pr-3">
          {items.map((item, i) => (
            <Pill key={`a-${i}`} Icon={item.icon} title={item.title} sub={item.sub} />
          ))}
        </div>
        <div className="flex shrink-0 gap-3 pr-3" aria-hidden="true">
          {items.map((item, i) => (
            <Pill key={`b-${i}`} Icon={item.icon} title={item.title} sub={item.sub} />
          ))}
        </div>
      </div>
    </section>
  );
}
