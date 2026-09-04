"use client";

import { useActionState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { addEventPhoto } from "@/app/actions/events";
import type { ActionResult } from "@/app/actions/alumni";

export function AddPhotoForm({ eventId }: { eventId: string }) {
  const [state, formAction, pending] = useActionState(addEventPhoto, null as ActionResult | null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        formAction(formData);
      }}
      className="space-y-4"
    >
      <input type="hidden" name="eventId" value={eventId} />
      <ImageUploadField name="url" label="Photo" folder="events-gallery" />
      <div>
        <Label htmlFor="caption">Caption</Label>
        <Input id="caption" name="caption" maxLength={200} />
      </div>
      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Adding..." : "Add Photo"}
      </Button>
    </form>
  );
}
