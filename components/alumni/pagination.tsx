import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  pageCount,
  searchParams,
}: {
  page: number;
  pageCount: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;

  function hrefFor(p: number) {
    const params = new URLSearchParams(
      Object.entries(searchParams).filter(([, v]) => !!v) as [string, string][]
    );
    params.set("page", String(p));
    return `?${params.toString()}`;
  }

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn(
          "rounded-md border border-border px-3 py-1.5 text-sm",
          page === 1 ? "pointer-events-none opacity-40" : "hover:bg-muted"
        )}
      >
        Prev
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          className={cn(
            "rounded-md border border-border px-3 py-1.5 text-sm",
            p === page ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          )}
        >
          {p}
        </Link>
      ))}
      <Link
        href={hrefFor(Math.min(pageCount, page + 1))}
        aria-disabled={page === pageCount}
        className={cn(
          "rounded-md border border-border px-3 py-1.5 text-sm",
          page === pageCount ? "pointer-events-none opacity-40" : "hover:bg-muted"
        )}
      >
        Next
      </Link>
    </nav>
  );
}
