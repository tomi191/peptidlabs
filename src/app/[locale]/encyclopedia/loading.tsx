export default function EncyclopediaLoading() {
  return (
    <main className="flex-1 bg-white">
      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-6 py-12 md:py-16">
          <div className="mb-4 flex items-start gap-4">
            <div className="h-12 w-12 animate-pulse rounded-xl bg-border/50" />
            <div className="flex-1 space-y-3">
              <div className="h-9 w-56 animate-pulse rounded bg-border/50" />
              <div className="h-4 w-96 max-w-full animate-pulse rounded bg-border/50" />
            </div>
          </div>
          <div className="mt-4 h-3 w-full max-w-3xl animate-pulse rounded bg-border/50" />
        </div>
      </section>

      {/* Search + grid */}
      <section className="mx-auto max-w-[1280px] px-6 py-12">
        {/* Search input */}
        <div className="mb-8 h-11 w-full max-w-md animate-pulse rounded-lg bg-surface" />

        {/* 9 peptide cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border p-5 space-y-3"
            >
              <div className="h-5 w-28 animate-pulse rounded bg-surface" />
              <div className="h-3 w-full animate-pulse rounded bg-surface" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-surface" />
              <div className="flex gap-1.5 pt-2">
                <div className="h-5 w-14 animate-pulse rounded-full bg-surface" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-surface" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
