import { NextResponse } from "next/server";
import { getSupabaseEnv } from "@/lib/env";
import { testSupabaseConnection } from "@/lib/supabase/server";

export async function GET() {
  const env = getSupabaseEnv();

  let connection: {
    ok: boolean;
    message: string;
    details?: string;
  } = { ok: false, message: "Not configured", details: env.issues.join("; ") };

  if (env.configured) {
    connection = await testSupabaseConnection();
  }

  const keyHint = env.anonKey
    ? `${env.anonKey.slice(0, 12)}… (length ${env.anonKey.length})`
    : null;

  return NextResponse.json({
    env: {
      configured: env.configured,
      hasUrl: Boolean(env.url),
      hasAnonKey: Boolean(env.anonKey),
      hasServiceRole: Boolean(env.serviceRoleKey),
      anonKeyHint: keyHint,
      issues: env.issues,
      warnings: env.warnings,
    },
    connection,
    cmsEnabled: process.env.NEXT_PUBLIC_CMS_ENABLED === "true",
    nextSteps: env.configured
      ? connection.ok
        ? ["Open /admin/login/", "Run seed.sql if tables are empty"]
        : ["Run missing migrations — see docs/SUPABASE_SETUP_STEPS.md"]
      : ["Fix .env.local issues listed above", "Restart: npm run dev"],
  });
}
