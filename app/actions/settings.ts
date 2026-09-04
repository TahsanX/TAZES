"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { cleanupReplacedImage } from "@/lib/storage";
import { siteSettingsSchema } from "@/lib/validators";
import type { ActionResult } from "./alumni";

export async function updateSiteSettings(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = siteSettingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const previous = await prisma.siteSettings.findUnique({ where: { id: "singleton" }, select: { logoUrl: true } });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      ...data,
      tagline: data.tagline || null,
      logoUrl: data.logoUrl || null,
      about: data.about || null,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address || null,
      facebook: data.facebook || null,
      youtube: data.youtube || null,
      footerNote: data.footerNote || null,
    },
    create: { id: "singleton", ...data },
  });

  await cleanupReplacedImage(previous?.logoUrl, data.logoUrl || null);

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { ok: true };
}
