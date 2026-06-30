"use client";

import { useState } from "react";
import styles from "./GsceRegistrationForm.module.css";

type Props = {
  kind: "photo" | "passport" | "visa" | "government_id" | "diplomatic_note";
  label: string;
  required?: boolean;
  value: string;
  fileName: string;
  onUploaded: (storagePath: string, fileName: string) => void;
};

export default function RegistrationDocumentUpload({
  kind,
  label,
  required,
  value,
  fileName,
  onUploaded,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);

      const res = await fetch("/api/registrations/upload/", { method: "POST", body: fd });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        storagePath?: string;
        fileName?: string;
      };

      if (!res.ok || !json.ok || !json.storagePath) {
        throw new Error(json.error ?? "Upload failed");
      }

      onUploaded(json.storagePath, json.fileName ?? file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={label ? styles.fieldFull : undefined}>
      {label ? (
        <span className={styles.uploadLabel}>
          {label}
          {required ? <span className={styles.requiredMark}> *</span> : null}
        </span>
      ) : null}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={onFileChange}
        disabled={uploading}
        required={required && !value}
        className={styles.fileInput}
      />
      {uploading && <small className={styles.hint}>Uploading…</small>}
      {value && !uploading && (
        <small className={styles.hint}>Uploaded: {fileName || value.split("/").pop()}</small>
      )}
      {error && <small className={styles.fieldErrorText}>{error}</small>}
    </div>
  );
}
