import { prisma } from "@/lib/prisma";

/**
 * How many committee years the public site shows. Older years are kept in the
 * database and stay fully visible in the admin panel — they are just not
 * reachable publicly.
 *
 * "Last 3 years" means the three most recent committee records, not the last
 * three calendar years: committees are not always formed annually, so counting
 * records keeps three of them on the site regardless of the gaps between them.
 */
export const PUBLIC_COMMITTEE_YEAR_LIMIT = 3;

/** The years the public site is allowed to render, newest first. */
export async function getPublicCommitteeYears(): Promise<number[]> {
  const rows = await prisma.committeeYear.findMany({
    orderBy: { year: "desc" },
    take: PUBLIC_COMMITTEE_YEAR_LIMIT,
    select: { year: true },
  });
  return rows.map((r) => r.year);
}

/**
 * Whether a given year may be shown publicly. Guards direct URL access, so an
 * archived year 404s instead of being readable by anyone who guesses the URL.
 */
export async function isPublicCommitteeYear(year: number): Promise<boolean> {
  const newerCount = await prisma.committeeYear.count({ where: { year: { gt: year } } });
  return newerCount < PUBLIC_COMMITTEE_YEAR_LIMIT;
}
