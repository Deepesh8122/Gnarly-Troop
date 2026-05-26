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

export default function SocialShareFloating({ title }: { title: string }) {
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);
  const [url, setUrl] = useState("");
  const [offsetBottom, setOffsetBottom] = useState(0);

  // ----------------------------------
  // Setup URL + responsive detection
  // ----------------------------------
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    setUrl(`${window.location.origin}${pathname}`);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname]);

  // ----------------------------------
  // Footer-aware positioning (KEY FIX)
  // ----------------------------------
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Lift the share icons above footer
          setOffsetBottom(entry.boundingClientRect.height + 24);
        } else {
          setOffsetBottom(0);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (!url) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    alert("Link copied");
  };

  // ----------------------------------
  // Styles
  // ----------------------------------
  const baseStyle: React.CSSProperties = {
    width: isMobile ? 38 : 44,
    height: isMobile ? 38 : 44,
    borderRadius: "50%",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
    transition: "all 0.25s ease",
  };

  const hoverStyle: React.CSSProperties = {
    transform: "translateX(-3px)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
  };

  const Icon = ({
    href,
    children,
    onClick,
  }: {
    href?: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => {
    const [hover, setHover] = useState(false);
    const style = hover ? { ...baseStyle, ...hoverStyle } : baseStyle;

    if (href) {
      return (
        <a
          href={href}
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
        style={{ ...style, border: "none", cursor: "pointer" }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {children}
      </button>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        right: isMobile ? 12 : 24,
        bottom: offsetBottom || undefined,
        top: offsetBottom ? undefined : "50%",
        transform: offsetBottom ? "none" : "translateY(-50%)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 10 : 12,
      }}
    >
      <Icon href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}>
        <Facebook size={isMobile ? 16 : 20} />
      </Icon>

      <Icon
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
      >
        <Twitter size={isMobile ? 16 : 20} />
      </Icon>

      <Icon
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
      >
        <Linkedin size={isMobile ? 16 : 20} />
      </Icon>

      <Icon
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
      >
        <Send size={isMobile ? 16 : 20} />
      </Icon>

      <Icon href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}>
        <Mail size={isMobile ? 14 : 18} />
      </Icon>

      <Icon onClick={copyLink}>
        <LinkIcon size={isMobile ? 14 : 18} />
      </Icon>
    </div>
  );
}
