import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export async function Navbar() {
  const settings = await getSiteSettings();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-foreground">
          {settings.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logoUrl} alt={settings.orgName} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
              {settings.orgName.charAt(0)}
            </span>
          )}
          <span>{settings.orgName}</span>
        </Link>
        <div className="flex items-center gap-3">
          <NavLinks />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
