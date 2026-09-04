import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CommitteeYearForm } from "@/components/admin/committee-year-form";
import { updateCommitteeYear } from "@/app/actions/committee";

export default async function EditCommitteeYearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);
  const committeeYear = await prisma.committeeYear.findUnique({ where: { year } });
  if (!committeeYear) notFound();

  const boundAction = updateCommitteeYear.bind(null, committeeYear.id);

  return (
    <div>
      <Link href="/admin/committee" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Committee
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-foreground">Edit {committeeYear.title}</h1>
      <div className="mt-6">
        <CommitteeYearForm action={boundAction} defaults={committeeYear} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
