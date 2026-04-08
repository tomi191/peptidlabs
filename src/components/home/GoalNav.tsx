import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const goals = [
  { titleKey: "weightTitle", subKey: "weightSub", href: "/shop/weight-loss" },
  { titleKey: "healingTitle", subKey: "healingSub", href: "/shop/healing" },
  { titleKey: "performanceTitle", subKey: "performanceSub", href: "/shop/gh-muscle" },
  { titleKey: "cognitiveTitle", subKey: "cognitiveSub", href: "/shop/nootropic" },
] as const;

export function GoalNav() {
  const t = useTranslations("goals");

  return (
    <section className="w-full px-6 py-12">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="mb-6 text-lg font-semibold text-navy">{t("title")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {goals.map((goal) => (
            <Link
              key={goal.titleKey}
              href={goal.href}
              className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-6 transition-colors hover:border-navy/20"
            >
              <div>
                <h3 className="text-base font-semibold text-navy">
                  {t(goal.titleKey)}
                </h3>
                <p className="mt-1 text-sm text-secondary">{t(goal.subKey)}</p>
              </div>
              <div className="mt-4 flex items-center text-accent">
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
