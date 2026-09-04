"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { ActionResult } from "@/app/actions/alumni";

type Defaults = {
  name?: string;
  role?: string;
  roleOrder?: number;
  imageUrl?: string | null;
  department?: string | null;
  batch?: number | null;
};

export function CommitteeMemberForm({
  committeeYearId,
  action,
  defaults,
  submitLabel = "Add Member",
}: {
  committeeYearId: string;
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  defaults?: Defaults;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="committeeYearId" value={committeeYearId} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" required defaultValue={defaults?.name} maxLength={120} />
        </div>
        <div>
          <Label htmlFor="role">Role *</Label>
          <Input id="role" name="role" required defaultValue={defaults?.role} placeholder="President" maxLength={80} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="roleOrder">Display Order</Label>
          <Input id="roleOrder" name="roleOrder" type="number" defaultValue={defaults?.roleOrder ?? 100} />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input id="department" name="department" defaultValue={defaults?.department ?? ""} maxLength={40} />
        </div>
        <div>
          <Label htmlFor="batch">Batch</Label>
          <Input id="batch" name="batch" type="number" defaultValue={defaults?.batch ?? ""} />
        </div>
      </div>
      <ImageUploadField name="imageUrl" label="Photo" defaultValue={defaults?.imageUrl ?? ""} folder="committee" />
      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
