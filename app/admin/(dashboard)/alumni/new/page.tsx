import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AlumniForm } from "@/components/admin/alumni-form";
import { createAlumniAdmin } from "@/app/actions/alumni";

export default function NewAlumniPage() {
  return (
    <div>
      <Link href="/admin/alumni" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Alumni
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-foreground">Add Alumni</h1>
      <div className="mt-6">
        <AlumniForm action={createAlumniAdmin} submitLabel="Create" />
      </div>
    </div>
  );
}
