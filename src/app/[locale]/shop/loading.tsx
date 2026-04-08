export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12">
      <div className="mb-6 h-8 w-32 animate-pulse rounded bg-surface" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg border border-border"
          >
            <div className="h-36 animate-pulse bg-surface" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-16 animate-pulse rounded bg-surface" />
              <div className="h-4 w-24 animate-pulse rounded bg-surface" />
              <div className="h-3 w-32 animate-pulse rounded bg-surface" />
              <div className="mt-3 flex justify-between">
                <div className="h-5 w-16 animate-pulse rounded bg-surface" />
                <div className="h-8 w-8 animate-pulse rounded bg-surface" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
