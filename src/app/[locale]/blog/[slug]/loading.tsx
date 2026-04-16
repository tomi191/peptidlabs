export default function BlogPostLoading() {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2">
          <div className="h-3 w-20 animate-pulse rounded bg-surface" />
          <span className="text-muted">/</span>
          <div className="h-3 w-40 animate-pulse rounded bg-surface" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <article>
            {/* Title */}
            <div className="h-8 w-full animate-pulse rounded bg-surface" />
            <div className="mt-2 h-8 w-2/3 animate-pulse rounded bg-surface" />

            {/* Meta */}
            <div className="mt-3 flex items-center gap-3">
              <div className="h-3 w-24 animate-pulse rounded bg-surface" />
              <div className="h-3 w-24 animate-pulse rounded bg-surface" />
            </div>

            {/* Tags */}
            <div className="mt-4 flex gap-1.5">
              <div className="h-5 w-14 animate-pulse rounded-full bg-surface" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-surface" />
              <div className="h-5 w-12 animate-pulse rounded-full bg-surface" />
            </div>

            {/* Content — 8 paragraphs */}
            <div className="mt-8 space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-surface" />
                  <div className="h-3 w-full animate-pulse rounded bg-surface" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-surface" />
                </div>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="mb-4 h-4 w-32 animate-pulse rounded bg-surface" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border p-4 space-y-2"
                >
                  <div className="h-4 w-32 animate-pulse rounded bg-surface" />
                  <div className="h-3 w-12 animate-pulse rounded bg-surface" />
                  <div className="h-4 w-16 animate-pulse rounded bg-surface" />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
