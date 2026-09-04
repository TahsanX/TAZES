import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [alumniApproved, alumniPending, committeeYears, achievements, events, certificates] = await Promise.all([
    prisma.alumni.count({ where: { status: "APPROVED" } }),
    prisma.alumni.count({ where: { status: "PENDING" } }),
    prisma.committeeYear.count(),
    prisma.achievement.count(),
    prisma.event.count(),
    prisma.certificate.count(),
  ]);

  const cards = [
    { label: "Approved Alumni", value: alumniApproved, href: "/admin/alumni" },
    { label: "Pending Approvals", value: alumniPending, href: "/admin/alumni/pending", highlight: alumniPending > 0 },
    { label: "Committee Years", value: committeeYears, href: "/admin/committee" },
    { label: "Achievements", value: achievements, href: "/admin/achievements" },
    { label: "Events", value: events, href: "/admin/events" },
    { label: "Certificates Issued", value: certificates, href: "/admin/certificates" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Overview of your site content.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card className={c.highlight ? "border-accent" : ""}>
              <CardHeader>
                <CardTitle className="text-3xl">{c.value}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{c.label}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
