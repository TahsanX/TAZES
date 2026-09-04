import { prisma } from "@/lib/prisma";
import { SectionHeading } from "./section-heading";

export async function TeacherSpeeches({ config }: { config: { heading?: string; subheading?: string; itemLimit?: number } }) {
  const speeches = await prisma.teacherSpeech.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: config.itemLimit ?? 6,
  });

  if (speeches.length === 0) return null;

  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading heading={config.heading ?? "Words from Our Teachers"} subheading={config.subheading} />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {speeches.map((s) => (
            <blockquote key={s.id} className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="flex-1 text-sm italic text-foreground">&ldquo;{s.message}&rdquo;</p>
              <footer className="mt-4 flex items-center gap-3">
                {s.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.imageUrl} alt={s.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {s.name.charAt(0)}
                  </span>
                )}
                <div>
                  <div className="text-sm font-semibold text-foreground">{s.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {[s.designation, s.institution].filter(Boolean).join(", ")}
                  </div>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
