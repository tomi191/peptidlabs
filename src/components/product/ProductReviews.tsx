import { getTranslations } from "next-intl/server";
import { Star, ShieldCheck } from "lucide-react";
import { getProductReviews } from "@/lib/queries";
import type { Review, ReviewAggregate } from "@/lib/types";
import { ReviewForm } from "./ReviewForm";

type Props = {
  productId: string;
  locale: string;
};

export async function ProductReviews({ productId, locale }: Props) {
  const [{ reviews, aggregate }, t] = await Promise.all([
    getProductReviews(productId),
    getTranslations("reviews"),
  ]);

  const isBg = locale === "bg";
  const bcp47 = isBg ? "bg-BG" : "en-US";

  return (
    <section aria-labelledby="product-reviews-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="product-reviews-heading"
            className="font-display text-2xl font-bold text-navy tracking-[-0.02em]"
          >
            {t("title")}
          </h2>
        </div>

        {aggregate.count > 0 && (
          <ReviewAggregateBlock
            aggregate={aggregate}
            labelAverage={t("aggregate")}
            reviewsWord={t("reviewsCountUnit")}
          />
        )}
      </div>

      {/* List + form */}
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface/60 p-8 text-center">
              <Star size={28} className="mx-auto text-muted" />
              <p className="mt-3 text-sm text-secondary">{t("noReviews")}</p>
            </div>
          ) : (
            <ul className="divide-y divide-border rounded-xl border border-border bg-white">
              {reviews.map((r) => (
                <li key={r.id} className="px-5 py-5">
                  <ReviewItem
                    review={r}
                    bcp47={bcp47}
                    verifiedLabel={t("verifiedBadge")}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="sticky top-24 rounded-xl border border-border bg-white p-6">
            <h3 className="font-display text-lg font-bold text-navy">
              {t("writeReview")}
            </h3>
            <p className="mt-1 text-xs text-muted">{t("formIntro")}</p>
            <div className="mt-4">
              <ReviewForm productId={productId} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewAggregateBlock({
  aggregate,
  labelAverage,
  reviewsWord,
}: {
  aggregate: ReviewAggregate;
  labelAverage: string;
  reviewsWord: string;
}) {
  const filled = Math.round(aggregate.average);
  return (
    <div className="rounded-xl border border-border bg-surface px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={16}
              className={
                i <= filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-border"
              }
            />
          ))}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-lg font-bold text-navy tabular-nums">
            {aggregate.average.toFixed(1)}
          </span>
          <span className="text-xs text-muted">/ 5</span>
        </div>
        <span className="h-4 w-px bg-border" />
        <span className="text-xs text-secondary">
          {aggregate.count} {reviewsWord}
        </span>
      </div>
      <p className="sr-only">{labelAverage}</p>
    </div>
  );
}

function ReviewItem({
  review,
  bcp47,
  verifiedLabel,
}: {
  review: Review;
  bcp47: string;
  verifiedLabel: string;
}) {
  const date = new Date(review.created_at).toLocaleDateString(bcp47, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-0.5" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={14}
              className={
                i <= review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-border"
              }
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-navy">
          {review.author_name}
        </span>
        {review.verified_purchase && (
          <span className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
            <ShieldCheck size={12} aria-hidden="true" />
            {verifiedLabel}
          </span>
        )}
        <span className="ml-auto font-mono text-[11px] uppercase tracking-wider text-muted">
          {date}
        </span>
      </div>

      {review.title && (
        <h3 className="mt-2 text-sm font-bold text-navy">{review.title}</h3>
      )}
      <p className="mt-1 text-sm leading-relaxed text-secondary whitespace-pre-line">
        {review.text}
      </p>
    </article>
  );
}
