"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./SectionVisionShare.module.css";

export default function SectionVisionShare() {
  const [open, setOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState(""); // ✅ stable SSR
  const ref = useRef<HTMLDivElement>(null);

  const shareText =
    "Explore Bharat with Gnarly Troop – Cultural Exchange & Camping 2026";

  // ✅ Set URL ONLY on client after hydration
  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(pageUrl);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyLink = async () => {
    if (!pageUrl) return;
    await navigator.clipboard.writeText(pageUrl);
    alert("Link copied!");
  };

  return (
    <section className={styles.wrapper}>
      <div
        ref={ref}
        className={`${styles.shareBox} ${open ? styles.open : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span className={styles.label}>Share</span>

        <span className={styles.arrow}>
          <img
            src="/images/icons/up-right-arrow-in-a-circle.png"
            alt="arrow icon"
          />
        </span>

        {/* SHARE ICONS */}
        <div className={styles.icons} onClick={(e) => e.stopPropagation()}>
          {/* Email */}
          <a
            href={`mailto:?subject=${encodedText}&body=${encodedText}%0A${encodedUrl}`}
            className={styles.icon}
          >
            ✉
          </a>

          {/* X / Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
          >
            𝕏
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=https://itdivine.com&quote=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
          >
            f
          </a>

          {/* LinkedIn */}
          <a
            // href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=4C Visions&summary=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
          >
            in
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
          >
            <img
              src="/images/icons/whatsapp.png"
              alt="WhatsApp"
              width={"15px"}
            />
          </a>

          {/* Copy Link */}
          <button type="button" onClick={copyLink} className={styles.icon}>
            🔗
          </button>
        </div>
      </div>
    </section>
  );
}
