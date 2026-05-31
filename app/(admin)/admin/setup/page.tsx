import Link from "next/link";
import { getSupabaseEnv } from "@/lib/env";

export default function AdminSetupPage() {
  const env = getSupabaseEnv();

  return (
    <div className="admin-root mx-auto max-w-2xl space-y-6 p-6">
      <h2 className="text-2xl font-bold text-slate-900">Supabase setup</h2>
      <p className="text-slate-600">
        Connect your project to Supabase so the CMS and donations can read/write data.
      </p>

      <section className="admin-card p-4">
        <h3 className="font-semibold text-teal-800">1. Environment (.env.local)</h3>
        <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...`}
        </pre>
      </section>

      <section className="admin-card p-4">
        <h3 className="font-semibold text-teal-800">2. Run SQL migrations</h3>
        <p className="mt-2 text-sm text-slate-600">
          In Supabase → SQL Editor, run each file under <code>supabase/migrations/</code> in
          order, then <code>supabase/seed.sql</code>.
        </p>
        <ol className="mt-2 list-decimal pl-5 text-sm text-slate-700">
          <li>20260526100000_initial_schema.sql</li>
          <li>20260526100001_rls_policies.sql</li>
          <li>20260526100002_storage_buckets.sql</li>
          <li>20260527120000_legacy_image_paths.sql</li>
          <li>20260527130000_vision_story_fields.sql</li>
          <li>seed.sql</li>
        </ol>
      </section>

      <section className="admin-card p-4">
        <h3 className="font-semibold text-teal-800">3. Connection status</h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          <li>URL: {env.url ? "✓ set" : "✗ missing"}</li>
          <li>Anon key: {env.anonKey ? "✓ set" : "✗ missing"}</li>
          <li>Service role: {env.serviceRoleKey ? "✓ set" : "✗ missing (admin writes need this)"}</li>
        </ul>
      </section>

      <section className="admin-card p-4">
        <h3 className="font-semibold text-teal-800">4. Auth redirect URLs</h3>
        <p className="mt-2 text-sm text-slate-600">
          Supabase → Authentication → URL configuration — add:
        </p>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
          <li>http://localhost:3000/admin/login/</li>
          <li>Your production domain + /admin/login/</li>
        </ul>
      </section>

      <Link href="/admin/login/" className="admin-btn-primary inline-block">
        Back to login
      </Link>
    </div>
  );
}
