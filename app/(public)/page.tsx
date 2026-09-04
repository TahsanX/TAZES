import { prisma } from "@/lib/prisma";
import { SECTION_COMPONENTS, type SectionConfig } from "@/components/home/registry";
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
        return <Component key={section.id} config={(section.config as SectionConfig) ?? {}} />;
      })}
    </>
  );
}
