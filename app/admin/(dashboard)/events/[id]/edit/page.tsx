import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EventForm } from "@/components/admin/event-form";
import { updateEvent } from "@/app/actions/events";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  const boundAction = updateEvent.bind(null, id);

  return (
    <div>
      <Link href="/admin/events" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-foreground">Edit Event</h1>
      <div className="mt-6">
        <EventForm action={boundAction} defaults={event} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
