import { generatePdfBuffer } from "@/lib/pdf/create-pdf-document";
import {
  RECEIPT_PAGE_SIZE,
  receiptTemplatePath,
  type ReceiptTemplateKind,
} from "@/lib/pdf/receipt-templates";

type OverlayField = {
  x: number;
  y: number;
  text: string;
  size?: number;
  width?: number;
  align?: "left" | "center" | "right";
  bold?: boolean;
};

type BottomBox = {
  x: number;
  y: number;
  width: number;
  value: string;
};

export type IdentityOverlayData = {
  name: string;
  address: string;
  lines: OverlayField[];
  bottomBoxes: BottomBox[];
  qrUrl?: string;
};

async function tryGenerateQrBuffer(url: string): Promise<Buffer | null> {
  try {
    const QRCode = await import("qrcode");
    return await QRCode.toBuffer(url, {
      margin: 0,
      width: 120,
      errorCorrectionLevel: "M",
    });
  } catch {
    return null;
  }
}

function drawField(doc: PDFKit.PDFDocument, field: OverlayField) {
  const size = field.size ?? 11;
  doc
    .font(field.bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(size)
    .fillColor("#1a1a1a");

  const options: PDFKit.Mixins.TextOptions = {
    width: field.width,
    align: field.align ?? "left",
    lineBreak: false,
  };

  doc.text(field.text, field.x, field.y, options);
}

function drawBottomBox(doc: PDFKit.PDFDocument, box: BottomBox) {
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#1a1a1a")
    .text(box.value, box.x, box.y, { width: box.width, align: "center", lineBreak: false });
}

export async function generateIdentityReceiptPdf(
  kind: ReceiptTemplateKind,
  data: IdentityOverlayData,
): Promise<Buffer> {
  const templatePath = receiptTemplatePath(kind);
  const qrBuffer = data.qrUrl ? await tryGenerateQrBuffer(data.qrUrl) : null;

  return generatePdfBuffer(
    (doc) => {
      doc.image(templatePath, 0, 0, { width: RECEIPT_PAGE_SIZE[0], height: RECEIPT_PAGE_SIZE[1] });

      doc.font("Helvetica-Bold").fontSize(13).fillColor("#1a1a1a");
      doc.text(data.name, 195, 148, { width: 500, lineBreak: false });

      doc.font("Helvetica").fontSize(10).fillColor("#334155");
      doc.text(data.address, 195, 168, { width: 500, lineBreak: false });

      for (const line of data.lines) {
        drawField(doc, line);
      }

      for (const box of data.bottomBoxes) {
        drawBottomBox(doc, box);
      }

      if (qrBuffer) {
        doc.image(qrBuffer, 888, 175, { width: 72, height: 72 });
      }
    },
    { size: RECEIPT_PAGE_SIZE, margin: 0 },
  );
}
