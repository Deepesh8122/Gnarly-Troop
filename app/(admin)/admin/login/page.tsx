"use client";

import { FormEvent, Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) throw signError;
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <div className="mt-6 space-y-4 animate-pulse">
        <div>
          <div className="mb-1 h-5 w-12 bg-slate-200 rounded"></div>
          <div className="h-10 w-full bg-slate-200 rounded"></div>
        </div>
        <div>
          <div className="mb-1 h-5 w-16 bg-slate-200 rounded"></div>
          <div className="h-10 w-full bg-slate-200 rounded"></div>
        </div>
        <div className="h-11 w-full bg-slate-200 rounded mt-6"></div>
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="admin-input"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="admin-btn-primary w-full py-2.5">
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <div className="admin-card max-w-md p-8 text-center">
          <h1 className="text-xl font-bold text-slate-900">Setup required</h1>
          <p className="mt-2 text-sm text-slate-600">
            Add Supabase keys to <code className="text-teal-700">.env.local</code> first.
          </p>
          <Link href="/admin/setup/" className="mt-4 inline-block text-teal-700 underline">
            Open setup guide
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-teal-50 p-6">
      <div className="admin-card w-full max-w-md p-8 shadow-lg">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Gnarly Troop</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Content Studio</h1>
        <p className="mt-1 text-sm text-slate-600">Sign in to manage your website</p>
        <Suspense fallback={<p className="mt-6 text-slate-500">Loading…</p>}>
          <LoginForm />
        </Suspense>
        <p className="mt-4 text-center text-xs text-slate-500">
          <Link href="/admin/setup/" className="underline">
            Setup / connection help
          </Link>
        </p>
      </div>
    </div>
  );
}
