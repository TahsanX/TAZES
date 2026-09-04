"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Slide = {
  id: string;
  imageUrl: string;
  headline: string | null;
  subheadline: string | null;
  ctaText: string | null;
  ctaHref: string | null;
};

export function HeroCarousel({ slides, autoplayMs = 5000 }: { slides: Slide[]; autoplayMs?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1 || !autoplayMs) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), autoplayMs);
    return () => clearInterval(timer);
  }, [slides.length, autoplayMs]);

  if (slides.length === 0) return null;
  const slide = slides[index];

  return (
    <section className="relative h-[420px] w-full overflow-hidden bg-muted md:h-[520px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={slide.id}
        src={slide.imageUrl}
        alt={slide.headline ?? "Hero image"}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="relative mx-auto flex h-full max-w-6xl flex-col items-start justify-end px-4 pb-16 text-white">
        {slide.headline && <h1 className="max-w-2xl text-3xl font-bold md:text-5xl">{slide.headline}</h1>}
        {slide.subheadline && <p className="mt-3 max-w-xl text-base text-white/90 md:text-lg">{slide.subheadline}</p>}
        {slide.ctaText && slide.ctaHref && (
          <Link
            href={slide.ctaHref}
            className="mt-6 inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            {slide.ctaText}
          </Link>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn("h-2 w-2 rounded-full bg-white/50", i === index && "bg-white")}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
