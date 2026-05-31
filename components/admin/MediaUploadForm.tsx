"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import AdminMediaPreview from "@/components/admin/AdminMediaPreview";

type Props = {
  buckets?: string[];
};

export default function MediaUploadForm({
  buckets = ["gallery", "team", "partners", "banners", "events"],
}: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewKind, setPreviewKind] = useState<string | null>(null);
  const [previewMime, setPreviewMime] = useState<string | null>(null);
  const startRef = useRef<number | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setProgress(0);
    setUploadedBytes(0);
    setTotalBytes(null);
    setSpeed(null);
    setPreviewUrl(null);
    startRef.current = Date.now();

    const form = e.currentTarget;
    const fd = new FormData(form);
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    const firstFile = fileInput?.files?.[0];
    if (firstFile) {
      setPreviewUrl(URL.createObjectURL(firstFile));
      setPreviewMime(firstFile.type);
      setPreviewKind(firstFile.type.startsWith("video") ? "video" : "image");
    }

    return new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/admin/media/upload");

      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
          setUploadedBytes(event.loaded);
          setTotalBytes(event.total);
          const now = Date.now();
          const started = startRef.current || now;
          const seconds = Math.max((now - started) / 1000, 0.001);
          setSpeed(Math.round(event.loaded / seconds));
        }
      };

      xhr.onload = async () => {
        setLoading(false);
        try {
          const json = JSON.parse(xhr.responseText || "{}");
          if (xhr.status < 200 || xhr.status >= 300 || !json.ok) {
            setError(json.error ?? "Upload failed");
            resolve();
            return;
          }
          if (json.publicUrl) {
            setPreviewUrl(json.publicUrl);
          }
          setSuccess(`Uploaded ${json.uploaded?.length ?? 1} file(s) successfully.`);
          form.reset();
          router.refresh();
        } catch {
          setError("Upload failed");
        }
        resolve();
      };

      xhr.onerror = () => {
        setLoading(false);
        setError("Upload failed");
        resolve();
      };

      xhr.send(fd);
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="admin-card space-y-4 p-4 text-slate-900"
    >
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">File</label>
          <input
            type="file"
            name="file"
            required
            multiple
            accept="image/*,video/*,application/pdf"
            className="text-sm text-slate-700"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Bucket</label>
          <select
            name="bucket"
            className="admin-input w-auto py-1.5"
            defaultValue={buckets[0] || "gallery"}
          >
            {buckets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="admin-btn-primary disabled:opacity-50"
        >
          {loading ? "Uploading…" : "Upload"}
        </button>
      </div>

      {previewUrl && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2">
          <AdminMediaPreview
            src={previewUrl}
            mimeType={previewMime}
            mediaKind={previewKind}
            className="max-h-40 w-full object-contain"
          />
        </div>
      )}

      {totalBytes !== null && (
        <div className="w-full max-w-md">
          <div className="h-2 w-full rounded bg-slate-100">
            <div
              className="h-2 rounded bg-teal-500 transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-600">
            <span>{progress}%</span>
            <span>
              {uploadedBytes && totalBytes
                ? `${Math.round(uploadedBytes / 1024)}KB / ${Math.round(totalBytes / 1024)}KB`
                : ""}
            </span>
          </div>
          {speed !== null && (
            <div className="text-xs text-slate-500">{Math.round(speed / 1024)} KB/s</div>
          )}
        </div>
      )}

      {success && <p className="admin-toast admin-toast--success">{success}</p>}
      {error && <p className="admin-toast admin-toast--error">{error}</p>}
    </form>
  );
}
