import { prisma } from "@/lib/prisma";
import { HeroCarousel } from "./hero-carousel";

export async function HeroSection({ config }: { config: { autoplayMs?: number } }) {
  const slides = await prisma.heroSlide.findMany({ where: { enabled: true }, orderBy: { order: "asc" } });
  if (slides.length === 0) return null;
  return <HeroCarousel slides={slides} autoplayMs={config.autoplayMs ?? 5000} />;
}
