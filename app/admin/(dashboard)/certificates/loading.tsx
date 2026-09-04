import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton";

// Two-column: the field stack on the left, the A4-landscape preview on the
// right. The preview keeps its aspect ratio so the layout doesn't jump when
// the canvas mounts.
export default function AdminCertificatesLoading() {
  return (
    <SkeletonGroup label="Loading certificate generator">
      <Skeleton className="h-8 w-56" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[340px_1fr]">
        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-2.5 w-28" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 w-20 rounded-lg" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          {/* Holds the A4-landscape ratio so the layout doesn't shift when the real canvas mounts. */}
          <div className="aspect-[1123/794] w-full rounded-lg bg-foreground/10" />
          <Skeleton className="mx-auto mt-3 h-2.5 w-64" />
        </div>
      </div>

      <div className="mt-10 space-y-3">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-2.5 w-1/4" />
            </div>
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    </SkeletonGroup>
  );
}
