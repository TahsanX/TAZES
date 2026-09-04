"use client";

import { useTransition, useState } from "react";
import { cn } from "@/lib/utils";

export function ToggleSwitch({
  initial,
  action,
  label,
}: {
  initial: boolean;
  action: (value: boolean) => Promise<unknown>;
  label: string;
}) {
  const [value, setValue] = useState(initial);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={value}
      disabled={pending}
      onClick={() => {
        const next = !value;
        setValue(next);
        startTransition(() => { void action(next); });
      }}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors",
        value ? "bg-primary" : "bg-muted-foreground/30",
        pending && "opacity-60"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
          value ? "translate-x-[18px]" : "translate-x-0"
        )}
      />
    </button>
  );
}
