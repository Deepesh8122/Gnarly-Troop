import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdminApiAccess } from "@/lib/admin-api-guard";

const BUCKET = "documents";

const DOC_COLUMN: Record<string, string> = {
  photo: "photo_storage_path",
  passport: "passport_storage_path",
  visa: "visa_storage_path",
  government_id: "government_id_storage_path",
};

export async function GET(request: Request) {
  const denied = await requireAdminApiAccess();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  const doc = searchParams.get("doc");

  if (!type || !id) {
    return NextResponse.json({ error: "type and id required" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  let storagePath: string | null = null;
  let filename = "document";
  let contentType = "application/octet-stream";

  if (type === "donation") {
    const { data } = await supabase
      .from("donations")
      .select("receipt_storage_path, donor_name, merchant_transaction_id")
      .eq("id", id)
      .maybeSingle();
    storagePath = data?.receipt_storage_path ?? null;
    filename = `donor-acknowledgment-${data?.merchant_transaction_id ?? id}.pdf`;
    contentType = "application/pdf";
  } else if (type === "registration") {
    const { data } = await supabase
      .from("event_registrations")
      .select("receipt_storage_path, delegate_id, full_name")
      .eq("id", id)
      .maybeSingle();
    storagePath = data?.receipt_storage_path ?? null;
    filename = `delegate-pass-${data?.delegate_id ?? id}.pdf`;
    contentType = "application/pdf";
  } else if (type === "registration-doc" && doc) {
    const column = DOC_COLUMN[doc];
    const { data } = await supabase
      .from("event_registrations")
      .select(
        "photo_storage_path, passport_storage_path, visa_storage_path, government_id_storage_path, metadata, delegate_id",
      )
      .eq("id", id)
      .maybeSingle();

    if (!data) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (doc === "diplomatic_note") {
      const meta = data.metadata as { diplomatic_note_path?: string } | null;
      storagePath = meta?.diplomatic_note_path ?? null;
    } else if (column) {
      storagePath = data[column as keyof typeof data] as string | null;
    }

    const ext = storagePath?.split(".").pop()?.toLowerCase();
    filename = `${doc}-${data.delegate_id ?? id}.${ext ?? "bin"}`;
    if (ext === "pdf") contentType = "application/pdf";
    else if (ext === "png") contentType = "image/png";
    else if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";
    else if (ext === "webp") contentType = "image/webp";
  } else {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  if (!storagePath) {
    return NextResponse.json({ error: "File not found for this record" }, { status: 404 });
  }

  const { data: file, error } = await supabase.storage.from(BUCKET).download(storagePath);

  if (error || !file) {
    return NextResponse.json({ error: "Could not download file" }, { status: 500 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
