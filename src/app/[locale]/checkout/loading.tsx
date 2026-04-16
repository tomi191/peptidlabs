export default function CheckoutLoading() {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Heading */}
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-surface" />

        {/* Progress bar */}
        <div className="mb-8 flex items-center justify-center gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-6 animate-pulse rounded-full bg-surface" />
                <div className="h-4 w-20 animate-pulse rounded bg-surface" />
              </div>
              {i < 2 && <div className="h-px w-8 bg-border" />}
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Form */}
          <div className="w-full space-y-4 lg:w-3/5">
            <div className="rounded-lg border border-border p-6 space-y-4">
              <div className="h-5 w-40 animate-pulse rounded bg-surface" />
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-20 animate-pulse rounded bg-surface" />
                    <div className="h-10 w-full animate-pulse rounded bg-surface" />
                  </div>
                ))}
              </div>
              <div className="h-10 w-full animate-pulse rounded bg-surface" />
              <div className="h-10 w-full animate-pulse rounded bg-surface" />
            </div>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-2/5">
            <div className="rounded-lg border border-border p-6 space-y-4">
              <div className="h-5 w-32 animate-pulse rounded bg-surface" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-24 animate-pulse rounded bg-surface" />
                  <div className="h-4 w-16 animate-pulse rounded bg-surface" />
                </div>
              ))}
              <div className="mt-4 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-16 animate-pulse rounded bg-surface" />
                  <div className="h-5 w-20 animate-pulse rounded bg-surface" />
                </div>
              </div>
              <div className="h-11 w-full animate-pulse rounded-lg bg-surface" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
