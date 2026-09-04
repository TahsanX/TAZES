import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBatch } from "@/lib/format";
import { SectionHeading } from "./section-heading";

export async function CommitteePreview({ config }: { config: { heading?: string; subheading?: string; itemLimit?: number } }) {
  const currentYear = await prisma.committeeYear.findFirst({
    where: { isCurrent: true },
    include: { members: { orderBy: { roleOrder: "asc" }, take: config.itemLimit ?? 6 } },
  });

  if (!currentYear || currentYear.members.length === 0) return null;

  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading heading={config.heading ?? `${currentYear.title}`} subheading={config.subheading} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {currentYear.members.map((m) => (
            <div key={m.id} className="flex flex-col items-center text-center">
              {m.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.imageUrl} alt={m.name} className="h-20 w-20 rounded-full object-cover shadow-sm" />
              ) : (
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                  {m.name.charAt(0)}
                </span>
              )}
              <div className="mt-3 text-sm font-semibold text-foreground">{m.name}</div>
              <div className="text-xs text-primary">{m.role}</div>
              {m.department && <div className="text-xs text-muted-foreground">{formatBatch(m.department, m.batch)}</div>}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/committee" className="text-sm font-medium text-primary hover:underline">
            View full committee &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
