import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton";

/*
 * Fallback for the dashboard and any admin route without its own skeleton.
 * Shaped like the dashboard's stat-tile grid.
 *
 * Deliberate trade-off: this streams the response, so notFound() in a child
 * route renders the 404 UI with a 200 status. That matters on public pages —
 * it is why the public skeletons are scoped per-segment — but the admin panel
 * is noindex'd and navigated by hand, so nothing reads the status.
 */
export default function AdminLoading() {
  return (
    <SkeletonGroup label="Loading dashboard">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-2 h-3.5 w-64" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="mt-4 h-3 w-32" />
          </div>
        ))}
      </div>
    </SkeletonGroup>
  );
}
