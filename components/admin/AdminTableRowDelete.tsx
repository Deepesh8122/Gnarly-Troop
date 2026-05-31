"use client";

import { useState, useTransition } from "react";

type Props = {
  id: string;
  /** Server action accepting FormData with `id` field */
  deleteAction: (formData: FormData) => void | Promise<void>;
  label?: string;
  entityLabel?: string;
};

export default function AdminTableRowDelete({
  id,
  deleteAction,
  label = "Delete",
  entityLabel = "this record",
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    startTransition(() => {
      const fd = new FormData();
      fd.set("id", id);
      deleteAction(fd);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={pending}
        className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
      >
        {pending ? "…" : label}
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
            <h4 className="text-base font-semibold text-slate-900">Confirm deletion</h4>
            <p className="mt-2 text-sm text-slate-600">
              Permanently delete {entityLabel}? This cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={() => setOpen(false)}
                className="admin-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={confirmDelete}
                className="admin-btn-danger"
              >
                {pending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
