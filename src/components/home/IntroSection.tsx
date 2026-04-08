import { useTranslations } from "next-intl";

export function IntroSection() {
  const t = useTranslations("intro");

  const stats = [
    { value: t("statPeptides"), label: t("statPeptidesLabel") },
    { value: t("statCategories"), label: t("statCategoriesLabel") },
    { value: t("statPurity"), label: t("statPurityLabel") },
  ];

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          {/* Text column — 60% */}
          <div className="lg:w-[60%]">
            <h2 className="text-lg font-semibold text-navy mb-6">
              {t("title")}
            </h2>
            <div className="max-w-3xl space-y-4">
              <p className="text-sm text-secondary leading-relaxed">{t("p1")}</p>
              <p className="text-sm text-secondary leading-relaxed">{t("p2")}</p>
              <p className="text-sm text-secondary leading-relaxed">{t("p3")}</p>
            </div>
          </div>

          {/* Stat cards column — 40% */}
          <div className="lg:w-[40%]">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border p-5 text-center lg:text-left"
                >
                  <p className="text-2xl font-bold text-navy font-mono">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
