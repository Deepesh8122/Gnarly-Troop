"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MigrateStaticButton() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (
      !confirm(
        "Import static leadership & collaboration content into Supabase? Existing rows with the same slug will be updated.",
      )
    ) {
      return;
    }
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/admin/import-static", { method: "POST" });
      const json = (await res.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
        counts?: { members?: number; partners?: number };
        warnings?: string[];
      };

      if (!res.ok || !json.ok) {
        setStatus(json.error ?? json.message ?? "Import failed");
        return;
      }

      let msg = json.message ?? "Import complete.";
      if (json.counts) {
        msg += ` (${json.counts.members ?? 0} leaders, ${json.counts.partners ?? 0} partners)`;
      }
      if (json.warnings?.length) {
        msg += ` Warnings: ${json.warnings.join("; ")}`;
      }
      setStatus(msg);
      router.refresh();
    } catch {
      setStatus("Network error during import");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-amber-800/50 bg-amber-950/30 p-4">
      <p className="text-sm font-medium text-amber-200">One-time content import</p>
      <p className="mt-1 text-xs text-amber-200/80">
        Copies leadership & collaboration from bundled static source files into the database.
        Requires <code className="text-amber-100">SUPABASE_SERVICE_ROLE_KEY</code> and admin login.
      </p>
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="mt-3 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-50"
      >
        {loading ? "Importing…" : "Import static content to database"}
      </button>
      {status && (
        <p
          className={`mt-2 text-sm ${status.includes("failed") || status.includes("error") ? "text-red-300" : "text-zinc-300"}`}
        >
          {status}
        </p>
      )}
    </div>
  );
}
