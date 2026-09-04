import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { CertificateGenerator } from "@/components/admin/certificate-generator";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const certificates = await prisma.certificate.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Certificate Generator</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Fill in the details, preview the layout, then generate a permanently numbered PDF certificate.
      </p>

      <div className="mt-6">
        <CertificateGenerator />
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold text-foreground">Issue History</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="p-3">Cert No</th>
                <th className="p-3">Recipient</th>
                <th className="p-3">Event</th>
                <th className="p-3">Issue Date</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="p-3 font-mono text-xs">{c.certNo}</td>
                  <td className="p-3">{c.recipientName}</td>
                  <td className="p-3 text-muted-foreground">{c.eventName}</td>
                  <td className="p-3 text-muted-foreground">{formatDate(c.issueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {certificates.length === 0 && <p className="p-6 text-center text-muted-foreground">No certificates issued yet.</p>}
        </div>
      </div>
    </div>
  );
}
