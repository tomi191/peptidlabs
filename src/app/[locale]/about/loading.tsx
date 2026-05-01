export default function AboutLoading() {
  return (
    <main className="w-full">
      <div className="mx-auto max-w-[1280px] px-6 pt-10 pb-8">
        <div className="h-3 w-32 mb-6 animate-pulse rounded bg-surface" />
        <div className="space-y-3 max-w-2xl">
          <div className="h-9 w-72 animate-pulse rounded bg-surface" />
          <div className="h-4 w-full animate-pulse rounded bg-surface" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-surface" />
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 pb-16 space-y-16">
        {Array.from({ length: 4 }).map((_, i) => (
          <section key={i}>
            <div className="h-7 w-64 mb-6 animate-pulse rounded bg-surface" />
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-4 w-full animate-pulse rounded bg-surface"
                  />
                ))}
              </div>
              <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-surface" />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
