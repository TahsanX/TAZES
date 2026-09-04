export function SectionHeading({ heading, subheading }: { heading?: string; subheading?: string }) {
  if (!heading && !subheading) return null;
  return (
    <div className="mx-auto max-w-2xl text-center">
      {heading && <h2 className="text-2xl font-bold text-foreground md:text-3xl">{heading}</h2>}
      {subheading && <p className="mt-2 text-muted-foreground">{subheading}</p>}
    </div>
  );
}
