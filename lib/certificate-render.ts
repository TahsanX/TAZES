/**
 * Single source of truth for certificate rendering.
 *
 * Both the on-screen preview and the exported PDF call this same function, so
 * what the admin sees is exactly what gets printed. It draws with the Canvas 2D
 * API rather than rasterizing DOM (html2canvas), because html2canvas measures
 * text using font metrics that differ from the font actually used when a
 * webfont is missing, which made glyphs overlap.
 *
 * All coordinates are in "design units" on a 1123x794 canvas (A4 landscape at
 * 96dpi). The caller scales the context, so one layout works at any resolution.
 */

export const CERT_WIDTH = 1123;
export const CERT_HEIGHT = 794;

export type CertificateData = {
  eventName: string;
  recipientName: string;
  presidentName: string;
  secretaryName: string;
  issueDate: string; // already formatted for display
  certNo?: string;
};

const COLORS = {
  paper: "#fffdf7",
  frame: "#0f6b4c",
  accent: "#f0b429",
  ink: "#1a2e22",
  muted: "#5b6b63",
};

// Generic families are used deliberately: they resolve on every platform, so
// the certificate never silently falls back to metrics we did not design for.
const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS = "Helvetica, Arial, sans-serif";

function centerText(ctx: CanvasRenderingContext2D, text: string, y: number) {
  ctx.textAlign = "center";
  ctx.fillText(text, CERT_WIDTH / 2, y);
}

/** Wraps text to fit maxWidth, returning the y position after the last line. */
function wrapCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);

  lines.forEach((l, i) => centerText(ctx, l, y + i * lineHeight));
  return y + (lines.length - 1) * lineHeight;
}

/** Draws a signature block: rule, name above it, role beneath. */
function signatureBlock(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  baselineY: number,
  name: string,
  role: string
) {
  const halfWidth = 130;

  ctx.font = `italic 30px ${SERIF}`;
  ctx.fillStyle = COLORS.ink;
  ctx.textAlign = "center";
  ctx.fillText(name || "—", centerX, baselineY - 12);

  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - halfWidth, baselineY);
  ctx.lineTo(centerX + halfWidth, baselineY);
  ctx.stroke();

  ctx.font = `13px ${SANS}`;
  ctx.fillStyle = COLORS.muted;
  ctx.fillText(role, centerX, baselineY + 24);
}

export function drawCertificate(ctx: CanvasRenderingContext2D, data: CertificateData) {
  const W = CERT_WIDTH;
  const H = CERT_HEIGHT;

  // Paper
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(0, 0, W, H);

  // Outer green frame
  ctx.fillStyle = COLORS.frame;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(16, 16, W - 32, H - 32);

  // Inner gold rule
  ctx.strokeStyle = COLORS.accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(34, 34, W - 68, H - 68);

  ctx.textBaseline = "alphabetic";

  // Certificate number, top right
  if (data.certNo) {
    ctx.font = `13px ${SANS}`;
    ctx.fillStyle = COLORS.muted;
    ctx.textAlign = "right";
    ctx.fillText(data.certNo, W - 60, 72);
  }

  // Organisation eyebrow
  ctx.font = `15px ${SANS}`;
  ctx.fillStyle = COLORS.muted;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "6px";
  centerText(ctx, "ZILLA SHOMITI", 150);
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";

  // Title
  ctx.font = `bold 52px ${SERIF}`;
  ctx.fillStyle = COLORS.frame;
  centerText(ctx, "Certificate of Appreciation", 235);

  // Presented-to line
  ctx.font = `18px ${SANS}`;
  ctx.fillStyle = COLORS.muted;
  centerText(ctx, "This certificate is proudly presented to", 300);

  // Recipient name + underline
  ctx.font = `italic 46px ${SERIF}`;
  ctx.fillStyle = COLORS.ink;
  centerText(ctx, data.recipientName || "Recipient Name", 380);

  ctx.strokeStyle = COLORS.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 300, 400);
  ctx.lineTo(W / 2 + 300, 400);
  ctx.stroke();

  // Citation
  ctx.font = `17px ${SANS}`;
  ctx.fillStyle = COLORS.ink;
  centerText(ctx, "for their valued participation and contribution to", 450);

  ctx.font = `bold 24px ${SERIF}`;
  ctx.fillStyle = COLORS.frame;
  wrapCenteredText(ctx, data.eventName || "Event Name", 492, W - 320, 34);

  // Signatures
  signatureBlock(ctx, W / 2 - 220, 640, data.presidentName, "President");
  signatureBlock(ctx, W / 2 + 220, 640, data.secretaryName, "General Secretary");

  // Issue date
  ctx.font = `13px ${SANS}`;
  ctx.fillStyle = COLORS.muted;
  centerText(ctx, data.issueDate ? `Issued on ${data.issueDate}` : "", 730);
}

/** Renders the certificate to an offscreen canvas at the given pixel scale. */
export function renderToCanvas(data: CertificateData, scale = 3): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = CERT_WIDTH * scale;
  canvas.height = CERT_HEIGHT * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.scale(scale, scale);
  drawCertificate(ctx, data);
  return canvas;
}
