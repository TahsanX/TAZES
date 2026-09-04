import "server-only";
import { prisma } from "@/lib/prisma";
import { alumniFilterSchema } from "@/lib/validators";
import type { Alumni } from "@/lib/generated/prisma";
import { formatBatch } from "@/lib/format";

const PAGE_SIZE = 24;

export type PublicAlumni = {
  id: string;
  name: string;
  department: string;
  batch: number;
  label: string; // "CSE'21"
  currentPosition: string | null;
  company: string | null;
  phone: string | null; // present only if showPhone
  facebook: string | null; // present only if showFacebook
};

/**
 * The only path by which an Alumni record may reach a public page. `email` is
 * dropped unconditionally (never public, no toggle for it); `phone` and
 * `facebook` are dropped unless their matching visibility flag is set.
 * Keeping this logic in one place means no component can leak a field by
 * forgetting to check its flag.
 */
export function toPublicAlumni(a: Alumni): PublicAlumni {
  return {
    id: a.id,
    name: a.name,
    department: a.department,
    batch: a.batch,
    label: formatBatch(a.department, a.batch),
    currentPosition: a.currentPosition,
    company: a.company,
    phone: a.showPhone ? a.phone : null,
    facebook: a.showFacebook ? a.facebook : null,
  };
}

export type AlumniQueryResult = {
  items: PublicAlumni[];
  total: number;
  page: number;
  pageCount: number;
  facets: {
    departments: { value: string; count: number }[];
    batches: { value: number; count: number }[];
    companies: { value: string; count: number }[];
  };
};

/**
 * Builds one Prisma `where` clause AND-ing every provided filter, always
 * scoped to APPROVED records, and returns the paginated public result plus
 * facet counts (computed from APPROVED rows only) for the filter dropdowns.
 */
export async function queryAlumni(rawParams: Record<string, string | string[] | undefined>): Promise<AlumniQueryResult> {
  const parsed = alumniFilterSchema.safeParse({
    batch: rawParams.batch,
    department: rawParams.department,
    company: rawParams.company,
    q: rawParams.q,
    page: rawParams.page,
  });
  const filters = parsed.success ? parsed.data : { page: 1 };

  const where = {
    status: "APPROVED" as const,
    ...(filters.batch ? { batch: filters.batch } : {}),
    ...(filters.department ? { department: { equals: filters.department, mode: "insensitive" as const } } : {}),
    ...(filters.company ? { company: { equals: filters.company, mode: "insensitive" as const } } : {}),
    ...(filters.q
      ? {
          OR: [
            { name: { contains: filters.q, mode: "insensitive" as const } },
            { company: { contains: filters.q, mode: "insensitive" as const } },
            { currentPosition: { contains: filters.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const page = filters.page ?? 1;

  const [total, rows, departmentGroups, batchGroups, companyGroups] = await Promise.all([
    prisma.alumni.count({ where }),
    prisma.alumni.findMany({
      where,
      orderBy: [{ batch: "desc" }, { name: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.alumni.groupBy({
      by: ["department"],
      where: { status: "APPROVED" },
      _count: { _all: true },
      orderBy: { department: "asc" },
    }),
    prisma.alumni.groupBy({
      by: ["batch"],
      where: { status: "APPROVED" },
      _count: { _all: true },
      orderBy: { batch: "desc" },
    }),
    prisma.alumni.groupBy({
      by: ["company"],
      where: { status: "APPROVED", company: { not: null } },
      _count: { _all: true },
      orderBy: { company: "asc" },
    }),
  ]);

  return {
    items: rows.map(toPublicAlumni),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    facets: {
      departments: departmentGroups.map((g) => ({ value: g.department, count: g._count._all })),
      batches: batchGroups.map((g) => ({ value: g.batch, count: g._count._all })),
      companies: companyGroups
        .filter((g) => g.company)
        .map((g) => ({ value: g.company as string, count: g._count._all })),
    },
  };
}

export { PAGE_SIZE };
