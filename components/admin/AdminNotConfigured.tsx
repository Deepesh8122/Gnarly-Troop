import Link from "next/link";
import { isAdminDeployEnabled } from "@/lib/deploy-security";
import { getSupabaseEnv } from "@/lib/env";

export default function AdminNotConfigured() {
  const env = getSupabaseEnv();
  const adminEnabled = isAdminDeployEnabled();
  const ready = env.configured && adminEnabled && Boolean(env.serviceRoleKey);

  if (ready) return null;

  return (
    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
      <p className="font-semibold">Admin CMS cannot load data on this server</p>

      {!env.configured && (
        <ul className="mt-2 list-inside list-disc text-red-800">
          {env.issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      )}

      {!adminEnabled && (
        <p className="mt-2 text-red-800">
          Set <code className="rounded bg-red-100 px-1">ENABLE_ADMIN=true</code> in{" "}
          <code className="rounded bg-red-100 px-1">.env.local</code> (required on production —{" "}
          <code className="rounded bg-red-100 px-1">npm start</code> disables admin by default).
        </p>
      )}

      {env.configured && !env.serviceRoleKey && (
        <p className="mt-2 text-red-800">
          Add <code className="rounded bg-red-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
          .env.local — admin lists and saves need the service role JWT from Supabase → API.
        </p>
      )}

      <Link href="/admin/setup/" className="admin-link mt-3 inline-block text-sm">
        Open setup guide →
      </Link>
    </div>
  );
}
