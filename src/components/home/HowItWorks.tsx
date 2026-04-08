import { Search, ShoppingBag, Package } from "lucide-react";
import { useTranslations } from "next-intl";

const steps = [
  { icon: Search, titleKey: "step1Title", descKey: "step1Desc" },
  { icon: ShoppingBag, titleKey: "step2Title", descKey: "step2Desc" },
  { icon: Package, titleKey: "step3Title", descKey: "step3Desc" },
] as const;

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section className="w-full px-6 py-16">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="mb-10 text-center text-2xl font-bold text-navy md:text-3xl">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.titleKey} className="relative flex flex-col items-center text-center">
                {/* Connecting dotted line between steps (desktop only) */}
                {idx < steps.length - 1 && (
                  <div className="pointer-events-none absolute left-[calc(50%+40px)] top-7 hidden w-[calc(100%-80px)] border-t-2 border-dashed border-border md:block" />
                )}

                {/* Icon container with number badge */}
                <div className="relative mb-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface">
                    <Icon size={24} className="text-navy" strokeWidth={1.5} />
                  </div>
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                </div>

                <h3 className="mb-2 text-base font-semibold text-navy">
                  {t(step.titleKey)}
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-secondary">
                  {t(step.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
