import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Committee",
  description: "The executive committee currently serving the association.",
};

export default async function CommitteeIndexPage() {
  const current = await prisma.committeeYear.findFirst({ where: { isCurrent: true } });
  if (current) redirect(`/committee/${current.year}`);

  const latest = await prisma.committeeYear.findFirst({ orderBy: { year: "desc" } });
  if (latest) redirect(`/committee/${latest.year}`);

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">No committee has been published yet</h1>
      <p className="mt-2 text-muted-foreground">Please check back later.</p>
    </div>
  );
}
