import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { buttonVariants, Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteAchievement } from "@/app/actions/achievements";

export const dynamic = "force-dynamic";

export default async function AdminAchievementsPage() {
  const achievements = await prisma.achievement.findMany({ orderBy: { date: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
        <Link href="/admin/achievements/new" className={buttonVariants({})}>
          <Plus className="mr-1 h-4 w-4" /> Add Achievement
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {achievements.map((a) => (
          <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
            <div>
              <div className="flex items-center gap-2 font-medium text-foreground">
                {a.title}
                {a.featured && <Badge variant="accent">Featured</Badge>}
                {!a.published && <Badge variant="warning">Draft</Badge>}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(a.date)} {a.category && `· ${a.category}`}
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/achievements/${a.id}/edit`}>
                <Button type="button" variant="ghost" size="sm">
                  Edit
                </Button>
              </Link>
              <DeleteButton action={deleteAchievement.bind(null, a.id)} confirmText={`Delete "${a.title}"?`} />
            </div>
          </div>
        ))}
        {achievements.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No achievements yet.
          </p>
        )}
      </div>
    </div>
  );
}
