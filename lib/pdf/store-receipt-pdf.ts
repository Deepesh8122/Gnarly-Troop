import { createServiceRoleClient } from "@/lib/supabase/server";

const RECEIPTS_BUCKET = "documents";

export type StoredReceipt = {
  bucket: string;
  storagePath: string;
};

export async function storeReceiptPdf(
  folder: "donations" | "memberships" | "registrations",
  recordId: string,
  pdf: Buffer,
): Promise<StoredReceipt | null> {
  try {
    const supabase = createServiceRoleClient();
    const storagePath = `receipts/${folder}/${recordId}.pdf`;

    const { error } = await supabase.storage.from(RECEIPTS_BUCKET).upload(storagePath, pdf, {
      contentType: "application/pdf",
      upsert: true,
    });

    if (error) {
      console.error("[storeReceiptPdf] upload failed", folder, recordId, error.message);
      return null;
    }

    return { bucket: RECEIPTS_BUCKET, storagePath };
  } catch (error) {
    console.error("[storeReceiptPdf] unexpected error", folder, recordId, error);
    return null;
  }
}
