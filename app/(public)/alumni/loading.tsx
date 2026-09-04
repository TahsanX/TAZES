/*
 * Scoped to /alumni deliberately. A loading.tsx at the route-group root would
 * wrap every public page in Suspense, and once a response starts streaming the
 * HTTP status is already sent — so notFound() on /events/[slug] and
 * /committee/[year] would render the 404 page with a 200 status. Skeletons
 * therefore live only on segments whose children never call notFound().
 *
 * The directory is the heaviest public query (filter facets + counts + page),
 * so this is where a skeleton actually earns its place.
 */
export default function AlumniLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-12">
      <div className="h-9 w-64 rounded-lg bg-muted" />
      <div className="mt-3 h-5 w-96 max-w-full rounded bg-muted" />
      <div className="mt-8 h-24 rounded-xl border border-border bg-card" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="h-5 w-3/4 rounded bg-muted" />
            <div className="mt-3 h-4 w-1/3 rounded bg-muted" />
            <div className="mt-4 h-4 w-2/3 rounded bg-muted" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading alumni…</span>
    </div>
  );
}
