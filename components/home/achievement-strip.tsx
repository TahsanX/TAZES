import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { SectionHeading } from "./section-heading";
import { Badge } from "@/components/ui/badge";

export async function AchievementStrip({ config }: { config: { heading?: string; subheading?: string; itemLimit?: number } }) {
  const achievements = await prisma.achievement.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { date: "desc" }],
    take: config.itemLimit ?? 4,
  });

  if (achievements.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading heading={config.heading ?? "Recent Achievements"} subheading={config.subheading} />
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {achievements.map((a) => (
          <div key={a.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            {a.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.imageUrl} alt={a.title} className="h-36 w-full object-cover" />
            ) : (
              <div className="h-36 w-full bg-gradient-to-br from-primary/20 to-accent/20" />
            )}
            <div className="p-4">
              {a.category && <Badge>{a.category}</Badge>}
              <h3 className="mt-2 text-sm font-semibold text-foreground">{a.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{formatDate(a.date)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/achievements" className="text-sm font-medium text-primary hover:underline">
          View all achievements &rarr;
        </Link>
      </div>
    </section>
  );
}
