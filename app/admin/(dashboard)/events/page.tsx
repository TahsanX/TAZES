import Link from "next/link";
import { Plus, Images } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { buttonVariants, Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteEvent } from "@/app/actions/events";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    include: { _count: { select: { photos: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Events</h1>
        <Link href="/admin/events/new" className={buttonVariants({})}>
          <Plus className="mr-1 h-4 w-4" /> Add Event
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {events.map((e) => (
          <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
            <div>
              <div className="flex items-center gap-2 font-medium text-foreground">
                {e.title}
                {!e.published && <Badge variant="warning">Draft</Badge>}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(e.date)} {e.location && `· ${e.location}`} · {e._count.photos} photos
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/events/${e.id}/photos`}>
                <Button type="button" variant="outline" size="sm">
                  <Images className="mr-1 h-4 w-4" /> Photos
                </Button>
              </Link>
              <Link href={`/admin/events/${e.id}/edit`}>
                <Button type="button" variant="ghost" size="sm">
                  Edit
                </Button>
              </Link>
              <DeleteButton action={deleteEvent.bind(null, e.id)} confirmText={`Delete "${e.title}"?`} />
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No events yet.
          </p>
        )}
      </div>
    </div>
  );
}
