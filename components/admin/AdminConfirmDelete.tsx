"use client";

import { useState, useTransition } from "react";
import AdminModal from "@/components/admin/AdminModal";

type Props = {
  action: () => void | Promise<void>;
  label?: string;
  title?: string;
  message?: string;
  confirmLabel?: string;
  variant?: "inline" | "button";
};

export default function AdminConfirmDelete({
  action,
  label = "Delete",
  title = "Confirm deletion",
  message = "This action cannot be undone. Are you sure you want to delete this record?",
  confirmLabel = "Delete permanently",
  variant = "inline",
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await action();
      setOpen(false);
    });
  }

  const triggerClass =
    variant === "button"
      ? "admin-btn-secondary border-red-200 text-red-600 hover:bg-red-50"
      : "text-sm text-red-600 underline hover:text-red-700";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClass}>
        {label}
      </button>

      <AdminModal
        open={open}
        onClose={() => !pending && setOpen(false)}
        title={title}
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={pending}
              className="admin-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={pending}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {pending ? "Deleting…" : confirmLabel}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600">{message}</p>
      </AdminModal>
    </>
  );
}

/** Server action delete wrapped in a form with confirmation modal */
export function AdminDeleteForm({
  action,
  label = "Delete",
  title,
  message,
}: {
  action: (formData: FormData) => void | Promise<void>;
  label?: string;
  title?: string;
  message?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-red-600 underline hover:text-red-700"
      >
        {label}
      </button>

      <AdminModal
        open={open}
        onClose={() => !pending && setOpen(false)}
        title={title ?? "Confirm deletion"}
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={pending}
              className="admin-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={pending}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              onClick={() => {
                startTransition(() => {
                  const fd = new FormData();
                  action(fd);
                });
              }}
            >
              {pending ? "Deleting…" : "Delete permanently"}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          {message ?? "This action cannot be undone. Are you sure?"}
        </p>
      </AdminModal>
    </>
  );
}
