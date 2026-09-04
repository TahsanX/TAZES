"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { cleanupImages, cleanupReplacedImage } from "@/lib/storage";
import { achievementSchema } from "@/lib/validators";
import type { ActionResult } from "./alumni";

export async function createAchievement(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = achievementSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  await prisma.achievement.create({
    data: { ...data, description: data.description || null, imageUrl: data.imageUrl || null, category: data.category || null },
  });

  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  revalidatePath("/");
  redirect("/admin/achievements");
}

export async function updateAchievement(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = achievementSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const previous = await prisma.achievement.findUnique({ where: { id }, select: { imageUrl: true } });
  await prisma.achievement.update({
    where: { id },
    data: { ...data, description: data.description || null, imageUrl: data.imageUrl || null, category: data.category || null },
  });
  await cleanupReplacedImage(previous?.imageUrl, data.imageUrl || null);

  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  revalidatePath("/");
  redirect("/admin/achievements");
}

export async function deleteAchievement(id: string): Promise<ActionResult> {
  await requireAdmin();
  const achievement = await prisma.achievement.findUnique({ where: { id }, select: { imageUrl: true } });
  await prisma.achievement.delete({ where: { id } });
  await cleanupImages(achievement?.imageUrl);
  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  revalidatePath("/");
  return { ok: true };
}
