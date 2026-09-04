import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { MapPin } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event || !event.published) return { title: "Event not found" };
  return {
    title: event.title,
    description:
      event.description?.slice(0, 155) ??
      `${event.title}${event.location ? ` — ${event.location}` : ""}`,
    openGraph: event.posterUrl ? { images: [{ url: event.posterUrl }] } : undefined,
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!event || !event.published) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {event.posterUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.posterUrl} alt={event.title} className="h-72 w-full rounded-xl object-cover" />
      )}
      <h1 className="mt-6 text-3xl font-bold text-foreground">{event.title}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span>{formatDate(event.date)}</span>
        {event.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {event.location}
          </span>
        )}
      </div>
      {event.description && <p className="mt-6 whitespace-pre-line text-foreground">{event.description}</p>}

      {event.photos.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-foreground">Photo Gallery</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {event.photos.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.id} src={p.url} alt={p.caption ?? event.title} className="aspect-square w-full rounded-lg object-cover" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
