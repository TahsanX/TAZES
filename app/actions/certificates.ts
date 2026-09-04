"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { certificateSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export type IssueCertificateResult =
  | { ok: true; certNo: string; issueDateIso: string }
  | { ok: false; error: string };

/**
 * Persists a new certificate record with a sequential per-year number
 * (ZS-{year}-{0001}) and returns it so the client can print it onto the PDF.
 * This is the one source of truth for "was this certificate actually issued" —
 * the PDF itself is just a rendering of this row.
 */
export async function issueCertificate(input: {
  eventName: string;
  recipientName: string;
  presidentName: string;
  secretaryName: string;
  issueDate: string;
}): Promise<IssueCertificateResult> {
  await requireAdmin();

  const parsed = certificateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;
  const year = data.issueDate.getFullYear();

  const count = await prisma.certificate.count({
    where: { certNo: { startsWith: `ZS-${year}-` } },
  });
  const certNo = `ZS-${year}-${String(count + 1).padStart(4, "0")}`;

  await prisma.certificate.create({
    data: { ...data, certNo },
  });

  revalidatePath("/admin/certificates");
  return { ok: true, certNo, issueDateIso: data.issueDate.toISOString() };
}
