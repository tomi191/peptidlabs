export default function HomeLoading() {
  return (
    <div className="w-full">
      {/* Hero skeleton */}
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="h-5 w-40 animate-pulse rounded bg-surface" />
          <div className="mt-4 h-10 w-80 animate-pulse rounded bg-surface" />
          <div className="mt-2 h-10 w-64 animate-pulse rounded bg-surface" />
          <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-surface" />
          <div className="mt-6 flex gap-3">
            <div className="h-11 w-36 animate-pulse rounded-lg bg-surface" />
            <div className="h-11 w-36 animate-pulse rounded-lg bg-surface" />
          </div>
        </div>
      </div>

      {/* Social proof skeleton */}
      <div className="border-y border-border bg-surface py-4">
        <div className="mx-auto flex max-w-[1280px] justify-around px-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-6 w-12 animate-pulse rounded bg-white" />
              <div className="h-3 w-24 animate-pulse rounded bg-white" />
            </div>
          ))}
        </div>
      </div>

      {/* Categories skeleton */}
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="mb-6 h-7 w-28 animate-pulse rounded bg-surface" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg bg-surface"
            />
          ))}
        </div>
      </div>

      {/* Bestsellers skeleton */}
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="mb-6 h-7 w-36 animate-pulse rounded bg-surface" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-border"
            >
              <div className="h-36 animate-pulse bg-surface" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-16 animate-pulse rounded bg-surface" />
                <div className="h-4 w-24 animate-pulse rounded bg-surface" />
                <div className="h-3 w-32 animate-pulse rounded bg-surface" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
