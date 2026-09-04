"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { cleanupImages, cleanupReplacedImage } from "@/lib/storage";
import { eventSchema } from "@/lib/validators";
import { z } from "zod";
import type { ActionResult } from "./alumni";

export async function createEvent(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = eventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const existing = await prisma.event.findUnique({ where: { slug: data.slug } });
  if (existing) return { ok: false, error: "An event with this slug already exists" };

  await prisma.event.create({
    data: { ...data, description: data.description || null, location: data.location || null, posterUrl: data.posterUrl || null },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { ok: true };
}

export async function updateEvent(id: string, _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = eventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const existing = await prisma.event.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) return { ok: false, error: "An event with this slug already exists" };

  const previous = await prisma.event.findUnique({ where: { id }, select: { posterUrl: true } });
  await prisma.event.update({
    where: { id },
    data: { ...data, description: data.description || null, location: data.location || null, posterUrl: data.posterUrl || null },
  });
  await cleanupReplacedImage(previous?.posterUrl, data.posterUrl || null);

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath(`/events/${data.slug}`);
  return { ok: true };
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  await requireAdmin();
  // Gallery photos cascade in the database; gather their files first.
  const event = await prisma.event.findUnique({
    where: { id },
    select: { posterUrl: true, photos: { select: { url: true } } },
  });
  await prisma.event.delete({ where: { id } });
  await cleanupImages(event?.posterUrl, ...(event?.photos ?? []).map((p) => p.url));
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { ok: true };
}

const photoSchema = z.object({
  eventId: z.string().min(1),
  url: z.string().url(),
  caption: z.string().trim().max(200).optional().or(z.literal("")),
});

export async function addEventPhoto(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = photoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const count = await prisma.eventPhoto.count({ where: { eventId: data.eventId } });
  await prisma.eventPhoto.create({
    data: { eventId: data.eventId, url: data.url, caption: data.caption || null, order: count },
  });

  revalidatePath(`/admin/events/${data.eventId}/photos`);
  revalidatePath("/events");
  return { ok: true };
}

export async function deleteEventPhoto(id: string): Promise<ActionResult> {
  await requireAdmin();
  const photo = await prisma.eventPhoto.findUnique({ where: { id }, select: { url: true } });
  await prisma.eventPhoto.delete({ where: { id } });
  await cleanupImages(photo?.url);
  revalidatePath("/events");
  return { ok: true };
}
