import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton";

/**
 * The achievements, events and committee screens all render the same shape —
 * a title with an "Add" button, then a stack of rows carrying a label, a meta
 * line and edit/delete controls. One parameterised skeleton keeps them honest
 * rather than three near-identical copies.
 */
export function AdminListSkeleton({
  rows = 5,
  titleWidth = "w-40",
  withThumb = false,
  label = "Loading",
}: {
  rows?: number;
  titleWidth?: string;
  withThumb?: boolean;
  label?: string;
}) {
  return (
    <SkeletonGroup label={label}>
      <div className="flex items-center justify-between">
        <Skeleton className={`h-8 ${titleWidth}`} />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      <div className="mt-6 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex flex-1 items-center gap-3">
              {withThumb && <Skeleton className="h-12 w-16 shrink-0 rounded-lg" />}
              <div className="flex-1 space-y-2.5">
                <Skeleton className="h-3.5 w-1/3" />
                <Skeleton className="h-2.5 w-1/4" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-12 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonGroup>
  );
}
