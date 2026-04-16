export default function BlogLoading() {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        {/* Hero */}
        <div className="h-9 w-56 animate-pulse rounded bg-surface" />
        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-surface" />

        {/* Post cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-lg border border-border p-6"
            >
              <div className="mb-3 flex gap-1.5">
                <div className="h-4 w-12 animate-pulse rounded-full bg-surface" />
                <div className="h-4 w-16 animate-pulse rounded-full bg-surface" />
              </div>
              <div className="h-4 w-full animate-pulse rounded bg-surface" />
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-surface" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-surface" />
                <div className="h-3 w-full animate-pulse rounded bg-surface" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-surface" />
              </div>
              <div className="mt-auto flex items-center justify-between pt-4">
                <div className="h-3 w-20 animate-pulse rounded bg-surface" />
                <div className="h-3 w-16 animate-pulse rounded bg-surface" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
