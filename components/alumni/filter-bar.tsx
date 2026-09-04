"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Facet<T> = { value: T; count: number };

export function FilterBar({
  departments,
  batches,
  companies,
}: {
  departments: Facet<string>[];
  batches: Facet<number>[];
  companies: Facet<string>[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParam("q", q);
  }

  const activeFilters = [
    searchParams.get("department") && { key: "department", label: searchParams.get("department")! },
    searchParams.get("batch") && { key: "batch", label: `Batch ${searchParams.get("batch")}` },
    searchParams.get("company") && { key: "company", label: searchParams.get("company")! },
    searchParams.get("q") && { key: "q", label: `"${searchParams.get("q")}"` },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-4">
        <form onSubmit={submitSearch} className="relative md:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, company..."
            className="pl-9"
          />
        </form>

        <Select
          value={searchParams.get("department") ?? ""}
          onChange={(e) => updateParam("department", e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.value} value={d.value}>
              {d.value} ({d.count})
            </option>
          ))}
        </Select>

        <Select value={searchParams.get("batch") ?? ""} onChange={(e) => updateParam("batch", e.target.value)}>
          <option value="">All Batches</option>
          {batches.map((b) => (
            <option key={b.value} value={b.value}>
              {b.value} ({b.count})
            </option>
          ))}
        </Select>

        <Select value={searchParams.get("company") ?? ""} onChange={(e) => updateParam("company", e.target.value)}>
          <option value="">All Companies</option>
          {companies.map((c) => (
            <option key={c.value} value={c.value}>
              {c.value} ({c.count})
            </option>
          ))}
        </Select>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {f.label}
              <button aria-label={`Remove ${f.key} filter`} onClick={() => updateParam(f.key, "")}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQ("");
              startTransition(() => router.push(pathname));
            }}
          >
            Clear all
          </Button>
        </div>
      )}
      {isPending && <p className="mt-2 text-xs text-muted-foreground">Updating results…</p>}
    </div>
  );
}
