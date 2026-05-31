import { NextResponse } from "next/server";
import { getSupabaseEnv } from "@/lib/env";
import { migrateStaticContentToSupabase } from "@/lib/admin/migrate-static";
import { revalidatePath } from "next/cache";
import { revalidatePublicPaths } from "@/lib/admin/revalidate";
import { requireAdminApiAccess } from "@/lib/admin-api-guard";

export async function POST() {
  const denied = await requireAdminApiAccess();
  if (denied) return denied;

  const env = getSupabaseEnv();
  if (!env.configured || !env.serviceRoleKey) {
    return NextResponse.json(
      { ok: false, error: "Supabase not configured or missing SUPABASE_SERVICE_ROLE_KEY" },
      { status: 503 },
    );
  }

  try {
    const result = await migrateStaticContentToSupabase();
    revalidatePublicPaths();
    revalidatePath("/admin", "layout");

    return NextResponse.json({
      ok: result.ok,
      message: result.message,
      counts: result.counts,
      warnings: result.warnings,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Import failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
