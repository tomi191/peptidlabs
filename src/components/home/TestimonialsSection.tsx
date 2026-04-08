import { BadgeCheck, Quote } from "lucide-react";
import { useTranslations } from "next-intl";

const testimonials = [
  { quoteKey: "quote1", authorKey: "author1" },
  { quoteKey: "quote2", authorKey: "author2" },
  { quoteKey: "quote3", authorKey: "author3" },
] as const;

export function TestimonialsSection() {
  const t = useTranslations("testimonials");

  const [featured, ...rest] = testimonials;

  return (
    <section className="w-full px-6 py-16">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="mb-10 text-center text-2xl font-bold text-navy md:text-3xl">
          {t("title")}
        </h2>

        {/* Staggered grid: large featured + 2 smaller stacked */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {/* Featured testimonial — larger */}
          <div className="flex flex-col justify-between rounded-2xl bg-surface p-8 md:col-span-3">
            <div>
              <Quote size={24} className="mb-4 text-accent/30" strokeWidth={1.5} />
              <p className="text-base leading-relaxed text-secondary">
                &ldquo;{t(featured.quoteKey)}&rdquo;
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <p className="text-sm font-semibold text-navy">
                {t(featured.authorKey)}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-accent">
                <BadgeCheck size={12} strokeWidth={2} />
                {t("verified")}
              </span>
            </div>
          </div>

          {/* Smaller testimonials stacked on right */}
          <div className="flex flex-col gap-4 md:col-span-2">
            {rest.map((item) => (
              <div
                key={item.authorKey}
                className="flex flex-1 flex-col justify-between rounded-2xl bg-surface p-6"
              >
                <p className="text-sm italic leading-relaxed text-secondary">
                  &ldquo;{t(item.quoteKey)}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-2">
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
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          {t("trustNote")}
        </p>
      </div>
    </section>
  );
}
