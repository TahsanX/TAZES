"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/app/actions/alumni";

type Defaults = { year?: number; title?: string; isCurrent?: boolean; summary?: string | null };

export function CommitteeYearForm({
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
    <form action={formAction} className="max-w-lg space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year">Year *</Label>
          <Input id="year" name="year" type="number" required defaultValue={defaults?.year} min={1960} max={2100} />
        </div>
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" required defaultValue={defaults?.title} maxLength={160} />
        </div>
      </div>
      <div>
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" name="summary" defaultValue={defaults?.summary ?? ""} maxLength={2000} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox name="isCurrent" defaultChecked={defaults?.isCurrent} /> Set as current committee
      </label>
      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
