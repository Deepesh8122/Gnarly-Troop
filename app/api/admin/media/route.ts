import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { requireAdminApiAccess } from "@/lib/admin-api-guard";

export async function GET(request: Request) {
  const denied = await requireAdminApiAccess();
  if (denied) return denied;

  const env = getSupabaseEnv();
  if (!env.configured || !env.serviceRoleKey) {
    return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 503 });
  }

  const admin = createServiceRoleClient();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const bucket = url.searchParams.get("bucket");
  const kind = url.searchParams.get("kind");
  const limit = Number(url.searchParams.get("limit") || "100");

  try {
    if (id) {
      const { data, error } = await admin
        .from("media_library")
        .select("id, file_name, bucket, storage_path, media_kind, mime_type, file_size, created_at")
        .eq("id", id)
        .maybeSingle();

      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      if (!data) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

      const publicUrl = `${env.url}/storage/v1/object/public/${data.bucket}/${data.storage_path}`;
      return NextResponse.json({ ok: true, item: { ...data, publicUrl } });
    }

    let q = admin
      .from("media_library")
      .select("id, file_name, bucket, storage_path, media_kind, mime_type, file_size, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (bucket) q = q.eq("bucket", bucket);
    if (kind) q = q.eq("media_kind", kind);

    const { data, error } = await q;
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    const items = (data || []).map((row: any) => ({
      ...row,
      publicUrl: `${env.url}/storage/v1/object/public/${row.bucket}/${row.storage_path}`,
    }));

    return NextResponse.json({ ok: true, items });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const denied = await requireAdminApiAccess();
  if (denied) return denied;

  const admin = createServiceRoleClient();
  try {
    const body = await request.json();
    const { id, newName } = body as { id?: string; newName?: string };
    if (!id || !newName) return NextResponse.json({ ok: false, error: "Missing id or newName" }, { status: 400 });

    const { data, error } = await admin
      .from("media_library")
      .update({ file_name: newName })
      .eq("id", id)
      .select("id, file_name");

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const denied = await requireAdminApiAccess();
  if (denied) return denied;

  const env = getSupabaseEnv();
  if (!env.configured || !env.serviceRoleKey) {
    return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 503 });
  }

  const admin = createServiceRoleClient();
  try {
    const body = await request.json();
    const { id } = body as { id?: string };
    if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

    const { data: row, error: fetchErr } = await admin
      .from("media_library")
      .select("id, bucket, storage_path")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr) return NextResponse.json({ ok: false, error: fetchErr.message }, { status: 500 });
    if (!row) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

    const { data: removeData, error: removeError } = await admin.storage
      .from(row.bucket)
      .remove([row.storage_path]);

    if (removeError) return NextResponse.json({ ok: false, error: removeError.message }, { status: 500 });

    const { error: delErr } = await admin.from("media_library").delete().eq("id", id);
    if (delErr) return NextResponse.json({ ok: false, error: delErr.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}
