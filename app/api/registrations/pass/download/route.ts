import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  buildRegistrationPassPdf,
  pdfResponse,
} from "@/lib/registration/build-registration-pass-pdf";
import { storeReceiptPdf } from "@/lib/pdf/store-receipt-pdf";

const BUCKET = "documents";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const registrationId = searchParams.get("registrationId");
  const delegateId = searchParams.get("delegateId");

  if (!registrationId || !delegateId) {
    return NextResponse.json(
      { error: "registrationId and delegateId are required." },
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const supabase = createServiceRoleClient();
  const { data: reg } = await supabase
    .from("event_registrations")
    .select("id, delegate_id, receipt_storage_path")
    .eq("id", registrationId)
    .eq("delegate_id", delegateId)
    .maybeSingle();

  if (!reg) {
    return NextResponse.json(
      { error: "Registration not found or delegate ID mismatch." },
      { status: 404, headers: { "Content-Type": "application/json" } },
    );
  }

  if (reg.receipt_storage_path) {
    const { data: file, error } = await supabase.storage
      .from(BUCKET)
      .download(reg.receipt_storage_path);

    if (!error && file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      return pdfResponse(buffer, `delegate-pass-${reg.delegate_id ?? reg.id}.pdf`);
    }
  }

  try {
    const built = await buildRegistrationPassPdf(reg.id);
    if (!built) {
      return NextResponse.json(
        { error: "Could not generate delegate pass." },
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const stored = await storeReceiptPdf("registrations", reg.id, built.pdf);
    if (stored) {
      await supabase
        .from("event_registrations")
        .update({ receipt_storage_path: stored.storagePath })
        .eq("id", reg.id);
    }

    return pdfResponse(built.pdf, built.filename);
  } catch (err) {
    console.error("[pass/download]", registrationId, err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not generate delegate pass." },
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
