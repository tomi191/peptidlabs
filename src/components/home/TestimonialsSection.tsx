import { BadgeCheck } from "lucide-react";
import { useTranslations } from "next-intl";

const testimonials = [
  { quoteKey: "quote1", authorKey: "author1" },
  { quoteKey: "quote2", authorKey: "author2" },
  { quoteKey: "quote3", authorKey: "author3" },
] as const;

export function TestimonialsSection() {
  const t = useTranslations("testimonials");

  return (
    <section className="w-full px-6 py-16">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="mb-10 text-center text-2xl font-bold text-navy md:text-3xl">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.authorKey}
              className="flex flex-col justify-between rounded-xl bg-surface p-6"
            >
              <p className="text-sm italic leading-relaxed text-secondary">
                &ldquo;{t(item.quoteKey)}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-2">
                <p className="text-sm font-semibold text-navy">
                  {t(item.authorKey)}
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-accent">
                  <BadgeCheck size={12} strokeWidth={2} />
                  {t("verified")}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          {t("trustNote")}
        </p>
      </div>
    </section>
  );
}
