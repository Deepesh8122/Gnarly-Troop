import { NextResponse } from "next/server";
import { isAdminDeployEnabled } from "@/lib/deploy-security";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/** Block privileged API routes on public deployments; require login on admin deploys. */
export async function requireAdminApiAccess(): Promise<NextResponse | null> {
  if (!isAdminDeployEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
