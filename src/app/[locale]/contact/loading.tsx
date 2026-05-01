export default function ContactLoading() {
  return (
    <main className="w-full">
      <div className="mx-auto max-w-[1280px] px-6 pt-10 pb-8">
        <div className="h-3 w-32 mb-6 animate-pulse rounded bg-surface" />
        <div className="space-y-3 max-w-2xl">
          <div className="h-9 w-64 animate-pulse rounded bg-surface" />
          <div className="h-4 w-full animate-pulse rounded bg-surface" />
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 pb-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* Form skeleton */}
          <div className="rounded-2xl border border-border bg-white p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-surface" />
                <div className="h-10 w-full animate-pulse rounded bg-surface" />
              </div>
            ))}
            <div className="h-12 w-32 animate-pulse rounded bg-surface" />
          </div>
          {/* Side info */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-white p-6 space-y-2"
              >
                <div className="h-4 w-24 animate-pulse rounded bg-surface" />
                <div className="h-4 w-full animate-pulse rounded bg-surface" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
