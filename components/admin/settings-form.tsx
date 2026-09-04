"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { updateSiteSettings } from "@/app/actions/settings";
import type { ActionResult } from "@/app/actions/alumni";

type Defaults = {
  orgName?: string;
  tagline?: string | null;
  logoUrl?: string | null;
  about?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  footerNote?: string | null;
};

export function SettingsForm({ defaults }: { defaults: Defaults }) {
  const [state, formAction, pending] = useActionState(updateSiteSettings, null as ActionResult | null);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div>
        <Label htmlFor="orgName">Organization Name *</Label>
        <Input id="orgName" name="orgName" required defaultValue={defaults.orgName} maxLength={160} />
      </div>
      <div>
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" name="tagline" defaultValue={defaults.tagline ?? ""} maxLength={240} />
      </div>
      <ImageUploadField name="logoUrl" label="Logo" defaultValue={defaults.logoUrl ?? ""} folder="settings" />
      <div>
        <Label htmlFor="about">About</Label>
        <Textarea id="about" name="about" defaultValue={defaults.about ?? ""} maxLength={8000} rows={6} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Contact Email</Label>
          <Input id="email" name="email" type="email" defaultValue={defaults.email ?? ""} maxLength={160} />
        </div>
        <div>
          <Label htmlFor="phone">Contact Phone</Label>
          <Input id="phone" name="phone" defaultValue={defaults.phone ?? ""} maxLength={30} />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" defaultValue={defaults.address ?? ""} maxLength={300} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="facebook">Facebook URL</Label>
          <Input id="facebook" name="facebook" defaultValue={defaults.facebook ?? ""} maxLength={300} />
        </div>
        <div>
          <Label htmlFor="youtube">YouTube URL</Label>
          <Input id="youtube" name="youtube" defaultValue={defaults.youtube ?? ""} maxLength={300} />
        </div>
      </div>
      <div>
        <Label htmlFor="footerNote">Footer Note</Label>
        <Input id="footerNote" name="footerNote" defaultValue={defaults.footerNote ?? ""} maxLength={300} />
      </div>
      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.ok && <p className="text-sm text-emerald-600">Settings saved.</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
