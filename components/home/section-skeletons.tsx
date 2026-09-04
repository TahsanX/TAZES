import { Skeleton, SkeletonCircle, SkeletonGroup, SkeletonText } from "@/components/ui/skeleton";

/**
 * A placeholder per home section, each shaped like the section it stands in
 * for — the hero reserves its full 420/520px band, the stats row keeps its
 * 2/4-column grid, and so on. Matching the real geometry is the point: a
 * generic box would collapse and let the page jump when the data lands.
 */

function SectionHeadingSkeleton() {
  return (
    <div className="flex flex-col items-center">
      <Skeleton className="h-7 w-64 max-w-full" />
      <Skeleton className="mt-3 h-3 w-96 max-w-full" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <SkeletonGroup label="Loading hero">
      <section className="relative h-[420px] w-full overflow-hidden bg-foreground/5 md:h-[520px]">
        <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-4">
          <Skeleton className="h-10 w-3/4 max-w-xl md:h-14" />
          <Skeleton className="mt-4 h-4 w-1/2 max-w-md" />
          <Skeleton className="mt-8 h-11 w-44 rounded-lg" />
        </div>
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCircle key={i} className="h-2 w-2" />
          ))}
        </div>
      </section>
    </SkeletonGroup>
  );
}

export function StatsSkeleton() {
  return (
    <SkeletonGroup label="Loading statistics">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeadingSkeleton />
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </section>
    </SkeletonGroup>
  );
}

export function SpeechesSkeleton() {
  return (
    <SkeletonGroup label="Loading messages">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeadingSkeleton />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <SkeletonCircle className="h-12 w-12" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-2.5 w-20" />
                </div>
              </div>
              <SkeletonText lines={4} className="mt-5" />
            </div>
          ))}
        </div>
      </section>
    </SkeletonGroup>
  );
}

export function AchievementsSkeleton() {
  return (
    <SkeletonGroup label="Loading achievements">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeadingSkeleton />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
              <Skeleton className="h-40 w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </SkeletonGroup>
  );
}

export function CommitteeSkeleton() {
  return (
    <SkeletonGroup label="Loading committee">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeadingSkeleton />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <SkeletonCircle className="h-20 w-20" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          ))}
        </div>
      </section>
    </SkeletonGroup>
  );
}

/** Keyed the same way as SECTION_COMPONENTS so the fallback always matches the section. */
export const SECTION_SKELETONS: Record<string, () => React.ReactElement> = {
  HERO: HeroSkeleton,
  STATS: StatsSkeleton,
  SPEECHES: SpeechesSkeleton,
  ACHIEVEMENTS: AchievementsSkeleton,
  COMMITTEE: CommitteeSkeleton,
};
