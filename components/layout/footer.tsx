import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="font-semibold text-foreground">{settings.orgName}</h3>
          {settings.tagline && <p className="mt-2 text-sm text-muted-foreground">{settings.tagline}</p>}
        </div>
        <div className="text-sm text-muted-foreground">
          {settings.address && <p>{settings.address}</p>}
          {settings.phone && <p>{settings.phone}</p>}
          {settings.email && <p>{settings.email}</p>}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/alumni/register" className="text-primary hover:underline">
            Register as Alumni
          </Link>
          {settings.facebook && (
            <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
              Facebook
            </a>
          )}
          {settings.youtube && (
            <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
              YouTube
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        {settings.footerNote ?? `© ${new Date().getFullYear()} ${settings.orgName}. All rights reserved.`}
      </div>
    </footer>
  );
}
