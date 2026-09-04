import { Phone, Link2, Briefcase } from "lucide-react";
import type { PublicAlumni } from "@/lib/alumni-query";

export function AlumniCard({ alumni }: { alumni: PublicAlumni }) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
          {alumni.name.charAt(0)}
        </span>
        <div>
          <div className="font-semibold text-foreground">{alumni.name}</div>
          <div className="text-sm text-primary">{alumni.label}</div>
        </div>
      </div>
      {(alumni.currentPosition || alumni.company) && (
        <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
          <Briefcase className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {alumni.currentPosition}
            {alumni.currentPosition && alumni.company && " at "}
            {alumni.company}
          </span>
        </div>
      )}
      {(alumni.phone || alumni.facebook) && (
        <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3 text-sm">
          {alumni.phone && (
            <a href={`tel:${alumni.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <Phone className="h-3.5 w-3.5" /> {alumni.phone}
            </a>
          )}
          {alumni.facebook && (
            <a
              href={alumni.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Link2 className="h-3.5 w-3.5" /> Facebook
            </a>
          )}
        </div>
      )}
    </div>
  );
}
