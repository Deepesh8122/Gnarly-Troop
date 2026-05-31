import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdminApiAccess } from "@/lib/admin-api-guard";

const DEFAULT_BUCKETS = ["gallery", "team", "partners", "banners", "events", "videos"];

export async function GET() {
  const denied = await requireAdminApiAccess();
  if (denied) return denied;

  const admin = createServiceRoleClient();
  const { data: setting } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "media_buckets")
    .maybeSingle();

  const buckets = setting && Array.isArray(setting.value) ? setting.value : DEFAULT_BUCKETS;
  return NextResponse.json({ ok: true, buckets });
}

export async function POST(request: Request) {
  const denied = await requireAdminApiAccess();
  if (denied) return denied;

  try {
    const body = await request.json();
    const { buckets, renames, deletes } = body;

    if (!Array.isArray(buckets)) {
      return NextResponse.json({ ok: false, error: "Invalid buckets list" }, { status: 400 });
    }

    const admin = createServiceRoleClient();

    // 1. Handle Renames in media_library metadata
    if (Array.isArray(renames)) {
      for (const r of renames) {
        if (r.from && r.to && r.from !== r.to) {
          await admin
            .from("media_library")
            .update({ bucket: r.to })
            .eq("bucket", r.from);
        }
      }
    }

    // 2. Handle Deletes in media_library metadata (re-map to default 'gallery' fallback)
    if (Array.isArray(deletes)) {
      for (const d of deletes) {
        if (d && d !== "gallery") {
          await admin
            .from("media_library")
            .update({ bucket: "gallery" })
            .eq("bucket", d);
        }
      }
    }

    // 3. Persist updated buckets array in site_settings
    const { error } = await admin
      .from("site_settings")
      .upsert(
        {
          key: "media_buckets",
          value: buckets,
          description: "List of allowed media buckets in media library",
        },
        {
          onConflict: "key",
        }
      );

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, buckets });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Malformed request body" },
      { status: 400 }
    );
  }
}
