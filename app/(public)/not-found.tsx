import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

/**
 * Handles notFound() raised anywhere in the public site — an unknown event
 * slug, an archived or non-existent committee year.
 *
 * This exists as well as the root app/not-found.tsx because a notFound() that
 * bubbles all the way to the root is rendered by Next in a bare
 * <html id="__next_error__"> document, which skips the root layout entirely.
 * That dropped the inline theme script, so those pages ignored the viewer's
 * saved theme and fell back to the system palette. Catching it here keeps the
 * page inside the normal layouts — correct theme, plus the nav and footer,
 * which is a better dead end anyway.
 */
export default function PublicNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">This page doesn&apos;t exist</h1>
      <p className="mt-3 text-muted-foreground">
        The link may be out of date, or the page may have been removed. These are still here:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          Go home
        </Link>
        <Link href="/alumni" className={buttonVariants({ variant: "outline" })}>
          Alumni Directory
        </Link>
        <Link href="/committee" className={buttonVariants({ variant: "outline" })}>
          Committee
        </Link>
      </div>
    </div>
  );
}
