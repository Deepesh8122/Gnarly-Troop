"use client";

import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Send,
  Link as LinkIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface SocialShareProps {
  title?: string;
}

export default function SocialShare({ title }: SocialShareProps) {
  const pathname = usePathname();
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}${pathname}`);
  }, [pathname]);

  if (!url) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title ?? "");

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  const iconStyle: React.CSSProperties = {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
    transition: "all 0.25s ease",
  };

  const hoverStyle: React.CSSProperties = {
    transform: "translateY(-3px)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
  };

  const IconWrapper = ({
    href,
    onClick,
    children,
    label,
  }: {
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
    label: string;
  }) => {
    const [hover, setHover] = useState(false);

    const style = hover
      ? { ...iconStyle, ...hoverStyle }
      : iconStyle;

    if (href) {
      return (
        <a
          href={href}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
          style={style}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        onClick={onClick}
        aria-label={label}
        style={{
          ...style,
          border: "none",
          cursor: "pointer",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {children}
      </button>
    );
  };

  return (
    <div style={{ marginTop: 40 }}>
      {title && (
        <p style={{ fontWeight: 600, marginBottom: 12 }}>
          Share this story
        </p>
      )}

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <IconWrapper
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          label="Share on Facebook"
        >
          <Facebook size={18} />
        </IconWrapper>

        <IconWrapper
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          label="Share on X"
        >
          <Twitter size={18} />
        </IconWrapper>

        <IconWrapper
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          label="Share on LinkedIn"
        >
          <Linkedin size={18} />
        </IconWrapper>

        <IconWrapper
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
          label="Share on WhatsApp"
        >
          <Send size={18} />
        </IconWrapper>

        <IconWrapper
          href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
          label="Share via Email"
        >
          <Mail size={18} />
        </IconWrapper>

        <IconWrapper
          onClick={copyLink}
          label="Copy link"
        >
          <LinkIcon size={18} />
        </IconWrapper>
      </div>
    </div>
  );
}
