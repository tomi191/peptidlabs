import { Globe, FlaskConical, Clock, FileCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export function SocialProofBar() {
  const t = useTranslations("socialProof");

  const items = [
    { icon: Globe, value: t("euBasedValue"), label: t("euBasedLabel") },
    { icon: FlaskConical, value: t("purityValue"), label: t("purityLabel") },
    { icon: Clock, value: t("shippingValue"), label: t("shippingLabel") },
    { icon: FileCheck, value: t("coaValue"), label: t("coaLabel") },
  ];

  return (
    <section className="w-full bg-surface border-y border-border py-6">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center px-4 py-3 text-center"
          >
            <item.icon size={20} className="text-secondary" />
            <p className="mt-2 text-xl font-bold text-navy">{item.value}</p>
            <p className="mt-0.5 text-xs text-muted">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
