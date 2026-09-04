"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { alumniRegisterSchema, alumniAdminSchema } from "@/lib/validators";
import { normalizeText } from "@/lib/format";
import { checkRateLimit } from "@/lib/rate-limit";

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Public self-registration. Regardless of what a crafted request submits,
 * status is forced to PENDING and both visibility toggles are forced to
 * false — a self-registered record can never publish its own phone/Facebook
 * or approve itself. Submissions are rate limited per IP so the approval
 * queue cannot be flooded by a script.
 */
export async function registerAlumni(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const limit = await checkRateLimit("alumni-register");
  if (!limit.allowed) {
    return {
      ok: false,
      error: `Too many registrations from this network. Please try again in ${limit.retryAfterMinutes} minute${limit.retryAfterMinutes === 1 ? "" : "s"}.`,
    };
  }

  const parsed = alumniRegisterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  await prisma.alumni.create({
    data: {
      name: data.name,
      department: data.department,
      batch: data.batch,
      currentPosition: normalizeText(data.currentPosition),
      company: normalizeText(data.company),
      phone: normalizeText(data.phone),
      facebook: normalizeText(data.facebook),
      email: normalizeText(data.email),
      showPhone: false,
      showFacebook: false,
      status: "PENDING",
    },
  });

  revalidatePath("/admin/alumni/pending");
  return { ok: true };
}

export async function createAlumniAdmin(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = alumniAdminSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  await prisma.alumni.create({
    data: {
      ...data,
      company: normalizeText(data.company),
      currentPosition: normalizeText(data.currentPosition),
      phone: normalizeText(data.phone),
      facebook: normalizeText(data.facebook),
      email: normalizeText(data.email),
    },
  });

  revalidatePath("/admin/alumni");
  revalidatePath("/alumni");
  redirect("/admin/alumni");
}

export async function updateAlumniAdmin(id: string, _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = alumniAdminSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  await prisma.alumni.update({
    where: { id },
    data: {
      ...data,
      company: normalizeText(data.company),
      currentPosition: normalizeText(data.currentPosition),
      phone: normalizeText(data.phone),
      facebook: normalizeText(data.facebook),
      email: normalizeText(data.email),
    },
  });

  revalidatePath("/admin/alumni");
  revalidatePath("/admin/alumni/pending");
  revalidatePath("/alumni");
  redirect("/admin/alumni");
}

export async function deleteAlumniAdmin(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.alumni.delete({ where: { id } });
  revalidatePath("/admin/alumni");
  revalidatePath("/alumni");
  return { ok: true };
}

export async function setAlumniStatus(id: string, status: "APPROVED" | "REJECTED"): Promise<ActionResult> {
  await requireAdmin();
  await prisma.alumni.update({ where: { id }, data: { status } });
  revalidatePath("/admin/alumni/pending");
  revalidatePath("/admin/alumni");
  revalidatePath("/alumni");
  return { ok: true };
}

export async function toggleAlumniVisibility(
  id: string,
  field: "showPhone" | "showFacebook",
  value: boolean
): Promise<ActionResult> {
  await requireAdmin();
  await prisma.alumni.update({ where: { id }, data: { [field]: value } });
  revalidatePath("/admin/alumni");
  revalidatePath("/alumni");
  return { ok: true };
}
