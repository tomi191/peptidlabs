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

        {/* Mobile: vertical timeline | Desktop: horizontal timeline */}
        <div className="relative mx-auto max-w-3xl">
          {/* Vertical connecting line (mobile) */}
          <div className="absolute bottom-0 left-5 top-0 w-px bg-border md:hidden" />
          {/* Horizontal connecting line (desktop) */}
          <div className="pointer-events-none absolute left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] top-7 hidden border-t-2 border-dashed border-border md:block" />

          <div className="flex flex-col gap-8 md:flex-row md:gap-0 md:justify-between">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.titleKey}
                  className="relative flex items-start gap-5 pl-2 md:flex-col md:items-center md:gap-0 md:pl-0 md:text-center"
                >
                  {/* Number + Icon */}
                  <div className="relative z-10 mb-0 shrink-0 md:mb-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-border">
                      <Icon size={24} className="text-navy" strokeWidth={1.5} />
                    </div>
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="pt-1 md:pt-0">
                    <h3 className="mb-1 text-base font-semibold text-navy">
                      {t(step.titleKey)}
                    </h3>
                    <p className="max-w-xs text-sm leading-relaxed text-secondary">
                      {t(step.descKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
