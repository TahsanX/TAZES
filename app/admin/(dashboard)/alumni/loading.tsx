import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton";

// The alumni screen is a wide table, so this mirrors the header row and the
// column rhythm rather than showing cards that would reflow on load.
export default function AdminAlumniLoading() {
  return (
    <SkeletonGroup label="Loading alumni">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid grid-cols-12 gap-4 border-b border-border p-4">
          {["col-span-3", "col-span-2", "col-span-3", "col-span-2", "col-span-2"].map((c, i) => (
            <Skeleton key={i} className={`h-2.5 ${c}`} />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="grid grid-cols-12 items-center gap-4 border-b border-border p-4 last:border-0">
            <Skeleton className="col-span-3 h-3.5" />
            <Skeleton className="col-span-2 h-3" />
            <Skeleton className="col-span-3 h-3" />
            <Skeleton className="col-span-2 h-5 w-20 rounded-full" />
            <div className="col-span-2 flex justify-end gap-2">
              <Skeleton className="h-8 w-12 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonGroup>
  );
}
