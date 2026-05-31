"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "@/app/headers.module.css";

type MenuItem = {
  id: string;
  label: string;
  // optional: explicit DOM target id (best), or url which may be external or contain fragment/path
  target?: string;
  url?: string;
};

const DEFAULT_MENU: MenuItem[] = [
  { id: "home", label: "Home", url: "/" },
  { id: "about", label: "About", url: "/#sectionAbout" },
  { id: "timeline", label: "Timeline", url: "/#sectionTimelines" },
  { id: "visions", label: "Visions", url: "/#sectionVisions" },
  { id: "gallery", label: "Gallery", url: "/#sectionGallery" },
  { id: "team", label: "Leadership", url: "/leadership" },
  { id: "collaboration", label: "Collaboration", url: "/collaboration" },
];

export default function Header() {
  const [menu, setMenu] = useState<MenuItem[]>(DEFAULT_MENU);
  const [isScrolled, setIsScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(DEFAULT_MENU[0].id);
  const [mobileOpen, setMobileOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const touchStartX = useRef<number | null>(null);
  const dragging = useRef(false);

  useEffect(() => {
    fetch("/api/navigation?menu=main-header")
      .then((r) => r.json())
      .then((data: { items?: { id: string; label: string; url?: string }[] }) => {
        if (data.items?.length) {
          const items: MenuItem[] = data.items.map((item) => ({
            id: item.id,
            label: item.label,
            url: item.url,
          }));
          setMenu(items);
          setActive(items[0]?.id ?? null);
        }
      })
      .catch(() => {
        /* keep default menu */
      });
  }, []);

  /* ---------------------------
     Helpers to resolve menu action
  ---------------------------- */

  // safe check for external-looking url
  const looksExternal = (href: string) => {
    try {
      // If it parses as an absolute URL it's external
      new URL(href, window.location.href);
      // But we consider it external only if it contains a scheme like http(s) or begins with //
      return (
        /^(https?:)?\/\//i.test(href) ||
        /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(href)
      );
    } catch {
      return false;
    }
  };

  // try a few candidate element id formats based on a base id
  const candidateIdsFromBase = (base: string) => {
    const candidates = new Set<string>();
    if (!base) return Array.from(candidates);
    candidates.add(base);
    candidates.add(base.toLowerCase());
    candidates.add(base.replace(/\s+/g, ""));
    // section + capitalized
    candidates.add(`section${base.charAt(0).toUpperCase()}${base.slice(1)}`);
    candidates.add(`sec-${base}`);
    candidates.add(`section-${base}`);
    return Array.from(candidates);
  };

  // main resolver: returns {type: "section", id} or {type: "external", href}
  const resolveMenuAction = (
    m: MenuItem,
  ): { type: "section"; id: string } | { type: "external"; href: string } => {
    // 1) explicit target provided -> prefer it (if element exists)
    if (m.target) {
      if (document.getElementById(m.target))
        return { type: "section", id: m.target };
      // if explicit target doesn't exist, still consider it a section target (scroll attempt) — fallback later
    }

    // 2) if url looks like a fragment (#foo or /path#foo)
    if (m.url) {
      // handle hash fragment like /path#mySection or #mySection
      const hashIndex = m.url.indexOf("#");
      if (hashIndex >= 0) {
        const frag = m.url.slice(hashIndex + 1);
        if (frag && document.getElementById(frag))
          return { type: "section", id: frag };
        // else fall through: maybe the fragment is present on this page but not found, continue heuristics
      }

      // 3) if url is absolute/external -> external
      if (looksExternal(m.url)) {
        return { type: "external", href: m.url };
      }

      // 4) try last path segment of url (e.g., '/whatever/Section1' -> 'Section1')
      const parts = m.url.split("/").filter(Boolean);
      if (parts.length) {
        const last = parts[parts.length - 1];
        // try with/without decoding
        const candidates = [last, decodeURIComponent(last)];
        for (const cand of candidates) {
          if (!cand) continue;
          // try direct match
          if (document.getElementById(cand))
            return { type: "section", id: cand };
          // try candidate variants
          for (const c of candidateIdsFromBase(cand)) {
            if (document.getElementById(c)) return { type: "section", id: c };
          }
        }
      }
    }

    // 5) try using the menu `id` to find elements (common fallback)
    if (m.id) {
      // direct id
      if (document.getElementById(m.id)) return { type: "section", id: m.id };
      // try candidate forms
      for (const c of candidateIdsFromBase(m.id)) {
        if (document.getElementById(c)) return { type: "section", id: c };
      }
    }

    // 6) last resort: if the url looks like something the developer intended to navigate to, treat as external
    if (m.url) return { type: "external", href: m.url };

    // 7) absolute fallback: treat as section using `id` (even if element missing)
    return { type: "section", id: m.target ?? m.id };
  };

  /* ---------------------------
     Smooth Scroll
  ---------------------------- */
  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return; // nothing to scroll to
    const offset = 100; // adjust to match your header height
    const rect = el.getBoundingClientRect();
    const pos = rect.top + window.scrollY - offset;

    window.scrollTo({ top: pos, behavior: "smooth" });

    // update URL hash without jumping or reloading
    try {
      history.replaceState(null, "", `#${id}`);
    } catch {
      // ignore
    }
  };

  // click handler: resolves action and either scrolls or navigates externally
  const onMenuClick = (m: MenuItem) => {
    setActive(m.id); // immediate visual feedback
    setMobileOpen(false);

    const action = resolveMenuAction(m);
    if (action.type === "section") {
      // attempt to scroll — if element isn't present nothing happens
      scrollToElement(action.id);
    } else {
      // external navigation (full page load)
      // keep user intent: if it's an absolute URL, go there; if it's a relative path, navigate there
      window.location.href = action.href;
    }
  };

  /* ---------------------------
     Active menu on scroll (keeps original logic but attempts to match element names using heuristics)
  ---------------------------- */
  useEffect(() => {
    const offset = 120;

    const findSectionForMenu = (menuItem: MenuItem) => {
      // check explicit target first
      if (menuItem.target && document.getElementById(menuItem.target))
        return menuItem.target;

      // check url fragment
      if (menuItem.url) {
        const hIndex = menuItem.url.indexOf("#");
        if (hIndex >= 0) {
          const frag = menuItem.url.slice(hIndex + 1);
          if (frag && document.getElementById(frag)) return frag;
        }
        // last path segment
        const parts = menuItem.url.split("/").filter(Boolean);
        if (parts.length) {
          const last = parts[parts.length - 1];
          if (last && document.getElementById(last)) return last;
          for (const c of candidateIdsFromBase(last)) {
            if (document.getElementById(c)) return c;
          }
        }
      }

      // check menu.id variants
      if (menuItem.id) {
        if (document.getElementById(menuItem.id)) return menuItem.id;
        for (const c of candidateIdsFromBase(menuItem.id)) {
          if (document.getElementById(c)) return c;
        }
      }

      // no matching dom
      return null;
    };

    const updateActive = () => {
      let found: string | null = null;
      for (const item of menu) {
        const sectionId = findSectionForMenu(item);
        if (!sectionId) continue;
        const el = document.getElementById(sectionId);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top - offset <= 0 && r.bottom - offset > 0) {
          found = item.id; // set active to the menu id
          break;
        }
      }
      if (found) setActive(found);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
      updateActive();
    };

    updateActive();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------------------
     Swipe-to-close mobile panel (unchanged)
  ---------------------------- */
  useEffect(() => {
    const panel = panelRef.current;
    const overlay = overlayRef.current;
    if (!panel) return;

    const onStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      dragging.current = true;
      panel.style.transition = "none";
    };

    const onMove = (e: TouchEvent) => {
      if (!dragging.current || touchStartX.current === null) return;
      const dx = e.touches[0].clientX - touchStartX.current;

      if (dx < 0) {
        panel.style.transform = `translateX(${dx}px)`;
        if (overlay) overlay.style.opacity = `${1 - Math.abs(dx) / 250}`;
      }
    };

    const onEnd = () => {
      dragging.current = false;
      panel.style.transition = "";
      panel.style.transform = "";

      if (overlay) overlay.style.opacity = "";

      if (
        touchStartX.current &&
        touchStartX.current - (panel.getBoundingClientRect().left || 0) > 80
      ) {
        setMobileOpen(false);
      }

      touchStartX.current = null;
    };

    panel.addEventListener("touchstart", onStart, { passive: true });
    panel.addEventListener("touchmove", onMove, { passive: true });
    panel.addEventListener("touchend", onEnd);

    return () => {
      panel.removeEventListener("touchstart", onStart);
      panel.removeEventListener("touchmove", onMove);
      panel.removeEventListener("touchend", onEnd);
    };
  }, []);

  /* ---------------------------
     JSX
  ---------------------------- */
  return (
    <>
      <header
        className={`${styles["site-header"]} ${
          isScrolled ? styles.scrolled : ""
        }`}
      >
        <div className={styles["site-inner"]}>
          {/* LOGO + TITLE */}
          <div className={styles["brand-row"]}>
            <img
              src="/images/logos/logo-2.png"
              alt="Gnarly Troop Logo"
              width={272}
              height={72}
              className={styles.logo}
            />
          </div>

          {/* DESKTOP MENU */}
          <nav className={styles["desktop-menu"]}>
            {menu.map((m) => (
              <button
                key={m.id}
                onClick={() => onMenuClick(m)}
                className={`${styles["menu-item"]} ${
                  active === m.id ? styles.active : ""
                }`}
                type="button"
              >
                {m.label}
              </button>
            ))}
          </nav>

          {/* MOBILE TOGGLE */}
          <button
            className={`${styles["mobile-toggle"]} ${
              mobileOpen ? styles.open : ""
            }`}
            onClick={() => setMobileOpen((s) => !s)}
            type="button"
            aria-label="Toggle menu"
          >
            <svg className={styles.hamb} viewBox="0 0 26 16" aria-hidden>
              <rect
                className={`${styles.line} ${styles.top}`}
                x="0"
                y="0"
                width="26"
                height="2"
              />
              <rect
                className={`${styles.line} ${styles.mid}`}
                x="0"
                y="7"
                width="26"
                height="2"
              />
              <rect
                className={`${styles.line} ${styles.bot}`}
                x="0"
                y="14"
                width="26"
                height="2"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* MOBILE MENU LAYER */}
      <div
        ref={overlayRef}
        className={`${styles["mobile-overlay"]} ${
          mobileOpen ? styles.open : ""
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div
          ref={panelRef}
          className={`${styles["mobile-panel"]} ${
            mobileOpen ? styles.open : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles["mobile-head"]}>
            <img src="/images/logos/logo-2.png" width={120} alt="logo" />
            <button
              className={styles["close-btn"]}
              onClick={() => setMobileOpen(false)}
              type="button"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div className={styles["mobile-list"]}>
            {menu.map((m) => (
              <button
                key={m.id}
                onClick={() => onMenuClick(m)}
                className={`${styles["mobile-item"]} ${
                  active === m.id ? styles.active : ""
                }`}
                type="button"
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SPACER */}
      <div className={styles["header-spacer"]} />
    </>
  );
}
