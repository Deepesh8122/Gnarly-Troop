import PDFDocument from "pdfkit";

export type DonationReceiptData = {
  donorName: string;
  email: string;
  amountPaise: number;
  merchantTransactionId: string;
  organization?: string | null;
  state?: string | null;
  district?: string | null;
  createdAt?: string | null;
  phonepeTransactionId?: string | null;
};

function formatInr(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export async function generateDonationReceiptPdf(data: DonationReceiptData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      const dateStr = data.createdAt
        ? new Date(data.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-IN");

      doc
        .fillColor("#5f259f")
        .fontSize(22)
        .text("Gnarly Troop Global Federation", { align: "center" })
        .moveDown(0.3);
      doc.fillColor("#334155").fontSize(14).text("Donation Acknowledgement", { align: "center" });
      doc.moveDown(1.5);

      doc.fillColor("#0f172a").fontSize(16).text(`Dear ${data.donorName},`, { align: "left" });
      doc.moveDown(0.5);
      doc
        .fillColor("#475569")
        .fontSize(12)
        .text(
          "Thank you for your generous contribution to Gnarly Troop Global Federation. " +
            "Your support helps us advance youth leadership, cultural exchange, and community programs across India.",
          { align: "left", lineGap: 4 },
        );
      doc.moveDown(1.2);

      doc.fillColor("#0f172a").fontSize(13).text("Donor details", { underline: true });
      doc.moveDown(0.4);
      doc.fillColor("#334155").fontSize(11);
      doc.text(`Name: ${data.donorName}`);
      doc.text(`Email: ${data.email}`);
      if (data.organization) doc.text(`Organization: ${data.organization}`);
      if (data.state) doc.text(`State: ${data.state}`);
      if (data.district) doc.text(`District: ${data.district}`);
      doc.moveDown(1);

      doc.fillColor("#0f172a").fontSize(13).text("Payment details", { underline: true });
      doc.moveDown(0.4);
      doc.fillColor("#334155").fontSize(11);
      doc.text(`Amount: ${formatInr(data.amountPaise)}`);
      doc.text(`Date: ${dateStr}`);
      doc.text(`Reference: ${data.merchantTransactionId}`);
      if (data.phonepeTransactionId) doc.text(`PhonePe ID: ${data.phonepeTransactionId}`);
      doc.text("Status: Payment successful");
      doc.moveDown(1.5);

      doc
        .fillColor("#64748b")
        .fontSize(10)
        .text(
          "This acknowledgement is issued for your records. For 80G tax exemption certificate, please reply to this email with your PAN details.",
          { align: "center", lineGap: 3 },
        );
      doc.moveDown(1);
      doc.text("Gnarly Troop Global Federation · president@gnarlytroop.org", {
        align: "center",
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
