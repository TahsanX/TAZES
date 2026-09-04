import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/admin/sidebar";
import { ThemeSync } from "@/components/layout/theme-sync";

/*
 * Admin pages are per-request and auth-gated, so there is nothing to prerender.
 * Without this, `next build` tries to statically render every admin route in
 * parallel and exhausts the Supabase session pooler's client limit.
 */
export const dynamic = "force-dynamic";

// The admin panel must never appear in search results.
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pendingCount = await prisma.alumni.count({ where: { status: "PENDING" } });

  return (
    <div className="flex min-h-screen bg-muted/30">
      <ThemeSync />
      <Sidebar pendingCount={pendingCount} />
      <main className="flex-1 overflow-x-hidden p-6 md:p-8">{children}</main>
    </div>
  );
}
