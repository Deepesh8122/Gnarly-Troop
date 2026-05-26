"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./SectionSikkimPackage.module.css";

const highlights = [
  {
    label: "Discovery Documentary",
    img: "https://www.gnarlytroop.org/padharo/camp.png",
  },
  {
    label: "Global Youth Leadership",
    img: "https://www.gnarlytroop.org/padharo/12.png",
  },
  {
    label: "Certification & Troop Honor",
    img: "https://www.gnarlytroop.org/padharo/13.png",
  },
  {
    label: "Community Outreach",
    img: "https://www.gnarlytroop.org/padharo/14.png",
  },
  {
    label: "Government Alignment",
    img: "https://www.gnarlytroop.org/padharo/15.png",
  },
];

const itinerary = [
  { place: "New Delhi", date: "February, 22nd 2026" },
  { place: "Lucknow", date: "February, 23rd 2026" },
  { place: "Ayodhya", date: "February, 23rd 2026" },
  { place: "Varanasi", date: "February, 24th 2026" },
  { place: "Nalanda & Rajgir", date: "February, 25th 2026" },
  { place: "Darjeeling", date: "February, 26th-28th 2026" },
  { place: "Sikkim", date: "March, 1st 2026" },
  { place: "New Delhi", date: "March, 3rd 2026" },
];

export default function SectionSikkimPackage() {
  const rootRef = useRef<HTMLElement | null>(null);
  const itineraryRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  // Intersection reveal (simple)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq && mq.matches) return;

    const section = rootRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) el.classList.add(styles.revealed);
          else if (window.innerWidth > 768)
            el.classList.remove(styles.revealed);
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    section
      .querySelectorAll(`.${styles.revealTarget}`)
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-scroll itinerary (RAF loop)
  useEffect(() => {
    const container = itineraryRef.current;
    if (!container) return;

    // Hide native focus outline but keep accessibility — we'll allow keyboard pause by focus
    const speed = 36; // pixels per second (tweakable)

    const step = (now: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = now;
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (!pausedRef.current) {
        // advance
        const px = (speed * delta) / 1000;
        container.scrollLeft = container.scrollLeft + px;

        // loop: if reached end, jump to start smoothly
        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - 1
        ) {
          // small timeout to avoid jarring; set to start
          container.scrollLeft = 0;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    const onEnter = () => (pausedRef.current = true);
    const onLeave = () => {
      pausedRef.current = false;
      // reset lastTime to avoid large jump
      lastTimeRef.current = null;
    };

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    container.addEventListener("focusin", onEnter);
    container.addEventListener("focusout", onLeave);

    // also pause/resume on touchstart/touchend for mobile
    container.addEventListener("touchstart", onEnter, { passive: true });
    container.addEventListener("touchend", onLeave, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("focusin", onEnter);
      container.removeEventListener("focusout", onLeave);
      container.removeEventListener("touchstart", onEnter);
      container.removeEventListener("touchend", onLeave);
    };
  }, []);

  return (
    <section
      className={styles.section}
      ref={rootRef}
      aria-labelledby="sikkim-title"
    >
      <div className={styles.header}>
        <h1
          id="sikkim-title"
          className={`${styles.title} ${styles.revealTarget}`}
        >
          Darjeeling & Sikkim
        </h1>
        <div className={`${styles.subtitle} ${styles.revealTarget}`}>
          8 Days / 7 Nights
        </div>
      </div>

      <div
        className={`${styles.itineraryRow} ${styles.revealTarget}`}
        ref={itineraryRef}
        tabIndex={0} /* allow keyboard focus to pause/resume */
        aria-label="Itinerary carousel (auto-scrolling, hover to pause)"
      >
        {itinerary.map((item, i) => (
          <div
            className={styles.itineraryCard}
            key={i}
            role="article"
            aria-label={`${item.place} - ${item.date}`}
          >
            <div className={styles.place}>{item.place}</div>
            <div className={styles.date}>{item.date}</div>
          </div>
        ))}
      </div>

      <div className={styles.imagesRow}>
        {highlights.map((item, i) => (
          <figure
            className={`${styles.imageCard} ${styles.revealTarget}`}
            key={i}
            aria-labelledby={`cap-${i}`}
            role="group"
          >
            <img
              src={item.img}
              alt={item.label}
              className={styles.highlightImg}
              width={800}
              height={500}
              loading="lazy"
            />
            <figcaption id={`cap-${i}`} className={styles.caption}>
              {item.label}
            </figcaption>
          </figure>
        ))}
      </div>

      <h2 className={`${styles.finalReport} ${styles.revealTarget}`}>
        Final Report to the Hon'ble President of India
      </h2>
      <a
        href="https://www.gnarlytroop.org/padharo-mhare-desh/destinations/"
        target="_blank"
        className={styles.joinButton}
      >
        Join Now
      </a>
    </section>
  );
}
