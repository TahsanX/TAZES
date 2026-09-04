import { prisma } from "@/lib/prisma";
import { SectionHeading } from "./section-heading";

export async function StatsCounters({ config }: { config: { heading?: string; subheading?: string } }) {
  const [alumniCount, batchGroups, departmentGroups, companyGroups] = await Promise.all([
    prisma.alumni.count({ where: { status: "APPROVED" } }),
    prisma.alumni.groupBy({ by: ["batch"], where: { status: "APPROVED" } }),
    prisma.alumni.groupBy({ by: ["department"], where: { status: "APPROVED" } }),
    prisma.alumni.groupBy({ by: ["company"], where: { status: "APPROVED", company: { not: null } } }),
  ]);

  const stats = [
    { label: "Alumni Members", value: alumniCount },
    { label: "Batches", value: batchGroups.length },
    { label: "Departments", value: departmentGroups.length },
    { label: "Companies", value: companyGroups.length },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading heading={config.heading ?? "Our Community in Numbers"} subheading={config.subheading} />
      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-primary md:text-4xl">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
