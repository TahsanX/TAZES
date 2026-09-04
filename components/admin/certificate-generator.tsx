"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Download, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { issueCertificate } from "@/app/actions/certificates";
import { formatDate } from "@/lib/format";
import {
  CERT_WIDTH,
  CERT_HEIGHT,
  drawCertificate,
  renderToCanvas,
  type CertificateData,
} from "@/lib/certificate-render";

type FormState = {
  eventName: string;
  recipientName: string;
  presidentName: string;
  secretaryName: string;
  issueDate: string; // yyyy-mm-dd
};

const today = new Date().toISOString().slice(0, 10);

export function CertificateGenerator() {
  const [form, setForm] = useState<FormState>({
    eventName: "",
    recipientName: "",
    presidentName: "",
    secretaryName: "",
    issueDate: today,
  });
  const [certNo, setCertNo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const previewRef = useRef<HTMLCanvasElement>(null);

  const data: CertificateData = {
    eventName: form.eventName,
    recipientName: form.recipientName,
    presidentName: form.presidentName,
    secretaryName: form.secretaryName,
    issueDate: form.issueDate ? formatDate(form.issueDate) : "",
    certNo: certNo ?? undefined,
  };

  // Live preview: redraws through the exact same function used for export.
  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const scale = 2; // device-pixel crispness for the on-screen preview
    canvas.width = CERT_WIDTH * scale;
    canvas.height = CERT_HEIGHT * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    drawCertificate(ctx, data);
  }, [form, certNo]); // eslint-disable-line react-hooks/exhaustive-deps

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setCertNo(null); // editing invalidates a previously issued number
  }

  const isComplete =
    form.eventName && form.recipientName && form.presidentName && form.secretaryName && form.issueDate;

  async function handleGenerate(format: "pdf" | "png") {
    setError(null);
    startTransition(async () => {
      const result = await issueCertificate(form);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setCertNo(result.certNo);

      const canvas = renderToCanvas({ ...data, certNo: result.certNo }, 3);
      const fileBase = `${(form.recipientName || "certificate").replace(/\s+/g, "-")}-${result.certNo}`;

      if (format === "png") {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${fileBase}.png`;
        link.click();
        return;
      }

      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.95),
        "JPEG",
        0,
        0,
        pdf.internal.pageSize.getWidth(),
        pdf.internal.pageSize.getHeight()
      );
      pdf.save(`${fileBase}.pdf`);
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
      <div className="space-y-4">
        <div>
          <Label htmlFor="eventName">Event Name *</Label>
          <Input id="eventName" value={form.eventName} onChange={(e) => update("eventName", e.target.value)} maxLength={200} />
        </div>
        <div>
          <Label htmlFor="recipientName">Recipient Name *</Label>
          <Input id="recipientName" value={form.recipientName} onChange={(e) => update("recipientName", e.target.value)} maxLength={120} />
        </div>
        <div>
          <Label htmlFor="presidentName">President Name *</Label>
          <Input id="presidentName" value={form.presidentName} onChange={(e) => update("presidentName", e.target.value)} maxLength={120} />
        </div>
        <div>
          <Label htmlFor="secretaryName">General Secretary Name *</Label>
          <Input id="secretaryName" value={form.secretaryName} onChange={(e) => update("secretaryName", e.target.value)} maxLength={120} />
        </div>
        <div>
          <Label htmlFor="issueDate">Issue Date *</Label>
          <Input id="issueDate" type="date" value={form.issueDate} onChange={(e) => update("issueDate", e.target.value)} />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-2">
          <Button type="button" className="flex-1" disabled={pending || !isComplete} onClick={() => void handleGenerate("pdf")}>
            <Download className="mr-2 h-4 w-4" />
            {pending ? "Generating..." : "Download PDF"}
          </Button>
          <Button type="button" variant="outline" disabled={pending || !isComplete} onClick={() => void handleGenerate("png")}>
            <ImageIcon className="mr-2 h-4 w-4" />
            PNG
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Generating assigns a permanent certificate number and records this issue in the history below.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        {/* The canvas scales to the container width, so the preview is never clipped. */}
        <canvas
          ref={previewRef}
          className="h-auto w-full rounded-lg shadow-sm"
          style={{ aspectRatio: `${CERT_WIDTH} / ${CERT_HEIGHT}` }}
        />
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Live preview — this is exactly what the downloaded file contains.
        </p>
      </div>
    </div>
  );
}
