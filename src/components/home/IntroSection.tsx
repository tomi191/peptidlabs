import { FlaskConical, ShieldCheck, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

export function IntroSection() {
  const t = useTranslations("intro");

  const stats = [
    { value: t("statPeptides"), label: t("statPeptidesLabel") },
    { value: t("statCategories"), label: t("statCategoriesLabel") },
    { value: t("statPurity"), label: t("statPurityLabel") },
  ];

  const features = [
    { icon: FlaskConical, label: t("statPeptidesLabel") },
    { icon: ShieldCheck, label: t("statPurityLabel") },
    { icon: Truck, label: t("statCategoriesLabel") },
  ];

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          {/* Text column — 55% */}
          <div className="lg:w-[55%]">
            <h2 className="text-lg font-semibold text-navy mb-6">
              {t("title")}
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-secondary leading-relaxed">{t("p1")}</p>
              <p className="text-sm text-secondary leading-relaxed">{t("p2")}</p>
              <p className="text-sm text-secondary leading-relaxed">{t("p3")}</p>
            </div>

            {/* Inline feature icons */}
            <div className="mt-8 flex flex-wrap gap-4">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="flex items-center gap-2 text-sm text-secondary">
                    <Icon size={16} className="text-accent" strokeWidth={1.5} />
                    <span>{f.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stat cards column — 45% */}
          <div className="lg:w-[45%]">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="grid gap-0 divide-y divide-border">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between py-5 first:pt-0 last:pb-0"
                  >
                    <p className="text-sm text-secondary">{stat.label}</p>
                    <p className="text-2xl font-bold text-navy font-mono">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
