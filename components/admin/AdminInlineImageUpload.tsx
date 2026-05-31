"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminMediaPreview from "@/components/admin/AdminMediaPreview";
import AdminThumb from "@/components/admin/AdminThumb";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  bucket?: string;
};

function normalizePreview(path: string): string {
  if (!path) return "/images/logos/logo-2.png";
  if (path.startsWith("/") || path.startsWith("http")) return path;
  return `/${path}`;
}

export default function AdminInlineImageUpload({
  value,
  onChange,
  label = "Photo",
  bucket = "banners",
}: Props) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryItems, setLibraryItems] = useState<
    { id: string; file_name: string; publicUrl?: string }[]
  >([]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", bucket);

    try {
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      const json = (await res.json()) as { ok?: boolean; error?: string; publicUrl?: string };
      if (!res.ok || !json.ok || !json.publicUrl) {
        setError(json.error ?? "Upload failed");
        return;
      }
      onChange(json.publicUrl);
      router.refresh();
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function openLibrary() {
    setShowLibrary(true);
    try {
      const res = await fetch(`/api/admin/media?bucket=${encodeURIComponent(bucket)}&limit=80`);
      const json = await res.json();
      if (res.ok && json.ok) setLibraryItems(json.items || []);
    } catch {
      setError("Failed to load library");
    }
  }

  return (
    <div className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <div className="flex flex-wrap items-start gap-3">
        <AdminThumb src={normalizePreview(value)} alt="" size="md" />
        <div className="flex flex-wrap gap-2">
          <label className="admin-btn-secondary cursor-pointer px-2 py-1 text-xs">
            {uploading ? "Uploading…" : "Upload"}
            <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
          </label>
          <button type="button" onClick={openLibrary} className="admin-btn-secondary px-2 py-1 text-xs">
            Library
          </button>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {showLibrary && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-auto bg-black/50 p-6">
          <div className="w-full max-w-3xl rounded-xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Choose image</h3>
              <button type="button" onClick={() => setShowLibrary(false)} className="admin-btn-secondary py-1 text-sm">
                Close
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {libraryItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.publicUrl) onChange(item.publicUrl);
                    setShowLibrary(false);
                  }}
                  className="rounded border p-1 hover:border-teal-400"
                >
                  {item.publicUrl ? (
                    <AdminMediaPreview src={item.publicUrl} alt={item.file_name} className="h-16 w-full object-cover" />
                  ) : (
                    <div className="flex h-16 items-center justify-center bg-slate-100 text-xs">—</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
