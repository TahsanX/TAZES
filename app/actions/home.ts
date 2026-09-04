"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma";
import { requireAdmin } from "@/lib/auth";
import { cleanupImages, cleanupReplacedImage } from "@/lib/storage";
import { heroSlideSchema, teacherSpeechSchema } from "@/lib/validators";
import type { ActionResult } from "./alumni";

export async function toggleHomeSection(id: string, enabled: boolean): Promise<ActionResult> {
  await requireAdmin();
  await prisma.homeSection.update({ where: { id }, data: { enabled } });
  revalidatePath("/admin/home");
  revalidatePath("/");
  return { ok: true };
}

export async function moveHomeSection(id: string, direction: "up" | "down"): Promise<ActionResult> {
  await requireAdmin();
  const sections = await prisma.homeSection.findMany({ orderBy: { order: "asc" } });
  const index = sections.findIndex((s) => s.id === id);
  if (index === -1) return { ok: false, error: "Section not found" };

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= sections.length) return { ok: true };

  const a = sections[index];
  const b = sections[swapWith];

  await prisma.$transaction([
    prisma.homeSection.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.homeSection.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);

  revalidatePath("/admin/home");
  revalidatePath("/");
  return { ok: true };
}

export async function updateHomeSectionConfig(id: string, _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const heading = (formData.get("heading") as string) || undefined;
  const subheading = (formData.get("subheading") as string) || undefined;
  const itemLimitRaw = formData.get("itemLimit") as string;
  const autoplayMsRaw = formData.get("autoplayMs") as string;

  const config: Record<string, unknown> = {};
  if (heading) config.heading = heading;
  if (subheading) config.subheading = subheading;
  if (itemLimitRaw) config.itemLimit = Number(itemLimitRaw);
  if (autoplayMsRaw) config.autoplayMs = Number(autoplayMsRaw);

  await prisma.homeSection.update({ where: { id }, data: { config: config as Prisma.InputJsonValue } });
  revalidatePath("/admin/home");
  revalidatePath("/");
  return { ok: true };
}

// Hero slides
export async function createHeroSlide(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = heroSlideSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;
  await prisma.heroSlide.create({
    data: { ...data, headline: data.headline || null, subheadline: data.subheadline || null, ctaText: data.ctaText || null, ctaHref: data.ctaHref || null },
  });
  revalidatePath("/admin/home");
  revalidatePath("/");
  return { ok: true };
}

export async function updateHeroSlide(id: string, _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = heroSlideSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;
  const previous = await prisma.heroSlide.findUnique({ where: { id }, select: { imageUrl: true } });
  await prisma.heroSlide.update({
    where: { id },
    data: { ...data, headline: data.headline || null, subheadline: data.subheadline || null, ctaText: data.ctaText || null, ctaHref: data.ctaHref || null },
  });
  await cleanupReplacedImage(previous?.imageUrl, data.imageUrl);
  revalidatePath("/admin/home");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteHeroSlide(id: string): Promise<ActionResult> {
  await requireAdmin();
  const slide = await prisma.heroSlide.findUnique({ where: { id }, select: { imageUrl: true } });
  await prisma.heroSlide.delete({ where: { id } });
  await cleanupImages(slide?.imageUrl);
  revalidatePath("/admin/home");
  revalidatePath("/");
  return { ok: true };
}

// Teacher speeches
export async function createTeacherSpeech(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = teacherSpeechSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;
  await prisma.teacherSpeech.create({
    data: { ...data, designation: data.designation || null, institution: data.institution || null, imageUrl: data.imageUrl || null },
  });
  revalidatePath("/admin/home");
  revalidatePath("/");
  return { ok: true };
}

export async function updateTeacherSpeech(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = teacherSpeechSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;
  const previous = await prisma.teacherSpeech.findUnique({ where: { id }, select: { imageUrl: true } });
  await prisma.teacherSpeech.update({
    where: { id },
    data: { ...data, designation: data.designation || null, institution: data.institution || null, imageUrl: data.imageUrl || null },
  });
  await cleanupReplacedImage(previous?.imageUrl, data.imageUrl || null);
  revalidatePath("/admin/home");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteTeacherSpeech(id: string): Promise<ActionResult> {
  await requireAdmin();
  const speech = await prisma.teacherSpeech.findUnique({ where: { id }, select: { imageUrl: true } });
  await prisma.teacherSpeech.delete({ where: { id } });
  await cleanupImages(speech?.imageUrl);
  revalidatePath("/admin/home");
  revalidatePath("/");
  return { ok: true };
}
