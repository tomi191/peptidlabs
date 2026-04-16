export default function OrderDetailLoading() {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Back link */}
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-surface" />

        {/* Title row */}
        <div className="mb-8 flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-surface" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-surface" />
        </div>

        {/* Timeline */}
        <div className="mb-8 rounded-lg border border-border p-6">
          <div className="mb-4 h-5 w-28 animate-pulse rounded bg-surface" />
          <div className="flex items-center justify-between">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 animate-pulse rounded-full bg-surface" />
                <div className="h-3 w-16 animate-pulse rounded bg-surface" />
                {i < 3 && (
                  <div className="absolute h-px w-16 translate-x-12 translate-y-5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order info card */}
        <div className="mb-8 rounded-lg border border-border p-6">
          <div className="mb-4 h-5 w-36 animate-pulse rounded bg-surface" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-20 animate-pulse rounded bg-surface" />
                <div className="h-4 w-32 animate-pulse rounded bg-surface" />
              </div>
            ))}
          </div>
        </div>

        {/* Items table */}
        <div className="rounded-lg border border-border p-6">
          <div className="mb-4 h-5 w-28 animate-pulse rounded bg-surface" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-border pb-3 last:border-0"
              >
                <div className="h-12 w-12 animate-pulse rounded bg-surface" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 animate-pulse rounded bg-surface" />
                  <div className="h-3 w-20 animate-pulse rounded bg-surface" />
                </div>
                <div className="h-4 w-16 animate-pulse rounded bg-surface" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
