import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton";

// A single settings form: a logo upload slot followed by paired text fields
// and a wide about/footer textarea.
export default function AdminSettingsLoading() {
  return (
    <SkeletonGroup label="Loading settings">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 h-3.5 w-96 max-w-full" />

      <div className="mt-8 max-w-2xl space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-lg" />
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="grid grid-cols-2 gap-4">
            {[0, 1].map((c) => (
              <div key={c} className="space-y-2">
                <Skeleton className="h-2.5 w-24" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ))}
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>
    </SkeletonGroup>
  );
}
