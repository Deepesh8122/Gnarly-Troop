"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  id: string;
  fileName: string;
};

export default function AdminMediaRowDelete({ id, fileName }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function confirmDelete() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/media", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          setError(json.error || "Delete failed");
          return;
        }
        setOpen(false);
        router.refresh();
      } catch {
        setError("Delete failed");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={pending}
        className="text-xs font-medium text-red-600 hover:text-red-700"
      >
        Delete
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close"
            onClick={() => !pending && setOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <h4 className="text-base font-semibold text-slate-900">Delete media file</h4>
            <p className="mt-2 text-sm text-slate-600">
              Remove <strong>{fileName}</strong> from storage permanently?
            </p>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" disabled={pending} onClick={() => setOpen(false)} className="admin-btn-secondary">
                Cancel
              </button>
              <button type="button" disabled={pending} onClick={confirmDelete} className="admin-btn-danger">
                {pending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
