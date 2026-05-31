"use client";

type Props = {
  src: string;
  alt?: string;
  mimeType?: string | null;
  mediaKind?: string | null;
  className?: string;
};

function isVideo(kind?: string | null, mime?: string | null, src?: string) {
  if (kind === "video") return true;
  if (mime?.startsWith("video/")) return true;
  if (src && /\.(mp4|webm|ogg|mov)(\?|$)/i.test(src)) return true;
  return false;
}

export default function AdminMediaPreview({
  src,
  alt = "Preview",
  mimeType,
  mediaKind,
  className = "max-h-48 w-full object-cover",
}: Props) {
  if (!src) return null;

  if (isVideo(mediaKind, mimeType, src)) {
    return (
      <video
        src={src}
        controls
        className={className}
        preload="metadata"
        aria-label={alt}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  );
}
