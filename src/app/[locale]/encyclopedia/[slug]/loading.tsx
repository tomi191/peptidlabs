export default function EncyclopediaDetailLoading() {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2">
          <div className="h-3 w-20 animate-pulse rounded bg-surface" />
          <span className="text-muted">/</span>
          <div className="h-3 w-32 animate-pulse rounded bg-surface" />
        </div>

        {/* Header + signature */}
        <div className="grid gap-8 md:grid-cols-[1fr_240px] md:items-start">
          <div className="space-y-3">
            <div className="h-8 w-44 animate-pulse rounded bg-surface" />
            <div className="h-4 w-72 animate-pulse rounded bg-surface" />
            <div className="mt-4 h-3 w-40 animate-pulse rounded bg-surface" />
          </div>
          <div className="h-60 w-60 animate-pulse rounded-lg bg-surface md:justify-self-end" />
        </div>

        {/* Body */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {/* At a Glance */}
            <div className="rounded-xl bg-surface p-6 space-y-3">
              <div className="h-5 w-28 animate-pulse rounded bg-border/50" />
              <div className="h-4 w-full animate-pulse rounded bg-border/50" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-border/50" />
            </div>

            {/* Formula box */}
            <div>
              <div className="mb-2 h-4 w-20 animate-pulse rounded bg-surface" />
              <div className="h-4 w-64 animate-pulse rounded bg-surface" />
            </div>

            {/* 6 paragraphs */}
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-surface" />
                  <div className="h-3 w-full animate-pulse rounded bg-surface" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-surface" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-3">
            <div className="mb-4 h-4 w-36 animate-pulse rounded bg-surface" />
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
          </aside>
        </div>
      </div>
    </main>
  );
}
