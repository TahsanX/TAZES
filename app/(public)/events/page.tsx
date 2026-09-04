import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { MapPin } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Reunions, freshers' receptions, and gatherings through the year — with photos from the ones already behind us.",
};

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">Events</h1>
      <p className="mt-2 text-muted-foreground">Reunions, receptions, and gatherings across the year.</p>

      {events.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">No events published yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {events.map((e) => (
            <Link
              key={e.id}
              href={`/events/${e.slug}`}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              {e.posterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.posterUrl} alt={e.title} className="h-48 w-full object-cover" />
              ) : (
                <div className="h-48 w-full bg-gradient-to-br from-primary/20 to-accent/20" />
              )}
              <div className="p-5">
                <h3 className="font-semibold text-foreground">{e.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{formatDate(e.date)}</p>
                {e.location && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {e.location}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
