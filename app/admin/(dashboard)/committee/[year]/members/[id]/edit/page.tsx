import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CommitteeMemberForm } from "@/components/admin/committee-member-form";
import { updateCommitteeMember } from "@/app/actions/committee";

export default async function EditCommitteeMemberPage({
  params,
}: {
  params: Promise<{ year: string; id: string }>;
}) {
  const { year, id } = await params;
  const member = await prisma.committeeMember.findUnique({ where: { id } });
  if (!member) notFound();

  const boundAction = updateCommitteeMember.bind(null, id);

  return (
    <div>
      <Link
        href={`/admin/committee/${year}`}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to {year} Committee
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-foreground">Edit Member</h1>
      <div className="mt-6 max-w-lg rounded-xl border border-border bg-card p-5">
        <CommitteeMemberForm committeeYearId={member.committeeYearId} action={boundAction} defaults={member} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
