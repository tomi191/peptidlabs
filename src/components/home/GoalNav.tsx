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

  const [featured, ...rest] = goals;
  const FeaturedIcon = featured.icon;

  return (
    <section className="w-full px-6 py-16">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="mb-4 text-center text-2xl font-bold text-navy md:text-3xl">
          {t("title")}
        </h2>

        {/* Bento grid: featured card left, 3 stacked right */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Featured card — spans full height on left */}
          <Link
            href={featured.href}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-navy/20 md:row-span-3"
          >
            <div>
              <FeaturedIcon size={32} className="text-accent" strokeWidth={1.5} />
              <h3 className="mt-6 text-xl font-bold text-navy">
                {t(featured.titleKey)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary">
                {t(featured.descKey)}
              </p>
              <p className="mt-4 text-xs text-muted">
                <span className="font-semibold">{t("popularLabel")}</span>{" "}
                <span className="font-mono">{t(featured.popularKey)}</span>
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-accent">
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>

          {/* Right column — 3 smaller cards stacked */}
          {rest.map((goal) => {
            const Icon = goal.icon;
            return (
              <Link
                key={goal.titleKey}
                href={goal.href}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-navy/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                  <Icon size={20} className="text-accent" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-navy">
                    {t(goal.titleKey)}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-secondary">
                    {t(goal.descKey)}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    <span className="font-semibold">{t("popularLabel")}</span>{" "}
                    <span className="font-mono">{t(goal.popularKey)}</span>
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="mt-1 shrink-0 text-accent transition-transform group-hover:translate-x-1"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
