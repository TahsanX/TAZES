import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatBatch } from "@/lib/format";
import { CommitteeMemberForm } from "@/components/admin/committee-member-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { createCommitteeMember, deleteCommitteeMember } from "@/app/actions/committee";

export const dynamic = "force-dynamic";

export default async function AdminCommitteeYearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);
  if (!Number.isInteger(year)) notFound();

  const committeeYear = await prisma.committeeYear.findUnique({
    where: { year },
    include: { members: { orderBy: { roleOrder: "asc" } } },
  });
  if (!committeeYear) notFound();

  return (
    <div>
      <Link href="/admin/committee" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Committee
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-foreground">{committeeYear.title}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Members ({committeeYear.members.length})</h2>
          <div className="mt-4 space-y-3">
            {committeeYear.members.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
                <div className="flex items-center gap-3">
                  {m.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.imageUrl} alt={m.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {m.name.charAt(0)}
                    </span>
                  )}
                  <div>
                    <div className="text-sm font-medium text-foreground">{m.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {m.role} {m.department && `· ${formatBatch(m.department, m.batch)}`}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Link
                    href={`/admin/committee/${year}/members/${m.id}/edit`}
                    className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteCommitteeMember.bind(null, m.id)} confirmText={`Remove ${m.name}?`} />
                </div>
              </div>
            ))}
            {committeeYear.members.length === 0 && (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No members added yet.
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">Add Member</h2>
          <div className="mt-4 rounded-xl border border-border bg-card p-5">
            <CommitteeMemberForm committeeYearId={committeeYear.id} action={createCommitteeMember} />
          </div>
        </div>
      </div>
    </div>
  );
}
