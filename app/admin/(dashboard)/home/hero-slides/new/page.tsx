import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HeroSlideForm } from "@/components/admin/hero-slide-form";
import { createHeroSlide } from "@/app/actions/home";

export default function NewHeroSlidePage() {
  return (
    <div>
      <Link href="/admin/home" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Home Page
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-foreground">Add Hero Slide</h1>
      <div className="mt-6">
        <HeroSlideForm action={createHeroSlide} submitLabel="Create" />
      </div>
    </div>
  );
}
