import { Skeleton, SkeletonCircle, SkeletonGroup } from "@/components/ui/skeleton";

// The approval queue is a card per submission with Approve / Reject actions,
// not the wide table used by the main alumni list.
export default function AdminPendingLoading() {
  return (
    <SkeletonGroup label="Loading pending approvals">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-2 h-3.5 w-80 max-w-full" />

      <div className="mt-6 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex flex-1 items-center gap-3">
              <SkeletonCircle className="h-11 w-11 shrink-0" />
              <div className="flex-1 space-y-2.5">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-2.5 w-56 max-w-full" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-lg" />
              <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonGroup>
  );
}
