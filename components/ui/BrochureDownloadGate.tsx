"use client";

import { useState } from "react";

type Props = {
  className?: string;
  label?: string;
};

export default function BrochureDownloadGate({
  className = "brocher-download-btn",
  label = "Download Brochure",
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/brochure/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fd.get("full_name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          organization: fd.get("organization"),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; downloadUrl?: string; error?: string };
      if (!res.ok || !json.ok || !json.downloadUrl) {
        setError(json.error ?? "Could not start download");
        return;
      }
      window.open(json.downloadUrl, "_blank");
      setOpen(false);
      e.currentTarget.reset();
    } catch {
      setError("Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Download brochure</h3>
            <p className="mt-1 text-sm text-slate-600">
              Please share your details. We will open the PDF in a new tab.
            </p>
            <form className="mt-4 space-y-3" onSubmit={onSubmit}>
              <input
                name="full_name"
                required
                placeholder="Full name"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                name="phone"
                placeholder="Phone"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                name="organization"
                placeholder="Organization (optional)"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-teal-600 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {loading ? "Please wait…" : "Download PDF"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .brocher-download-btn {
          display: inline-block;
          padding: 10px 20px;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .brocher-download-btn:hover {
          background: var(--accent-2);
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}
