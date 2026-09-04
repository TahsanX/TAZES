"use client";

import { useActionState } from "react";
import { registerAlumni, type ActionResult } from "@/app/actions/alumni";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: ActionResult | null = null;

export default function AlumniRegisterPage() {
  const [state, formAction, pending] = useActionState(registerAlumni, initialState);

  if (state?.ok) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground">Thank you for registering!</h1>
        <p className="mt-3 text-muted-foreground">
          Your submission has been received and is awaiting admin approval. Once approved, you&apos;ll appear in the
          public Alumni Directory.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">Alumni Registration</h1>
      <p className="mt-2 text-muted-foreground">
        Fill in your details below. Your phone number and Facebook profile stay private and visible only to
        admins unless you&apos;re contacted to make them public.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" name="name" required maxLength={120} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="department">Department *</Label>
            <Input id="department" name="department" placeholder="e.g. CSE" required maxLength={40} />
          </div>
          <div>
            <Label htmlFor="batch">Batch Year *</Label>
            <Input id="batch" name="batch" type="number" placeholder="e.g. 2021" required min={1960} max={new Date().getFullYear()} />
          </div>
        </div>
        <div>
          <Label htmlFor="currentPosition">Current Role</Label>
          <Input id="currentPosition" name="currentPosition" placeholder="e.g. Software Engineer" maxLength={160} />
        </div>
        <div>
          <Label htmlFor="company">Current Company</Label>
          <Input id="company" name="company" placeholder="e.g. Google" maxLength={160} />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" placeholder="+8801XXXXXXXXX" maxLength={30} />
        </div>
        <div>
          <Label htmlFor="facebook">Facebook Profile URL</Label>
          <Input id="facebook" name="facebook" placeholder="https://facebook.com/yourname" maxLength={200} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" maxLength={160} />
        </div>

        {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Submitting..." : "Submit for Approval"}
        </Button>
      </form>
    </div>
  );
}
