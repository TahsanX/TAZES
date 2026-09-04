import { Skeleton, SkeletonCircle, SkeletonGroup } from "@/components/ui/skeleton";

// The home CMS is three stacked panels: section rows carrying a toggle and
// reorder arrows, then hero slides, then teacher speeches.
export default function AdminHomeLoading() {
  return (
    <SkeletonGroup label="Loading home page settings">
      <Skeleton className="h-8 w-44" />

      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-11 rounded-full" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex gap-1">
              <Skeleton className="h-7 w-7 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {[0, 1].map((panel) => (
        <div key={panel} className="mt-10">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                {panel === 0 ? (
                  <Skeleton className="h-12 w-20 shrink-0 rounded-lg" />
                ) : (
                  <SkeletonCircle className="h-12 w-12 shrink-0" />
                )}
                <div className="flex-1 space-y-2.5">
                  <Skeleton className="h-3.5 w-1/3" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </SkeletonGroup>
  );
}
