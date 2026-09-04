import { Skeleton, SkeletonGroup, SkeletonText } from "@/components/ui/skeleton";

// Scoped to this segment for the same reason as the alumni skeleton: a
// group-level loading.tsx starts streaming and locks notFound() to a 200.
// Mirrors the achievement grid — image band, title, date/category, blurb.
export default function AchievementsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SkeletonGroup label="Loading achievements">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
              <Skeleton className="h-44 w-full rounded-none" />
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="mt-3 h-2.5 w-1/3" />
                <SkeletonText lines={2} className="mt-4" />
              </div>
            </div>
          ))}
        </div>
      </SkeletonGroup>
    </div>
  );
}
