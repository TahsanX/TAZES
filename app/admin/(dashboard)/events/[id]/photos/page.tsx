import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AddPhotoForm } from "@/components/admin/add-photo-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteEventPhoto } from "@/app/actions/events";

export const dynamic = "force-dynamic";

export default async function EventPhotosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });
  if (!event) notFound();

  return (
    <div>
      <Link href="/admin/events" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-foreground">{event.title} — Photo Gallery</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Photos ({event.photos.length})</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {event.photos.map((p) => (
              <div key={p.id} className="group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.caption ?? ""} className="aspect-square w-full rounded-lg object-cover" />
                <div className="absolute right-1 top-1">
                  <DeleteButton action={deleteEventPhoto.bind(null, p.id)} confirmText="Remove this photo?" />
                </div>
              </div>
            ))}
          </div>
          {event.photos.length === 0 && <p className="mt-4 text-sm text-muted-foreground">No photos yet.</p>}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">Add Photo</h2>
          <div className="mt-4 rounded-xl border border-border bg-card p-5">
            <AddPhotoForm eventId={event.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
