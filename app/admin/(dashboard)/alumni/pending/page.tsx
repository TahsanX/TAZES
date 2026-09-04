import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatBatch } from "@/lib/format";
import { ApproveRejectButtons } from "@/components/admin/approve-reject-buttons";

export const dynamic = "force-dynamic";

export default async function PendingAlumniPage() {
  const pending = await prisma.alumni.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <Link href="/admin/alumni" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Alumni
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-foreground">Pending Approvals</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Self-registered submissions. Approving publishes name, department, batch, role, and company only —
        phone and Facebook stay private until you publish them from the Alumni table.
      </p>

      <div className="mt-6 space-y-3">
        {pending.map((a) => (
          <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
            <div>
              <div className="font-medium text-foreground">
                {a.name} <span className="text-sm text-primary">({formatBatch(a.department, a.batch)})</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {[a.currentPosition, a.company].filter(Boolean).join(" at ")}
              </div>
              <div className="text-xs text-muted-foreground">
                {a.phone && <span className="mr-3">Phone: {a.phone}</span>}
                {a.email && <span>Email: {a.email}</span>}
              </div>
            </div>
            <ApproveRejectButtons id={a.id} />
          </div>
        ))}
        {pending.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No pending submissions.
          </p>
        )}
      </div>
    </div>
  );
}
