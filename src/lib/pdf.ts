// /lib/pdf.ts
import PDFDocument from "pdfkit";

export async function generateReceiptPdf(donation: any) {
  return new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // Header
      doc.fontSize(20).text("Donation Receipt", { align: "center" }).moveDown();
      doc.fontSize(12).text(`Organization: Your Organization Name`);
      doc.text(`Date: ${new Date(donation.CreatedAt || Date.now()).toLocaleString()}`);
      doc.moveDown();

      // Donor
      doc.fontSize(14).text("Donor Details").moveDown(0.5);
      doc.fontSize(12).text(`Name: ${donation.Name}`);
      doc.text(`Email: ${donation.Email}`);
      doc.text(`Country: ${donation.Country} | State: ${donation.State}`);
      doc.text(`District: ${donation.District} | PIN: ${donation.Pin}`);
      doc.moveDown();

      // Payment
      doc.fontSize(14).text("Payment Details").moveDown(0.5);
      doc.fontSize(12).text(`Donation Tier: ${donation.Title}`);
      doc.text(`Amount: ${donation.Amount} ${donation.Currency ?? "INR"}`);
      doc.text(`Payment Status: ${donation.PaymentStatus}`);
      doc.text(`Payment Provider: ${donation.PaymentProvider}`);
      if (donation.PaymentId) doc.text(`Payment Id: ${donation.PaymentId}`);
      if (donation.ReceiptUrl) doc.text(`Receipt URL: ${donation.ReceiptUrl}`);

      doc.moveDown(2);
      doc.fontSize(10).text("This is a computer generated receipt. No signature required.", { align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
