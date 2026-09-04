import Link from "next/link";
import { queryAlumni } from "@/lib/alumni-query";
import { FilterBar } from "@/components/alumni/filter-bar";
import { AlumniCard } from "@/components/alumni/alumni-card";
import { Pagination } from "@/components/alumni/pagination";
import { buttonVariants } from "@/components/ui/button";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Alumni Directory",
  description:
    "Search our alumni by department, batch, and company. Find seniors in your field, at your target company, or from your own batch.",
};

export default async function AlumniPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const result = await queryAlumni(resolvedParams);

  const flatParams: Record<string, string | undefined> = {
    department: typeof resolvedParams.department === "string" ? resolvedParams.department : undefined,
    batch: typeof resolvedParams.batch === "string" ? resolvedParams.batch : undefined,
    company: typeof resolvedParams.company === "string" ? resolvedParams.company : undefined,
    q: typeof resolvedParams.q === "string" ? resolvedParams.q : undefined,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alumni Directory</h1>
          <p className="mt-1 text-muted-foreground">{result.total} members found</p>
        </div>
        <Link href="/alumni/register" className={buttonVariants({})}>
          Register as Alumni
        </Link>
      </div>

      <div className="mt-6">
        <FilterBar departments={result.facets.departments} batches={result.facets.batches} companies={result.facets.companies} />
      </div>

      {result.items.length === 0 ? (
        <div className="mt-16 text-center text-muted-foreground">
          No alumni match these filters. Try clearing some of them.
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((a) => (
            <AlumniCard key={a.id} alumni={a} />
          ))}
        </div>
      )}

      <Pagination page={result.page} pageCount={result.pageCount} searchParams={flatParams} />
    </div>
  );
}
