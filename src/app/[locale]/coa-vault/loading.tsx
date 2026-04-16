export default function CoaVaultLoading() {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        {/* Hero */}
        <div className="mb-2 flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded bg-surface" />
          <div className="h-9 w-64 animate-pulse rounded bg-surface" />
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-4 w-full max-w-3xl animate-pulse rounded bg-surface" />
          <div className="h-4 w-5/6 max-w-3xl animate-pulse rounded bg-surface" />
        </div>

        {/* 6 product row placeholders */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-lg border border-border p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-surface" />
                  <div className="h-3 w-20 animate-pulse rounded bg-surface" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-3 w-12 animate-pulse rounded bg-surface" />
                <div className="h-4 w-12 animate-pulse rounded bg-surface" />
              </div>
              <div className="mt-auto flex items-center justify-between pt-4">
                <div className="h-6 w-24 animate-pulse rounded-full bg-surface" />
                <div className="h-4 w-20 animate-pulse rounded bg-surface" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
