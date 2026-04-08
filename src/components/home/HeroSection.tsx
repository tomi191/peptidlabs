import { FlaskConical, FileCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="w-full px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 lg:grid-cols-5 lg:gap-12">
        {/* Left — text content */}
        <div className="lg:col-span-3">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent">
            {t("tag")}
          </p>
          <h1 className="whitespace-pre-line text-3xl font-bold leading-tight text-navy md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-lg text-base text-secondary">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
            >
              <FlaskConical size={16} />
              {t("browsePeptides")}
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-navy transition-colors hover:bg-surface"
            >
              <FileCheck size={16} />
              {t("viewCoa")}
            </Link>
          </div>
        </div>

        {/* Right — stats card */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-surface p-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="font-mono text-2xl font-bold text-navy">{t("statPeptides")}</p>
                <p className="mt-1 text-xs text-muted">{t("statPeptidesLabel")}</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-2xl font-bold text-navy">
                  {t("statPurity")}
                </p>
                <p className="mt-1 text-xs text-muted">{t("statPurityLabel")}</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-2xl font-bold text-navy">{t("statDelivery")}</p>
                <p className="mt-1 text-xs text-muted">{t("statDeliveryLabel")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
