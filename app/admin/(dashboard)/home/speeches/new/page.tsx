import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TeacherSpeechForm } from "@/components/admin/teacher-speech-form";
import { createTeacherSpeech } from "@/app/actions/home";

export default function NewTeacherSpeechPage() {
  return (
    <div>
      <Link href="/admin/home" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Home Page
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-foreground">Add Teacher Speech</h1>
      <div className="mt-6">
        <TeacherSpeechForm action={createTeacherSpeech} submitLabel="Create" />
      </div>
    </div>
  );
}
