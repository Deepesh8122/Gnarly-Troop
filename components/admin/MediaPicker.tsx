"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminMediaPreview from "@/components/admin/AdminMediaPreview";

type Props = {
  name: string;
  label?: string;
  defaultMediaId?: string;
  defaultLegacyPath?: string;
  bucket?: string;
  accept?: string;
};

export default function MediaPicker({
  name,
  label = "Profile image",
  defaultMediaId = "",
  defaultLegacyPath = "",
  bucket = "team",
  accept = "image/*,video/*",
}: Props) {
  const router = useRouter();
  const [mediaId, setMediaId] = useState(defaultMediaId);
  const [legacyPath, setLegacyPath] = useState(defaultLegacyPath);
  const [preview, setPreview] = useState("");
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [mediaKind, setMediaKind] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(Boolean(defaultMediaId));
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
    let cancelled = false;

    async function resolvePreview() {
      if (defaultLegacyPath) {
        setPreview(defaultLegacyPath.startsWith("/") ? defaultLegacyPath : `/${defaultLegacyPath}`);
        setLoadingPreview(false);
        return;
      }

      if (!defaultMediaId) {
        setLoadingPreview(false);
        return;
      }

      setLoadingPreview(true);
      try {
        const res = await fetch(`/api/admin/media?id=${encodeURIComponent(defaultMediaId)}`);
        const json = (await res.json()) as {
          ok?: boolean;
          item?: { publicUrl?: string; mime_type?: string; media_kind?: string };
        };
        if (!cancelled && res.ok && json.ok && json.item?.publicUrl) {
          setPreview(json.item.publicUrl);
          setMimeType(json.item.mime_type ?? null);
          setMediaKind(json.item.media_kind ?? null);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoadingPreview(false);
      }
    }

    resolvePreview();
    return () => {
      cancelled = true;
    };
  }, [defaultMediaId, defaultLegacyPath]);

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
        id?: string;
        publicUrl?: string;
      };
      if (!res.ok || !json.ok || !json.id) {
        setError(json.error ?? "Upload failed");
        return;
      }
      setMediaId(json.id);
      if (json.publicUrl) {
        URL.revokeObjectURL(localUrl);
        setPreview(json.publicUrl);
        setLegacyPath("");
      }
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
    id: string;
    publicUrl?: string;
    mime_type?: string;
    media_kind?: string;
  }) {
    setMediaId(item.id);
    if (item.publicUrl) {
      setPreview(item.publicUrl);
      setMimeType(item.mime_type ?? null);
      setMediaKind(item.media_kind ?? null);
      setLegacyPath("");
    }
    setShowLibrary(false);
  }

  return (
    <div className="admin-card p-4">
      <p className="mb-3 text-sm font-medium text-slate-700">{label}</p>

      {loadingPreview && (
        <div className="mb-3 flex h-32 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-500">
          Loading preview…
        </div>
      )}

      {!loadingPreview && preview && (
        <div className="mb-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          <AdminMediaPreview
            src={preview}
            alt="Preview"
            mimeType={mimeType}
            mediaKind={mediaKind}
            className="max-h-48 w-full object-contain"
          />
        </div>
      )}

      <input type="hidden" name={`${name}_media_id`} value={mediaId} />
      <input type="hidden" name={`${name}_legacy_path`} value={legacyPath} />

      <div className="flex flex-wrap gap-3">
        <label className="admin-btn-primary cursor-pointer">
          {uploading ? "Uploading…" : "Upload file"}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={onUpload}
            disabled={uploading}
          />
        </label>
        <button type="button" onClick={openLibrary} className="admin-btn-secondary">
          Choose from Media Library
        </button>
      </div>

      {mediaId && (
        <p className="mt-2 text-xs text-slate-500">
          Media ID: <code className="rounded bg-slate-100 px-1">{mediaId}</code>
        </p>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

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
