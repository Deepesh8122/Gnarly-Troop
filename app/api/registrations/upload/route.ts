import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import {
  isRegistrationDocumentKind,
  registrationUploadPath,
  REGISTRATION_UPLOAD_BUCKET,
  validateRegistrationUpload,
} from "@/lib/registration/upload-config";

export async function POST(request: Request) {
  if (!getSupabaseEnv().configured) {
    return NextResponse.json({ ok: false, error: "Uploads not available." }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  const kind = String(formData.get("kind") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
  }

  if (!isRegistrationDocumentKind(kind)) {
    return NextResponse.json({ ok: false, error: "Invalid document type." }, { status: 400 });
  }

  const validationError = validateRegistrationUpload(file);
  if (validationError) {
    return NextResponse.json({ ok: false, error: validationError }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const storagePath = registrationUploadPath(kind, ext);
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = createServiceRoleClient();
  const { error } = await supabase.storage
    .from(REGISTRATION_UPLOAD_BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    kind,
    storagePath,
    fileName: file.name,
  });
}
