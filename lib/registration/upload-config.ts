const REGISTRATION_UPLOAD_BUCKET = "documents";
const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

export type RegistrationDocumentKind =
  | "photo"
  | "passport"
  | "visa"
  | "government_id"
  | "diplomatic_note";

export function isRegistrationDocumentKind(value: string): value is RegistrationDocumentKind {
  return ["photo", "passport", "visa", "government_id", "diplomatic_note"].includes(value);
}

export function validateRegistrationUpload(file: File): string | null {
  if (file.size > MAX_BYTES) {
    return "File must be 5 MB or smaller.";
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return "Only JPEG, PNG, WebP, or PDF files are allowed.";
  }
  return null;
}

export function registrationUploadPath(kind: RegistrationDocumentKind, ext: string): string {
  const safeExt = ext.replace(/[^a-z0-9]/gi, "").slice(0, 8) || "bin";
  return `registrations/uploads/${kind}/${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;
}

export { REGISTRATION_UPLOAD_BUCKET, MAX_BYTES };
