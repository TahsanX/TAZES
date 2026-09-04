"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { ActionResult } from "@/app/actions/alumni";

type Defaults = {
  title?: string;
  description?: string | null;
  date?: Date;
  imageUrl?: string | null;
  category?: string | null;
  featured?: boolean;
  published?: boolean;
};

function toDateInputValue(date?: Date) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function AchievementForm({
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
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" required defaultValue={defaults?.title} maxLength={200} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={defaults?.description ?? ""} maxLength={4000} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input id="date" name="date" type="date" required defaultValue={toDateInputValue(defaults?.date)} />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" defaultValue={defaults?.category ?? ""} maxLength={60} />
        </div>
      </div>
      <ImageUploadField name="imageUrl" label="Image" defaultValue={defaults?.imageUrl ?? ""} folder="achievements" />
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox name="featured" defaultChecked={defaults?.featured} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox name="published" defaultChecked={defaults?.published ?? true} /> Published
        </label>
      </div>
      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
