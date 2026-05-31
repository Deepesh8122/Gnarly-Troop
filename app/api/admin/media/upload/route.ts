import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { requireAdminApiAccess } from "@/lib/admin-api-guard";

const DEFAULT_ALLOWED = ["gallery", "team", "partners", "banners", "events", "videos", "brochures", "documents"];

export async function POST(request: Request) {
  const denied = await requireAdminApiAccess();
  if (denied) return denied;

  const env = getSupabaseEnv();
  if (!env.configured || !env.serviceRoleKey) {
    return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 503 });
  }

  const formData = await request.formData();
  const files = formData.getAll("file");
  const bucket = String(formData.get("bucket") ?? "gallery");

  if (!files || files.length === 0) {
    return NextResponse.json({ ok: false, error: "No files provided" }, { status: 400 });
  }

  const admin = createServiceRoleClient();

  // Load allowed buckets dynamically from site settings
  const { data: setting } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "media_buckets")
    .maybeSingle();

  const allowedBuckets = setting && Array.isArray(setting.value)
    ? new Set([...setting.value.map(String), "brochures", "documents"])
    : new Set(DEFAULT_ALLOWED);

  if (!allowedBuckets.has(bucket)) {
    return NextResponse.json({ ok: false, error: "Invalid bucket" }, { status: 400 });
  }

  const validFiles = files.filter((f): f is File => f instanceof File);
  if (validFiles.length === 0) {
    return NextResponse.json({ ok: false, error: "No valid files provided" }, { status: 400 });
  }

  const results = [];

  for (const file of validFiles) {
    const ext = file.name.split(".").pop() ?? "bin";
    const storage_path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await admin.storage
      .from(bucket)
      .upload(storage_path, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { ok: false, error: `Upload failed for ${file.name}: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const mediaKind = file.type.startsWith("video")
      ? "video"
      : file.type.startsWith("image")
        ? "image"
        : "document";

    const publicUrl = `${env.url}/storage/v1/object/public/${bucket}/${storage_path}`;

    const { data: row, error: dbError } = await admin
      .from("media_library")
      .insert({
        file_name: file.name,
        storage_path,
        bucket,
        media_kind: mediaKind,
        mime_type: file.type || null,
        file_size: file.size,
      })
      .select("id")
      .single();

    results.push({
      id: row?.id || null,
      publicUrl,
      fileName: file.name,
      dbError: dbError ? dbError.message : null,
    });
  }

  const lastResult = results[results.length - 1];

  return NextResponse.json({
    ok: true,
    id: lastResult.id,
    publicUrl: lastResult.publicUrl,
    uploaded: results,
  });
}
