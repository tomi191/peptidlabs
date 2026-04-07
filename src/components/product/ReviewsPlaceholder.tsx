export function ReviewsPlaceholder({
  heading,
  noReviews,
  writeReview,
}: {
  heading: string;
  noReviews: string;
  writeReview: string;
}) {
  return (
    <section className="mt-16">
      <h2 className="text-lg font-bold text-navy">{heading}</h2>
      <div className="mt-6 rounded-lg border border-border p-8 text-center">
        <p className="text-sm text-secondary">{noReviews}</p>
        <button
          disabled
          className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-navy opacity-60"
        >
          {writeReview}
        </button>
      </div>
    </section>
  );
}
