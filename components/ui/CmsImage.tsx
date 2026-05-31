"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** Optional gallery for next/prev in lightbox */
  gallery?: { src: string; alt: string }[];
  initialIndex?: number;
};

export default function CmsImage({ src, alt, className, gallery, initialIndex = 0 }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(initialIndex);

  const images = gallery?.length ? gallery : [{ src, alt }];
  const current = images[index] ?? images[0];

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length, close]);

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <span
        role="button"
        tabIndex={0}
        className={className ? `${className} inline-block cursor-zoom-in` : "inline-block cursor-zoom-in"}
        onClick={() => {
          setIndex(initialIndex);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIndex(initialIndex);
            setOpen(true);
          }
        }}
        aria-label={`View ${alt} fullscreen`}
      >
        <img src={src} alt={alt} className={className} />
      </span>

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1 text-2xl text-white hover:bg-white/20"
            onClick={close}
            aria-label="Close"
          >
            ×
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white md:left-6"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((i) => (i - 1 + images.length) % images.length);
                }}
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                type="button"
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white md:right-6"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((i) => (i + 1) % images.length);
                }}
                aria-label="Next"
              >
                ›
              </button>
            </>
          )}
          <img
            src={current.src}
            alt={current.alt}
            className="max-h-[90vh] max-w-[95vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
