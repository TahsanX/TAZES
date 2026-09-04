"use client";

import { useTransition } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { moveHomeSection, toggleHomeSection } from "@/app/actions/home";

export function SectionRow({
  id,
  label,
  enabled,
  isFirst,
  isLast,
}: {
  id: string;
  label: string;
  enabled: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-3">
        <ToggleSwitch initial={enabled} label={`Toggle ${label}`} action={(v) => toggleHomeSection(id, v)} />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          disabled={isFirst || pending}
          onClick={() => startTransition(() => { void moveHomeSection(id, "up"); })}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
          aria-label="Move up"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={isLast || pending}
          onClick={() => startTransition(() => { void moveHomeSection(id, "down"); })}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
          aria-label="Move down"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
