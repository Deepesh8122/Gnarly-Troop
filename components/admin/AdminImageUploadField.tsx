"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminMediaPreview from "@/components/admin/AdminMediaPreview";

type Props = {
  name: string;
  label: string;
  defaultValue?: string;
  bucket?: string;
  accept?: string;
  hint?: string;
};

function normalizePreview(path: string): string {
  if (!path) return "";
  if (path.startsWith("/") || path.startsWith("http")) return path;
  return `/${path}`;
}

export default function AdminImageUploadField({
  name,
  label,
  defaultValue = "",
  bucket = "banners",
  accept = "image/*,video/*",
  hint,
}: Props) {
  const router = useRouter();
  const [path, setPath] = useState(defaultValue);
  const [preview, setPreview] = useState(normalizePreview(defaultValue));
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [mediaKind, setMediaKind] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryItems, setLibraryItems] = useState<
    {
      id: string;
      file_name: string;
      publicUrl?: string;
      mime_type?: string;
      media_kind?: string;
    }[]
  >([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPath(defaultValue);
    setPreview(normalizePreview(defaultValue));
  }, [defaultValue]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setMimeType(file.type);
    setMediaKind(file.type.startsWith("video") ? "video" : "image");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", bucket);

    try {
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        publicUrl?: string;
      };
      if (!res.ok || !json.ok || !json.publicUrl) {
        setError(json.error ?? "Upload failed");
        return;
      }
      URL.revokeObjectURL(localUrl);
      setPath(json.publicUrl);
      setPreview(json.publicUrl);
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
    setError(null);
    try {
      const url = `/api/admin/media?bucket=${encodeURIComponent(bucket)}&limit=80`;
      const res = await fetch(url);
      const json = await res.json();
      if (res.ok && json.ok) {
        setLibraryItems(json.items || []);
      } else {
        setError(json.error || "Failed to load media library");
      }
    } catch {
      setError("Failed to load media library");
    }
  }

  function selectFromLibrary(item: {
    publicUrl?: string;
    mime_type?: string;
    media_kind?: string;
  }) {
    if (item.publicUrl) {
      setPath(item.publicUrl);
      setPreview(item.publicUrl);
      setMimeType(item.mime_type ?? null);
      setMediaKind(item.media_kind ?? null);
    }
    setShowLibrary(false);
  }

  function clearSelection() {
    setPath("");
    setPreview("");
    setMimeType(null);
    setMediaKind(null);
  }

  return (
    <div className="space-y-2">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>

      <input type="hidden" name={name} value={path} readOnly />

      {preview ? (
        <div className="mb-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          <AdminMediaPreview
            src={preview}
            alt=""
            mimeType={mimeType}
            mediaKind={mediaKind}
            className="max-h-48 w-full object-contain"
          />
        </div>
      ) : (
        <div className="mb-3 flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          No file selected
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <label className="admin-btn-primary cursor-pointer text-sm">
          {uploading ? "Uploading…" : "Upload file"}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={onUpload}
            disabled={uploading}
          />
        </label>
        <button type="button" onClick={openLibrary} className="admin-btn-secondary text-sm">
          Choose from library
        </button>
        {path && (
          <button type="button" onClick={clearSelection} className="admin-btn-secondary text-sm">
            Clear
          </button>
        )}
      </div>

      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {showLibrary && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-auto bg-black/50 p-6">
          <div className="w-full max-w-4xl rounded-xl bg-white p-4 text-slate-900 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold">Choose media</h3>
              <div className="flex items-center gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search file name"
                  className="admin-input w-auto py-1"
                />
                <button
                  type="button"
                  onClick={() => setShowLibrary(false)}
                  className="admin-btn-secondary py-1"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {libraryItems
                .filter(
                  (i) =>
                    !search ||
                    (i.file_name || "").toLowerCase().includes(search.toLowerCase()),
                )
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectFromLibrary(item)}
                    className="flex flex-col items-center gap-2 rounded-lg border border-slate-100 p-2 hover:border-teal-300 hover:bg-teal-50/30"
                  >
                    {item.publicUrl ? (
                      <AdminMediaPreview
                        src={item.publicUrl}
                        alt={item.file_name}
                        mimeType={item.mime_type}
                        mediaKind={item.media_kind}
                        className="h-20 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-full items-center justify-center bg-slate-100 text-xs">
                        No preview
                      </div>
                    )}
                    <span className="w-full truncate text-xs text-slate-700">{item.file_name}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
