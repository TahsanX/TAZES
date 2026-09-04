import { prisma } from "@/lib/prisma";

const FALLBACK = {
  id: "singleton",
  orgName: "Zilla Shomiti",
  tagline: null as string | null,
  logoUrl: null as string | null,
  about: null as string | null,
  email: null as string | null,
  phone: null as string | null,
  address: null as string | null,
  facebook: null as string | null,
  youtube: null as string | null,
  footerNote: null as string | null,
};

/** Reads the singleton SiteSettings row, falling back to sane defaults if it hasn't been created yet. */
export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    return settings ?? FALLBACK;
  } catch {
    // Falls back to defaults if the database is unreachable (e.g. during a
    // build with no DATABASE_URL configured yet), so metadata generation and
    // the shell never hard-crash the whole site over a DB hiccup.
    return FALLBACK;
  }
}
