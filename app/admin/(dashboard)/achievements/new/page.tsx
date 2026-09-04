import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AchievementForm } from "@/components/admin/achievement-form";
import { createAchievement } from "@/app/actions/achievements";

export default function NewAchievementPage() {
  return (
    <div>
      <Link href="/admin/achievements" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Achievements
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-foreground">Add Achievement</h1>
      <div className="mt-6">
        <AchievementForm action={createAchievement} submitLabel="Create" />
      </div>
    </div>
  );
}
