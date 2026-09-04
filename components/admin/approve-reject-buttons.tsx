"use client";

import { useTransition } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setAlumniStatus } from "@/app/actions/alumni";

export function ApproveRejectButtons({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        size="sm"
        disabled={pending}
        onClick={() => startTransition(() => { void setAlumniStatus(id, "APPROVED"); })}
      >
        <Check className="mr-1 h-4 w-4" /> Approve
      </Button>
      <Button
        type="button"
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() => startTransition(() => { void setAlumniStatus(id, "REJECTED"); })}
      >
        <X className="mr-1 h-4 w-4" /> Reject
      </Button>
    </div>
  );
}
