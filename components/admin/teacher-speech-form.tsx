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
  name?: string;
  designation?: string | null;
  institution?: string | null;
  message?: string;
  imageUrl?: string | null;
  order?: number;
  published?: boolean;
};

export function TeacherSpeechForm({
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
        <Label htmlFor="name">Teacher Name *</Label>
        <Input id="name" name="name" required defaultValue={defaults?.name} maxLength={120} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="designation">Designation</Label>
          <Input id="designation" name="designation" defaultValue={defaults?.designation ?? ""} maxLength={160} />
        </div>
        <div>
          <Label htmlFor="institution">Institution</Label>
          <Input id="institution" name="institution" defaultValue={defaults?.institution ?? ""} maxLength={160} />
        </div>
      </div>
      <div>
        <Label htmlFor="message">Speech / Message *</Label>
        <Textarea id="message" name="message" required defaultValue={defaults?.message} maxLength={4000} />
      </div>
      <ImageUploadField name="imageUrl" label="Photo" defaultValue={defaults?.imageUrl ?? ""} folder="teachers" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="order">Display Order</Label>
          <Input id="order" name="order" type="number" defaultValue={defaults?.order ?? 0} />
        </div>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
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
