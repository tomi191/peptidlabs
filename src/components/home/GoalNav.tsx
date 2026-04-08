import { ArrowRight, Scale, Activity, Dumbbell, Brain } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Goal = {
  titleKey: string;
  descKey: string;
  popularKey: string;
  href: string;
  icon: LucideIcon;
};

const goals: Goal[] = [
  {
    titleKey: "weightTitle",
    descKey: "weightDesc",
    popularKey: "weightPopular",
    href: "/shop/weight-loss",
    icon: Scale,
  },
  {
    titleKey: "healingTitle",
    descKey: "healingDesc",
    popularKey: "healingPopular",
    href: "/shop/healing",
    icon: Activity,
  },
  {
    titleKey: "performanceTitle",
    descKey: "performanceDesc",
    popularKey: "performancePopular",
    href: "/shop/gh-muscle",
    icon: Dumbbell,
  },
  {
    titleKey: "cognitiveTitle",
    descKey: "cognitiveDesc",
    popularKey: "cognitivePopular",
    href: "/shop/nootropic",
    icon: Brain,
  },
];

export function GoalNav() {
  const t = useTranslations("goals");

  return (
    <section className="w-full px-6 py-16">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="mb-4 text-center text-2xl font-bold text-navy md:text-3xl">
          {t("title")}
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {goals.map((goal) => {
            const Icon = goal.icon;
            return (
              <Link
                key={goal.titleKey}
                href={goal.href}
                className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-8 transition-colors hover:border-navy/20"
              >
                <div>
                  <Icon size={24} className="text-accent" strokeWidth={1.5} />
                  <h3 className="mt-4 text-base font-semibold text-navy">
                    {t(goal.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">
                    {t(goal.descKey)}
                  </p>
                  <p className="mt-3 text-xs text-muted">
                    <span className="font-semibold">{t("popularLabel")}</span>{" "}
                    <span className="font-mono">{t(goal.popularKey)}</span>
                  </p>
                </div>
                <div className="mt-5 flex items-center text-accent">
                  <ArrowRight
                    size={16}
                    strokeWidth={1.5}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
