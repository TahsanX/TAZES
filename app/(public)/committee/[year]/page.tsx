import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatBatch } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton, SkeletonCircle, SkeletonGroup } from "@/components/ui/skeleton";
import { getPublicCommitteeYears, isPublicCommitteeYear } from "@/lib/committee";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const committeeYear = await prisma.committeeYear.findUnique({ where: { year: Number(year) } });
  if (!committeeYear || !(await isPublicCommitteeYear(committeeYear.year))) return { title: "Committee" };
  return {
    title: committeeYear.title,
    description:
      committeeYear.summary ??
      `The office bearers and members who served on the executive committee in ${committeeYear.year}.`,
  };
}

/*
 * The year is resolved and validated here, before anything streams, so an
 * unknown year still returns a real 404. Only the member grid — the part that
 * loads photos — sits behind Suspense.
 */
export default async function CommitteeYearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);
  if (!Number.isInteger(year)) notFound();

  const [committeeYear, publicYears] = await Promise.all([
    prisma.committeeYear.findUnique({ where: { year } }),
    getPublicCommitteeYears(),
  ]);

  // Archived years still exist in the database and in the admin panel, but are
  // not reachable here — a direct URL to one 404s like any unknown year.
  if (!committeeYear || !publicYears.includes(year)) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{committeeYear.title}</h1>
          {committeeYear.summary && <p className="mt-2 max-w-2xl text-muted-foreground">{committeeYear.summary}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {publicYears.map((y) => (
            <Link
              key={y}
              href={`/committee/${y}`}
              className={cn(
                "rounded-full border border-border px-3 py-1 text-sm font-medium",
                y === year ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {y}
            </Link>
          ))}
        </div>
      </div>

      <Suspense fallback={<MembersSkeleton />}>
        <Members committeeYearId={committeeYear.id} />
      </Suspense>
    </div>
  );
}

const MEMBER_GRID = "mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

function MembersSkeleton() {
  return (
    <SkeletonGroup label="Loading committee members" className={MEMBER_GRID}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center rounded-xl border border-border bg-card p-6 shadow-sm">
          <SkeletonCircle className="h-24 w-24" />
          <Skeleton className="mt-4 h-3.5 w-28" />
          <Skeleton className="mt-2 h-3 w-20" />
          <Skeleton className="mt-2 h-2.5 w-16" />
        </div>
      ))}
    </SkeletonGroup>
  );
}

async function Members({ committeeYearId }: { committeeYearId: string }) {
  const members = await prisma.committeeMember.findMany({
    where: { committeeYearId },
    orderBy: { roleOrder: "asc" },
  });

  if (members.length === 0) {
    return <p className="mt-10 text-center text-muted-foreground">No members have been added for this year yet.</p>;
  }

  return (
    <div className={MEMBER_GRID}>
      {members.map((m) => (
        <div key={m.id} className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          {m.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.imageUrl} alt={m.name} className="h-24 w-24 rounded-full object-cover" />
          ) : (
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
              {m.name.charAt(0)}
            </span>
          )}
          <div className="mt-4 font-semibold text-foreground">{m.name}</div>
          <div className="text-sm text-primary">{m.role}</div>
          {m.department && <div className="mt-1 text-xs text-muted-foreground">{formatBatch(m.department, m.batch)}</div>}
        </div>
      ))}
    </div>
  );
}
