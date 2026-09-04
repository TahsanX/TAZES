import "server-only";
import { headers } from "next/headers";

/**
 * Fixed-window, in-memory rate limiter for the one public write endpoint.
 *
 * Scope and limits, stated plainly: this counter lives in the process, so each
 * serverless instance keeps its own tally and a restart clears it. It is meant
 * to stop a single script from flooding the approval queue, not to withstand a
 * distributed attack. If registration volume ever justifies it, swap the Map
 * for Upstash Redis behind this same interface — no caller changes.
 */

type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();

const MAX_REQUESTS = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

/** Drops expired windows so the Map cannot grow without bound. */
function sweep(now: number) {
  for (const [key, window] of buckets) {
    if (window.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Identifies the caller. Vercel sets x-forwarded-for; the leftmost entry is the
 * client. Falls back to a shared bucket when no header is present (local dev),
 * which is stricter rather than more permissive — the safe direction to fail.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterMinutes: number };

export async function checkRateLimit(
  action: string,
  max: number = MAX_REQUESTS,
  windowMs: number = WINDOW_MS
): Promise<RateLimitResult> {
  const now = Date.now();
  if (buckets.size > 500) sweep(now);

  const key = `${action}:${await getClientIp()}`;
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (existing.count >= max) {
    return { allowed: false, retryAfterMinutes: Math.max(1, Math.ceil((existing.resetAt - now) / 60000)) };
  }

  existing.count += 1;
  return { allowed: true };
}

/** Test-only hook so a suite can start from a clean slate. */
export function __resetRateLimits() {
  buckets.clear();
}
