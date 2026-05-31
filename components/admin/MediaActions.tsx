"use client";

import { useState } from "react";
import AdminModal from "@/components/admin/AdminModal";
import AdminMediaPreview from "@/components/admin/AdminMediaPreview";
import AdminConfirmDelete from "@/components/admin/AdminConfirmDelete";

type Props = {
  id: string;
  file_name: string;
  bucket: string;
  media_kind?: string | null;
  mime_type?: string | null;
  publicUrl?: string;
};

export default function MediaActions({
  id,
  file_name,
  media_kind,
  mime_type,
  publicUrl: initialUrl,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null);
  const [previewMime, setPreviewMime] = useState(mime_type ?? null);
  const [previewKind, setPreviewKind] = useState(media_kind ?? null);
  const [showPreview, setShowPreview] = useState(false);

  async function fetchMeta() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media?id=${id}`);
      const json = await res.json();
      if (res.ok && json.ok && json.item) {
        setPreviewUrl(json.item.publicUrl || null);
        setPreviewMime(json.item.mime_type ?? null);
        setPreviewKind(json.item.media_kind ?? null);
        setShowPreview(true);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function handlePreview() {
    if (previewUrl) return setShowPreview(true);
    fetchMeta();
  }

  async function handleRename() {
    const value = window.prompt("Rename file", file_name);
    if (!value || value.trim() === file_name) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, newName: value.trim() }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        window.location.reload();
      } else {
        alert(json.error || "Rename failed");
      }
    } catch {
      alert("Rename failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        window.location.reload();
      } else {
        alert(json.error || "Delete failed");
      }
    } catch {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handlePreview}
        disabled={loading}
        className="rounded px-2 py-1 text-xs border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      >
        Preview
      </button>
      <button
        type="button"
        onClick={handleRename}
        disabled={loading}
        className="rounded px-2 py-1 text-xs border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      >
        Rename
      </button>
      <AdminConfirmDelete
        label="Delete"
        variant="inline"
        message={`Delete "${file_name}" from storage? This cannot be undone.`}
        action={handleDelete}
      />

      <AdminModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        title={file_name}
        size="xl"
      >
        {previewUrl ? (
          <AdminMediaPreview
            src={previewUrl}
            alt={file_name}
            mimeType={previewMime}
            mediaKind={previewKind}
            className="max-h-[70vh] w-full object-contain"
          />
        ) : (
          <p className="text-sm text-slate-500">No preview available.</p>
        )}
      </AdminModal>
    </div>
  );
}
