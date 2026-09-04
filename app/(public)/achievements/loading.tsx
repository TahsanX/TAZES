// Scoped to this segment for the same reason as the alumni skeleton: a
// group-level loading.tsx starts streaming and locks notFound() to a 200.
export default function AchievementsLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-12">
      <div className="h-9 w-56 rounded-lg bg-muted" />
      <div className="mt-3 h-5 w-80 max-w-full rounded bg-muted" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="h-32 w-full rounded-lg bg-muted" />
            <div className="mt-4 h-5 w-3/4 rounded bg-muted" />
            <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading achievements…</span>
    </div>
  );
}
