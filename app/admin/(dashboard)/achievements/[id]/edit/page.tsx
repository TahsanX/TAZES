import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AchievementForm } from "@/components/admin/achievement-form";
import { updateAchievement } from "@/app/actions/achievements";

export default async function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const achievement = await prisma.achievement.findUnique({ where: { id } });
  if (!achievement) notFound();

  const boundAction = updateAchievement.bind(null, id);

  return (
    <div>
      <Link href="/admin/achievements" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Achievements
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-foreground">Edit Achievement</h1>
      <div className="mt-6">
        <AchievementForm action={boundAction} defaults={achievement} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
