import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteCommitteeYear } from "@/app/actions/committee";

export const dynamic = "force-dynamic";

export default async function AdminCommitteePage() {
  const years = await prisma.committeeYear.findMany({
    orderBy: { year: "desc" },
    include: { _count: { select: { members: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Committee</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage committee years and their members.</p>
        </div>
        <Link href="/admin/committee/new" className={buttonVariants({})}>
          <Plus className="mr-1 h-4 w-4" /> Add Year
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {years.map((y) => (
          <div key={y.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
            <div>
              <div className="flex items-center gap-2 font-medium text-foreground">
                {y.title} {y.isCurrent && <Badge variant="success">Current</Badge>}
              </div>
              <div className="text-sm text-muted-foreground">{y._count.members} members</div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/committee/${y.year}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                Manage Members
              </Link>
              <Link href={`/admin/committee/${y.year}/edit`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Edit Year
              </Link>
              <DeleteButton
                action={deleteCommitteeYear.bind(null, y.id)}
                confirmText={`Delete ${y.title}? All its members will be removed too.`}
              />
            </div>
          </div>
        ))}
        {years.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No committee years yet.
          </p>
        )}
      </div>
    </div>
  );
}
