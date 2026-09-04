import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

// Catches unmatched URLs and every notFound() call that isn't handled closer
// to the page — an unknown committee year, a deleted event slug.
export default function NotFound() {
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
