import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { TeacherSpeechForm } from "@/components/admin/teacher-speech-form";
import { updateTeacherSpeech } from "@/app/actions/home";

export default async function EditTeacherSpeechPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const speech = await prisma.teacherSpeech.findUnique({ where: { id } });
  if (!speech) notFound();

  const boundAction = updateTeacherSpeech.bind(null, id);

  return (
    <div>
      <Link href="/admin/home" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Home Page
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-foreground">Edit Teacher Speech</h1>
      <div className="mt-6">
        <TeacherSpeechForm action={boundAction} defaults={speech} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
