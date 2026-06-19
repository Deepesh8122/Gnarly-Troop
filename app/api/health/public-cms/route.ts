import { NextResponse } from "next/server";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { isPublicCmsConfigured } from "@/lib/cms/public-read";

/** Anonymous CMS read probe — no admin session required. */
export async function GET() {
  if (!isPublicCmsConfigured()) {
    return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 503 });
  }

  const supabase = createPublicSupabaseClient();
  const [team, partners, settings] = await Promise.all([
    supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .eq("is_enabled", true),
    supabase
      .from("collaboration_partners")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .eq("is_enabled", true),
    supabase.from("site_settings").select("key").limit(1),
  ]);

  const errors = [team.error, partners.error, settings.error].filter(Boolean);
  if (errors.length) {
    return NextResponse.json(
      {
        ok: false,
        error: "Public read blocked — run migration 20260601200000_public_cms_read_policies.sql",
        details: errors.map((e) => e!.message),
      },
      { status: 403 },
    );
  }

  return NextResponse.json({
    ok: true,
    publishedTeamMembers: team.count ?? 0,
    publishedPartners: partners.count ?? 0,
  });
}
