"use client";
import Link from "next/link";

export default function BrocherDownload() {
  return (
    <>
      <Link
        href="/documents/Brochure.pdf"
        target="_blank"
        className="brocher-download-btn"
      >
        Download Brochure
      </Link>

      <style jsx global>{`
        .brocher-download-btn {
          display: inline-block;
          padding: 10px 20px;
          background: var(--accent);
          color: #fff;
          border-radius: 6px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .brocher-download-btn:hover {
          background: var(--accent-2);
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </>
  );
}
