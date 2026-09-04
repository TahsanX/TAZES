import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants, Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionRow } from "@/components/admin/section-row";
import { SectionConfigForm } from "@/components/admin/section-config-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteHeroSlide, deleteTeacherSpeech, updateHomeSectionConfig } from "@/app/actions/home";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [sections, heroSlides, speeches] = await Promise.all([
    prisma.homeSection.findMany({ orderBy: { order: "asc" } }),
    prisma.heroSlide.findMany({ orderBy: { order: "asc" } }),
    prisma.teacherSpeech.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Home Page</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Toggle sections on or off and reorder them. Changes reflect on the live homepage immediately.
        </p>
        <div className="mt-4 space-y-2">
          {sections.map((s, i) => (
            <div key={s.id}>
              <SectionRow
                id={s.id}
                label={s.label}
                enabled={s.enabled}
                isFirst={i === 0}
                isLast={i === sections.length - 1}
              />
              <div className="ml-1 mt-1">
                <SectionConfigForm
                  action={updateHomeSectionConfig.bind(null, s.id)}
                  config={(s.config as { heading?: string; subheading?: string; itemLimit?: number; autoplayMs?: number }) ?? {}}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Hero Carousel Slides</h2>
          <Link href="/admin/home/hero-slides/new" className={buttonVariants({ size: "sm" })}>
            <Plus className="mr-1 h-4 w-4" /> Add Slide
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {heroSlides.map((s) => (
            <div key={s.id} className="overflow-hidden rounded-xl border border-border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.imageUrl} alt={s.headline ?? ""} className="h-28 w-full object-cover" />
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{s.headline ?? "(no headline)"}</span>
                  {!s.enabled && <Badge variant="warning">Disabled</Badge>}
                </div>
                <div className="mt-2 flex gap-2">
                  <Link href={`/admin/home/hero-slides/${s.id}/edit`}>
                    <Button type="button" variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <DeleteButton action={deleteHeroSlide.bind(null, s.id)} confirmText="Remove this slide?" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {heroSlides.length === 0 && <p className="mt-4 text-sm text-muted-foreground">No slides yet.</p>}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Teacher Speeches</h2>
          <Link href="/admin/home/speeches/new" className={buttonVariants({ size: "sm" })}>
            <Plus className="mr-1 h-4 w-4" /> Add Speech
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {speeches.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
              <div>
                <div className="flex items-center gap-2 font-medium text-foreground">
                  {s.name}
                  {!s.published && <Badge variant="warning">Draft</Badge>}
                </div>
                <div className="text-sm text-muted-foreground">{[s.designation, s.institution].filter(Boolean).join(", ")}</div>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/home/speeches/${s.id}/edit`}>
                  <Button type="button" variant="ghost" size="sm">
                    Edit
                  </Button>
                </Link>
                <DeleteButton action={deleteTeacherSpeech.bind(null, s.id)} confirmText={`Remove ${s.name}'s speech?`} />
              </div>
            </div>
          ))}
        </div>
        {speeches.length === 0 && <p className="mt-4 text-sm text-muted-foreground">No speeches yet.</p>}
      </div>
    </div>
  );
}
