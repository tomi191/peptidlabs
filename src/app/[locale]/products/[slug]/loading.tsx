export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-surface" />
        <div className="h-4 w-4 animate-pulse rounded bg-surface" />
        <div className="h-4 w-12 animate-pulse rounded bg-surface" />
        <div className="h-4 w-4 animate-pulse rounded bg-surface" />
        <div className="h-4 w-24 animate-pulse rounded bg-surface" />
      </div>

      {/* Two-column layout */}
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image column */}
        <div className="aspect-square animate-pulse rounded-xl bg-surface" />

        {/* Details column */}
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-surface" />
          <div className="h-8 w-48 animate-pulse rounded bg-surface" />
          <div className="flex gap-3">
            <div className="h-6 w-16 animate-pulse rounded bg-surface" />
            <div className="h-6 w-16 animate-pulse rounded bg-surface" />
            <div className="h-6 w-16 animate-pulse rounded bg-surface" />
          </div>
          <div className="h-10 w-32 animate-pulse rounded bg-surface" />
          <div className="h-3 w-40 animate-pulse rounded bg-surface" />
          <div className="flex gap-3 pt-4">
            <div className="h-12 w-32 animate-pulse rounded-lg bg-surface" />
            <div className="h-12 flex-1 animate-pulse rounded-lg bg-surface" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 w-48 animate-pulse rounded bg-surface" />
            <div className="h-3 w-40 animate-pulse rounded bg-surface" />
          </div>
        </div>
      </div>
    </div>
  );
}
