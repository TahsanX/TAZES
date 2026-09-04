import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPublicCommitteeYears } from "@/lib/committee";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Committee",
  description: "The executive committee currently serving the association.",
};

export default async function CommitteeIndexPage() {
  // Only redirect somewhere the public is allowed to go. A committee flagged
  // isCurrent but since overtaken by newer years must not become a back door
  // into an archived page.
  const publicYears = await getPublicCommitteeYears();

  const current = await prisma.committeeYear.findFirst({ where: { isCurrent: true } });
  if (current && publicYears.includes(current.year)) redirect(`/committee/${current.year}`);

  if (publicYears.length > 0) redirect(`/committee/${publicYears[0]}`);

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">No committee has been published yet</h1>
      <p className="mt-2 text-muted-foreground">Please check back later.</p>
    </div>
  );
}
