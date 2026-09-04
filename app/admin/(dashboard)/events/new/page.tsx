import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "@/components/admin/event-form";
import { createEvent } from "@/app/actions/events";

export default function NewEventPage() {
  return (
    <div>
      <Link href="/admin/events" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-foreground">Add Event</h1>
      <div className="mt-6">
        <EventForm action={createEvent} submitLabel="Create" />
      </div>
    </div>
  );
}
