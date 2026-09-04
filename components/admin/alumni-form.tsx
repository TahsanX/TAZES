"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/app/actions/alumni";

type Defaults = {
  name?: string;
  department?: string;
  batch?: number;
  currentPosition?: string | null;
  company?: string | null;
  phone?: string | null;
  facebook?: string | null;
  email?: string | null;
  showPhone?: boolean;
  showFacebook?: boolean;
  status?: "PENDING" | "APPROVED" | "REJECTED";
};

export function AlumniForm({
  action,
  defaults,
  submitLabel = "Save",
}: {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  defaults?: Defaults;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" name="name" required defaultValue={defaults?.name} maxLength={120} />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={defaults?.status ?? "APPROVED"}>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="department">Department *</Label>
          <Input id="department" name="department" required defaultValue={defaults?.department} maxLength={40} />
        </div>
        <div>
          <Label htmlFor="batch">Batch Year *</Label>
          <Input
            id="batch"
            name="batch"
            type="number"
            required
            defaultValue={defaults?.batch}
            min={1960}
            max={new Date().getFullYear()}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="currentPosition">Current Role</Label>
        <Input id="currentPosition" name="currentPosition" defaultValue={defaults?.currentPosition ?? ""} maxLength={160} />
      </div>
      <div>
        <Label htmlFor="company">Current Company</Label>
        <Input id="company" name="company" defaultValue={defaults?.company ?? ""} maxLength={160} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={defaults?.phone ?? ""} maxLength={30} />
        </div>
        <div>
          <Label htmlFor="facebook">Facebook URL</Label>
          <Input id="facebook" name="facebook" defaultValue={defaults?.facebook ?? ""} maxLength={200} />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email (admin-only, never public)</Label>
        <Input id="email" name="email" type="email" defaultValue={defaults?.email ?? ""} maxLength={160} />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox name="showPhone" defaultChecked={defaults?.showPhone} /> Publish phone number
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox name="showFacebook" defaultChecked={defaults?.showFacebook} /> Publish Facebook link
        </label>
      </div>

      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
