import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";

const DEFAULT_BROCHURE = "/documents/Brochure.pdf";

export async function POST(request: Request) {
  const env = getSupabaseEnv();
  if (!env.configured) {
    return NextResponse.json({ ok: false, error: "Not configured" }, { status: 503 });
  }

  let body: {
    full_name?: string;
    email?: string;
    phone?: string;
    organization?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const full_name = String(body.full_name ?? "").trim();
  const email = String(body.email ?? "").trim();
  if (!full_name || !email) {
    return NextResponse.json(
      { ok: false, error: "Name and email are required" },
      { status: 400 },
    );
  }

  try {
    const admin = createServiceRoleClient();
    const { error } = await admin.from("brochure_download_leads").insert({
      full_name,
      email,
      phone: body.phone ? String(body.phone) : null,
      organization: body.organization ? String(body.organization) : null,
      downloaded_at: new Date().toISOString(),
      metadata: { source: "website" },
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const { data: setting } = await admin
      .from("site_settings")
      .select("value")
      .eq("key", "brochure_download_url")
      .maybeSingle();

    const downloadUrl =
      typeof setting?.value === "string"
        ? setting.value.replace(/^"|"$/g, "")
        : DEFAULT_BROCHURE;

    return NextResponse.json({ ok: true, downloadUrl });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Server error" },
      { status: 500 },
    );
  }
}
