import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Achievements",
  description:
    "Milestones, awards, and recognitions earned by our members — a running record of what this community has accomplished together.",
};

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { date: "desc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
      <p className="mt-2 text-muted-foreground">Milestones and recognitions from our community.</p>

      {achievements.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">No achievements published yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => (
            <div key={a.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              {a.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.imageUrl} alt={a.title} className="h-44 w-full object-cover" />
              ) : (
                <div className="h-44 w-full bg-gradient-to-br from-primary/20 to-accent/20" />
              )}
              <div className="p-5">
                <div className="flex items-center gap-2">
                  {a.featured && <Badge variant="accent">Featured</Badge>}
                  {a.category && <Badge>{a.category}</Badge>}
                </div>
                <h3 className="mt-2 font-semibold text-foreground">{a.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(a.date)}</p>
                {a.description && <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
