import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CommitteeYearForm } from "@/components/admin/committee-year-form";
import { createCommitteeYear } from "@/app/actions/committee";

export default function NewCommitteeYearPage() {
  return (
    <div>
      <Link href="/admin/committee" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Committee
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-foreground">Add Committee Year</h1>
      <div className="mt-6">
        <CommitteeYearForm action={createCommitteeYear} submitLabel="Create" />
      </div>
    </div>
  );
}
