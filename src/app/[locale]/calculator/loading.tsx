export default function CalculatorLoading() {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[800px] px-6 py-12">
        {/* Hero */}
        <div className="h-9 w-56 animate-pulse rounded bg-surface" />
        <div className="mt-3 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-surface" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-surface" />
        </div>

        {/* 4 step blocks */}
        <div className="mt-10 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 animate-pulse rounded-full bg-surface" />
                <div className="h-4 w-32 animate-pulse rounded bg-surface" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="h-10 w-full animate-pulse rounded bg-surface" />
                <div className="h-10 w-full animate-pulse rounded bg-surface" />
              </div>
            </div>
          ))}
        </div>

        {/* Result card */}
        <div className="mt-6 rounded-xl border border-border bg-surface p-6 space-y-4">
          <div className="h-5 w-36 animate-pulse rounded bg-border/50" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-16 w-full animate-pulse rounded bg-border/50" />
            <div className="h-16 w-full animate-pulse rounded bg-border/50" />
          </div>
          <div className="h-3 w-full animate-pulse rounded bg-border/50" />
        </div>
      </div>
    </main>
  );
}
