"use client";

import { useActionState, useState } from "react";
import { Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/app/actions/alumni";

type Config = { heading?: string; subheading?: string; itemLimit?: number; autoplayMs?: number };

export function SectionConfigForm({
  action,
  config,
}: {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  config: Config;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
      >
        <Settings2 className="h-3.5 w-3.5" /> Settings
      </button>
      {open && (
        <form action={formAction} className="mt-2 space-y-3 rounded-lg border border-border bg-muted/30 p-3">
          <div>
            <Label htmlFor="heading" className="text-xs">
              Heading
            </Label>
            <Input id="heading" name="heading" defaultValue={config.heading ?? ""} className="h-8 text-xs" />
          </div>
          <div>
            <Label htmlFor="subheading" className="text-xs">
              Subheading
            </Label>
            <Input id="subheading" name="subheading" defaultValue={config.subheading ?? ""} className="h-8 text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="itemLimit" className="text-xs">
                Item Limit
              </Label>
              <Input id="itemLimit" name="itemLimit" type="number" defaultValue={config.itemLimit ?? ""} className="h-8 text-xs" />
            </div>
            <div>
              <Label htmlFor="autoplayMs" className="text-xs">
                Autoplay (ms)
              </Label>
              <Input id="autoplayMs" name="autoplayMs" type="number" defaultValue={config.autoplayMs ?? ""} className="h-8 text-xs" />
            </div>
          </div>
          {state && !state.ok && <p className="text-xs text-destructive">{state.error}</p>}
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Saving..." : "Save"}
          </Button>
        </form>
      )}
    </div>
  );
}
