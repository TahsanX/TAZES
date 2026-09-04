"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { ActionResult } from "@/app/actions/alumni";

type Defaults = {
  imageUrl?: string;
  headline?: string | null;
  subheadline?: string | null;
  ctaText?: string | null;
  ctaHref?: string | null;
  order?: number;
  enabled?: boolean;
};

export function HeroSlideForm({
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
      <ImageUploadField name="imageUrl" label="Slide Image *" defaultValue={defaults?.imageUrl ?? ""} folder="hero" />
      <div>
        <Label htmlFor="headline">Headline</Label>
        <Input id="headline" name="headline" defaultValue={defaults?.headline ?? ""} maxLength={160} />
      </div>
      <div>
        <Label htmlFor="subheadline">Subheadline</Label>
        <Input id="subheadline" name="subheadline" defaultValue={defaults?.subheadline ?? ""} maxLength={240} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ctaText">Button Text</Label>
          <Input id="ctaText" name="ctaText" defaultValue={defaults?.ctaText ?? ""} maxLength={60} />
        </div>
        <div>
          <Label htmlFor="ctaHref">Button Link</Label>
          <Input id="ctaHref" name="ctaHref" defaultValue={defaults?.ctaHref ?? ""} placeholder="/alumni/register" maxLength={300} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="order">Display Order</Label>
          <Input id="order" name="order" type="number" defaultValue={defaults?.order ?? 0} />
        </div>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <Checkbox name="enabled" defaultChecked={defaults?.enabled ?? true} /> Enabled
        </label>
      </div>
      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
