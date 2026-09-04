import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HeroSlideForm } from "@/components/admin/hero-slide-form";
import { updateHeroSlide } from "@/app/actions/home";

export default async function EditHeroSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  if (!slide) notFound();

  const boundAction = updateHeroSlide.bind(null, id);

  return (
    <div>
      <Link href="/admin/home" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Home Page
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-foreground">Edit Hero Slide</h1>
      <div className="mt-6">
        <HeroSlideForm action={boundAction} defaults={slide} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
