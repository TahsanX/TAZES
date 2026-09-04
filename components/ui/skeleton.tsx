import { cn } from "@/lib/utils";

/**
 * A single shimmering placeholder block.
 *
 * Uses `bg-foreground/10` rather than a fixed grey so it stays visible in both
 * themes — a literal gray-200 disappears against the dark palette's cards.
 * The pulse lives on the wrapping container (see SkeletonGroup) so every block
 * in a group breathes in unison instead of drifting out of phase.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("rounded bg-foreground/10", className)} />;
}

/** Wraps a set of Skeletons so they pulse together, and hides them from screen readers. */
export function SkeletonGroup({
  children,
  className,
  label = "Loading…",
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("animate-pulse", className)} aria-hidden="true" role="presentation">
      {children}
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** Circular placeholder for avatars and icon slots. */
export function SkeletonCircle({ className }: { className?: string }) {
  return <div className={cn("rounded-full bg-foreground/10", className)} />;
}

/**
 * A run of text lines with the last one shortened, which is what makes a block
 * read as prose rather than as a solid grey rectangle.
 */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-2.5", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}
