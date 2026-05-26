"use client";
import Link from "next/link";

export default function DonateButton() {
  return (
    <>
      <Link href="/collaboration/donation" className="donate-btn">
        Donate Us
      </Link>

      <style jsx global>{`
        .donate-btn {
          background: #111;
          color: #fff;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          display: inline-block;
          transition: 0.2s ease;
        }

        .donate-btn:hover {
          background: #222;
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}
