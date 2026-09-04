import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AlumniForm } from "@/components/admin/alumni-form";
import { updateAlumniAdmin } from "@/app/actions/alumni";

export default async function EditAlumniPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const alumni = await prisma.alumni.findUnique({ where: { id } });
  if (!alumni) notFound();

  const boundAction = updateAlumniAdmin.bind(null, id);

  return (
    <div>
      <Link href="/admin/alumni" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Alumni
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-foreground">Edit Alumni</h1>
      <div className="mt-6">
        <AlumniForm action={boundAction} defaults={alumni} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
