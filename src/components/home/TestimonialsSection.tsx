"use client";

import Image from "next/image";
import { BadgeCheck, Quote } from "lucide-react";
import { useTranslations } from "next-intl";

const testimonials = [
  { quoteKey: "quote1", authorKey: "author1", avatarKey: "author1" },
  { quoteKey: "quote2", authorKey: "author2", avatarKey: "author2" },
  { quoteKey: "quote3", authorKey: "author3", avatarKey: "author3" },
] as const;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

function avatarUrl(key: string): string | null {
  if (!SUPABASE_URL) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/testimonials/${key}.png`;
}

export function TestimonialsSection() {
  const t = useTranslations("testimonials");

  // Triple the items so the marquee feels dense and seamless
  const items = [...testimonials, ...testimonials];

  function Card({ quoteKey, authorKey, avatarKey, ariaHidden }: {
    quoteKey: string;
    authorKey: string;
    avatarKey: string;
    ariaHidden?: boolean;
  }) {
    const avatar = avatarUrl(avatarKey);
    return (
      <article
        aria-hidden={ariaHidden}
        className="flex w-[360px] shrink-0 flex-col justify-between rounded-2xl bg-white border border-border p-6 shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08)]"
      >
        <div>
          <Quote size={22} className="mb-3 text-accent/30" strokeWidth={1.5} />
          <p className="text-sm leading-relaxed text-secondary">
            &ldquo;{t(quoteKey)}&rdquo;
          </p>
        </div>
        <div className="mt-5 flex items-center gap-3">
          {avatar ? (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface ring-1 ring-border">
              <Image
                src={avatar}
                alt={t(authorKey)}
                fill
                sizes="40px"
                quality={90}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-10 w-10 shrink-0 rounded-full bg-surface ring-1 ring-border" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-navy truncate">
              {t(authorKey)}
            </p>
            <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-accent">
              <BadgeCheck size={11} strokeWidth={2} />
              {t("verified")}
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <section className="w-full px-0 py-16 overflow-hidden">
      <div className="px-6">
        <h2 className="mb-10 text-center text-2xl font-bold text-navy md:text-3xl">
          {t("title")}
        </h2>
      </div>

      <div
        className="category-marquee-pause relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
        }}
      >
        <div className="category-marquee-track flex w-max">
          <div className="flex shrink-0 gap-4 pr-4">
            {items.map((it, i) => (
              <Card key={`a-${i}`} {...it} />
            ))}
          </div>
          <div className="flex shrink-0 gap-4 pr-4" aria-hidden="true">
            {items.map((it, i) => (
              <Card key={`b-${i}`} {...it} ariaHidden />
            ))}
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted px-6">
        {t("trustNote")}
      </p>
    </section>
  );
}
