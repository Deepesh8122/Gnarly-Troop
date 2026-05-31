import { generatePdfBuffer } from "@/lib/pdf/create-pdf-document";

export type RegistrationCertificateData = {
  fullName: string;
  email: string;
  eventTitle: string;
  eventDates: string;
  eventLocation: string;
  eligibilityLabel: string;
  registrationId: string;
};

export async function generateRegistrationCertificatePdf(
  data: RegistrationCertificateData,
): Promise<Buffer> {
  return generatePdfBuffer((doc) => {
    doc
      .fillColor("#b45309")
      .fontSize(22)
      .text("Gnarly Troop Global Federation", { align: "center" })
      .moveDown(0.3);
    doc.fillColor("#334155").fontSize(14).text("Summit Registration Confirmation", { align: "center" });
    doc.moveDown(2);

    doc.fillColor("#0f172a").fontSize(18).text(data.fullName, { align: "center" });
    doc.moveDown(0.5);
    doc
      .fillColor("#475569")
      .fontSize(12)
      .text("is registered for", { align: "center" });
    doc.moveDown(0.5);
    doc.fillColor("#0f172a").fontSize(14).text(data.eventTitle, { align: "center" });
    doc.moveDown(1.5);

    doc.fillColor("#334155").fontSize(11);
    doc.text(`Dates: ${data.eventDates}`);
    doc.text(`Venue: ${data.eventLocation}`);
    doc.text(`Eligibility: ${data.eligibilityLabel}`);
    doc.text(`Email: ${data.email}`);
    doc.text(`Reference: ${data.registrationId.slice(0, 8).toUpperCase()}`);
    doc.moveDown(2);

    doc
      .fillColor("#64748b")
      .fontSize(10)
      .text(
        "Please bring a copy of this confirmation to the summit. Further instructions will be sent by email.",
        { align: "center", lineGap: 3 },
      );
    doc.moveDown(1);
    doc.text("Gnarly Troop Global Federation · president@gnarlytroop.org", { align: "center" });
  });
}
