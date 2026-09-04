"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { cleanupImages, cleanupReplacedImage } from "@/lib/storage";
import { committeeYearSchema, committeeMemberSchema } from "@/lib/validators";
import type { ActionResult } from "./alumni";

export async function createCommitteeYear(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = committeeYearSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  if (data.isCurrent) {
    await prisma.committeeYear.updateMany({ data: { isCurrent: false } });
  }
  await prisma.committeeYear.create({ data: { ...data, summary: data.summary || null } });

  revalidatePath("/admin/committee");
  revalidatePath("/committee");
  redirect("/admin/committee");
}

export async function updateCommitteeYear(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = committeeYearSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  if (data.isCurrent) {
    await prisma.committeeYear.updateMany({ data: { isCurrent: false } });
  }
  await prisma.committeeYear.update({ where: { id }, data: { ...data, summary: data.summary || null } });

  revalidatePath("/admin/committee");
  revalidatePath("/committee");
  redirect(`/admin/committee/${data.year}`);
}

export async function deleteCommitteeYear(id: string): Promise<ActionResult> {
  await requireAdmin();
  // Members cascade in the database, but their photos live in object storage
  // and have to be collected before the rows disappear.
  const members = await prisma.committeeMember.findMany({
    where: { committeeYearId: id },
    select: { imageUrl: true },
  });
  await prisma.committeeYear.delete({ where: { id } });
  await cleanupImages(...members.map((m) => m.imageUrl));
  revalidatePath("/admin/committee");
  revalidatePath("/committee");
  return { ok: true };
}

export async function createCommitteeMember(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = committeeMemberSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  await prisma.committeeMember.create({
    data: { ...data, imageUrl: data.imageUrl || null, department: data.department || null },
  });

  revalidatePath("/admin/committee");
  revalidatePath("/committee");
  return { ok: true };
}

export async function updateCommitteeMember(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = committeeMemberSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const previous = await prisma.committeeMember.findUnique({
    where: { id },
    select: { imageUrl: true, committeeYear: { select: { year: true } } },
  });
  await prisma.committeeMember.update({
    where: { id },
    data: { ...data, imageUrl: data.imageUrl || null, department: data.department || null },
  });
  await cleanupReplacedImage(previous?.imageUrl, data.imageUrl || null);

  revalidatePath("/admin/committee");
  revalidatePath("/committee");
  if (previous?.committeeYear.year !== undefined) {
    redirect(`/admin/committee/${previous.committeeYear.year}`);
  }
  return { ok: true };
}

export async function deleteCommitteeMember(id: string): Promise<ActionResult> {
  await requireAdmin();
  const member = await prisma.committeeMember.findUnique({ where: { id }, select: { imageUrl: true } });
  await prisma.committeeMember.delete({ where: { id } });
  await cleanupImages(member?.imageUrl);
  revalidatePath("/admin/committee");
  revalidatePath("/committee");
  return { ok: true };
}
