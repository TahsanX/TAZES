/**
 * Formats a department + batch year into the community's standard short form,
 * e.g. formatBatch("CSE", 2021) -> "CSE'21", formatBatch("EEE", 1999) -> "EEE'99".
 */
export function formatBatch(department: string | null | undefined, batch: number | null | undefined): string {
  if (!department && !batch) return "";
  if (!batch) return department ?? "";
  const yy = String(batch).slice(-2).padStart(2, "0");
  return department ? `${department}'${yy}` : `'${yy}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/** Trims and collapses internal whitespace, for normalizing free-text fields like company. */
export function normalizeText(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed.length ? trimmed : null;
}
