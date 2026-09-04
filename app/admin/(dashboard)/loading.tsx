/*
 * Deliberate trade-off: this skeleton streams the response, so notFound() in a
 * child route (an unknown event id, a missing committee year) renders the 404
 * UI with a 200 status instead of 404. That matters on public pages — it is why
 * the public skeletons are scoped per-segment — but the admin panel is
 * noindex'd and navigated by hand, so no crawler or client reads the status,
 * and the perceived-speed win on every admin navigation is worth more here.
 */
export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-56 rounded-lg bg-muted" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl border border-border bg-card" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
