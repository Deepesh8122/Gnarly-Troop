type PdfDocumentOptions = {
  size?: string | [number, number];
  margin?: number;
};

/** Load PDFKit from node_modules (must stay external — bundled paths break Helvetica.afm). */
export async function createPdfDocument(options: PdfDocumentOptions = {}) {
  const { default: PDFDocument } = await import("pdfkit");
  const { margin = 50, ...rest } = options;
  return new PDFDocument({
    size: "A4",
    margin,
    ...rest,
  });
}

export async function generatePdfBuffer(
  build: (doc: PDFKit.PDFDocument) => void,
  options?: PdfDocumentOptions,
): Promise<Buffer> {
  const doc = await createPdfDocument(options);
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    try {
      build(doc);
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
