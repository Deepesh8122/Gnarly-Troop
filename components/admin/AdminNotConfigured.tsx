import Link from "next/link";
import { getSupabaseEnv } from "@/lib/env";

export default function AdminNotConfigured() {
  const env = getSupabaseEnv();
  if (env.configured) return null;

  return (
    <div className="mb-6 rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-200">
      <p className="font-semibold">Supabase not fully connected</p>
      <ul className="mt-2 list-inside list-disc text-red-300/90">
        {env.issues.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      {!env.serviceRoleKey && (
        <p className="mt-2 text-amber-200">
          Add <code className="text-amber-100">SUPABASE_SERVICE_ROLE_KEY</code> to
          .env.local for admin lists to load data.
        </p>
      )}
      <Link href="/admin/setup/" className="mt-3 inline-block text-amber-400 underline">
        Open setup guide
      </Link>
    </div>
  );
}
