import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { SECTION_COMPONENTS, type SectionConfig } from "@/components/home/registry";
import { SECTION_SKELETONS } from "@/components/home/section-skeletons";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
  description:
    "The district association bringing together students, alumni, and teachers — our committee, our achievements, and the people behind them.",
};

export default async function HomePage() {
  const sections = await prisma.homeSection.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      {sections.map((section) => {
        const Component = SECTION_COMPONENTS[section.key];
        if (!Component) return null;
        const Fallback = SECTION_SKELETONS[section.key];
        // Each section fetches its own data, so giving each its own boundary
        // lets the fast ones paint immediately instead of the whole page
        // waiting on the slowest query.
        return (
          <Suspense key={section.id} fallback={Fallback ? <Fallback /> : null}>
            <Component config={(section.config as SectionConfig) ?? {}} />
          </Suspense>
        );
      })}
    </>
  );
}
