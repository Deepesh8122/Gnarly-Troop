// /lib/mail.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: Number(process.env.EMAIL_PORT) === 465, // true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendDonationEmail(to: string, subject: string, text: string, pdfBuffer?: Buffer) {
  const mailOptions: any = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html: `<p>${text.replace(/\n/g, "<br/>")}</p>`,
  };

  if (pdfBuffer) {
    mailOptions.attachments = [
      {
        content: pdfBuffer,
        filename: "receipt.pdf",
        contentType: "application/pdf",
      },
    ];
  }

  const info = await transporter.sendMail(mailOptions);
  return info;
}
