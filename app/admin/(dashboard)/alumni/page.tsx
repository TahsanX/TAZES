import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatBatch } from "@/lib/format";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { deleteAlumniAdmin, toggleAlumniVisibility } from "@/app/actions/alumni";

export const dynamic = "force-dynamic";

export default async function AdminAlumniPage() {
  const alumni = await prisma.alumni.findMany({
    where: { status: "APPROVED" },
    orderBy: [{ batch: "desc" }, { name: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alumni</h1>
          <p className="mt-1 text-sm text-muted-foreground">{alumni.length} approved members</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/alumni/pending" className={buttonVariants({ variant: "outline" })}>
            Pending Queue
          </Link>
          <Link href="/admin/alumni/new" className={buttonVariants({})}>
            <Plus className="mr-1 h-4 w-4" /> Add Alumni
          </Link>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Name</th>
              <th className="p-3">Batch</th>
              <th className="p-3">Company</th>
              <th className="p-3">Phone public</th>
              <th className="p-3">Facebook public</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alumni.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0">
                <td className="p-3">
                  <div className="font-medium text-foreground">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.currentPosition}</div>
                </td>
                <td className="p-3">
                  <Badge>{formatBatch(a.department, a.batch)}</Badge>
                </td>
                <td className="p-3 text-muted-foreground">{a.company ?? "—"}</td>
                <td className="p-3">
                  <ToggleSwitch
                    initial={a.showPhone}
                    label="Publish phone number"
                    action={toggleAlumniVisibility.bind(null, a.id, "showPhone")}
                  />
                </td>
                <td className="p-3">
                  <ToggleSwitch
                    initial={a.showFacebook}
                    label="Publish Facebook link"
                    action={toggleAlumniVisibility.bind(null, a.id, "showFacebook")}
                  />
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-1">
                    <Link href={`/admin/alumni/${a.id}/edit`}>
                      <Button type="button" variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <DeleteButton
                      action={deleteAlumniAdmin.bind(null, a.id)}
                      confirmText={`Delete ${a.name}? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {alumni.length === 0 && <p className="p-6 text-center text-muted-foreground">No approved alumni yet.</p>}
      </div>
    </div>
  );
}
