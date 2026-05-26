import type { MediaAsset } from "@gnarly/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export function getPublicMediaUrl(asset: Pick<MediaAsset, "bucket" | "storage_path">): string {
  if (asset.bucket === "site" || asset.storage_path.startsWith("/")) {
    return asset.storage_path.startsWith("/") ? asset.storage_path : `/${asset.storage_path}`;
  }
  if (!SUPABASE_URL) return `/${asset.storage_path}`;
  return `${SUPABASE_URL}/storage/v1/object/public/${asset.bucket}/${asset.storage_path}`;
}

export function mapMediaRow(row: {
  id: string;
  bucket: string;
  storage_path: string;
  alt_text?: string | null;
  mime_type?: string | null;
  media_kind: MediaAsset["media_kind"];
}): MediaAsset {
  return {
    id: row.id,
    bucket: row.bucket,
    storage_path: row.storage_path,
    public_url: getPublicMediaUrl(row),
    alt_text: row.alt_text,
    mime_type: row.mime_type,
    media_kind: row.media_kind,
  };
}
