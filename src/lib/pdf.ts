import { generatePdfBuffer } from "@/lib/pdf/create-pdf-document";

export async function generateReceiptPdf(donation: {
  CreatedAt?: string | number | Date;
  Name?: string;
  Email?: string;
  Country?: string;
  State?: string;
  District?: string;
  Pin?: string;
  Title?: string;
  Amount?: string | number;
  Currency?: string;
  PaymentStatus?: string;
  PaymentProvider?: string;
  PaymentId?: string;
  ReceiptUrl?: string;
}) {
  return generatePdfBuffer((doc) => {
    doc.fontSize(20).text("Donation Receipt", { align: "center" }).moveDown();
    doc.fontSize(12).text(`Organization: Your Organization Name`);
    doc.text(`Date: ${new Date(donation.CreatedAt || Date.now()).toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(14).text("Donor Details").moveDown(0.5);
    doc.fontSize(12).text(`Name: ${donation.Name}`);
    doc.text(`Email: ${donation.Email}`);
    doc.text(`Country: ${donation.Country} | State: ${donation.State}`);
    doc.text(`District: ${donation.District} | PIN: ${donation.Pin}`);
    doc.moveDown();

    doc.fontSize(14).text("Payment Details").moveDown(0.5);
    doc.fontSize(12).text(`Donation Tier: ${donation.Title}`);
    doc.text(`Amount: ${donation.Amount} ${donation.Currency ?? "INR"}`);
    doc.text(`Payment Status: ${donation.PaymentStatus}`);
    doc.text(`Payment Provider: ${donation.PaymentProvider}`);
    if (donation.PaymentId) doc.text(`Payment Id: ${donation.PaymentId}`);
    if (donation.ReceiptUrl) doc.text(`Receipt URL: ${donation.ReceiptUrl}`);

    doc.moveDown(2);
    doc.fontSize(10).text("This is a computer generated receipt. No signature required.", {
      align: "center",
    });
  });
}
