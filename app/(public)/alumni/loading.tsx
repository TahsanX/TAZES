import { Skeleton, SkeletonCircle, SkeletonGroup } from "@/components/ui/skeleton";

/*
 * Scoped to /alumni deliberately. A loading.tsx at the route-group root would
 * wrap every public page in Suspense, and once a response starts streaming the
 * HTTP status is already sent — so notFound() on /events/[slug] and
 * /committee/[year] would render the 404 page with a 200 status.
 *
 * Shaped like the directory itself: filter bar, result count, then the card
 * grid, each card an avatar beside a name and batch line with the role and
 * company beneath.
 */
export default function AlumniLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SkeletonGroup label="Loading alumni directory">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />

        {/* filter bar */}
        <div className="mt-8 rounded-xl border border-border bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>

        <Skeleton className="mt-6 h-3 w-40" />

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <SkeletonCircle className="h-12 w-12" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
              <div className="mt-4 flex items-start gap-2">
                <Skeleton className="h-4 w-4 shrink-0 rounded-sm" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </SkeletonGroup>
    </div>
  );
}
