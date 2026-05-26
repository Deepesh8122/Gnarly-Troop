"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "@/app/minister-letter.module.css";

export type Card = {
  id: string | number;
  image: string;
  name: string;
  title: string;
  certificateUrl?: string;
};

type Props = {
  cards: Card[]; // 🔥 FULLY DYNAMIC DATA
  staticImage?: string;
};

export default function SectionMinisterLetter({
  cards,
  staticImage = "/images/sections/img-globe-girl-flag-2.png",
}: Props) {
  const FALLBACK = "/mnt/data/HorizontalBorder.png";

  const items = cards; // 🔥 No more defaultCards logic

  // Refs & State
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Measure width
  useEffect(() => {
    function measure() {
      const el = viewportRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const width = Math.max(Math.floor(rect.width), 320);
      setViewportWidth(width);
    }

    measure();

    let ro: ResizeObserver | null = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(measure);
      if (viewportRef.current) ro.observe(viewportRef.current);
    }

    window.addEventListener("resize", measure);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Geometry
  const GAP = 20;
  const MAIN_RATIO = 0.54;

  const rawWidth = viewportWidth ? viewportWidth * MAIN_RATIO : 280;
  const cardWidth = Math.max(240, Math.min(rawWidth, viewportWidth));

  const initialOffset = (viewportWidth - cardWidth) / 2;
  const maxIndex = items.length - 1;

  const STEP = cardWidth + GAP;
  const trackTranslate = -(index * STEP) + initialOffset;
  const trackWidth = items.length * STEP;

  // Navigation
  function goTo(i: number) {
    if (i < 0 || i > maxIndex || i === index) return;
    setIsAnimating(true);
    setIndex(i);
    setTimeout(() => setIsAnimating(false), 420);
  }

  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  const onCardClick = (i: number) => {
    if (i !== index) goTo(i);
  };

  // Fallback for broken images
  function handleImgError(e: any) {
    if (!e.target.src.includes(FALLBACK)) {
      e.target.src = FALLBACK;
    }
  }

  return (
    <section
      className={`${styles["sml2-root"]} ${
        isAnimating ? styles.animating : ""
      }`}
    >
      <div className={`${styles["sml2-grid"]} ${styles["sml2-6040"]}`}>
        {/* LEFT COLUMN (60%) */}
        <div className={`${styles["sml2-col"]} ${styles["sml2-left"]}`}>
          <div className={styles["sml2-static"]}>
            <img
              src={staticImage}
              className={styles["sml2-static-img"]}
              onError={handleImgError}
              alt=""
            />
          </div>
        </div>

        {/* RIGHT COLUMN (40%) */}
        <div className={`${styles["sml2-col"]} ${styles["sml2-right"]}`}>
          <div className={styles["sml2-carousel"]} ref={viewportRef}>
            <div
              className={styles["sml2-track"]}
              style={{
                width: `${trackWidth}px`,
                transform: `translateX(${trackTranslate}px)`,
                transition: "transform 420ms cubic-bezier(.22,.9,.3,1)",
                gap: `${GAP}px`,
              }}
            >
              {items.map((c, i) => {
                const pos = i - index;
                const posClass =
                  pos === 0
                    ? "active"
                    : pos === -1
                    ? "prev"
                    : pos === 1
                    ? "next"
                    : "far";

                return (
                  <article
                    key={c.id}
                    className={`${styles["sml2-card"]} ${styles[posClass]}`}
                    style={{ width: `${cardWidth}px`, height: "490px" }}
                    onClick={() => onCardClick(i)}
                  >
                    <div className={styles["sml2-media"]}>
                      <img
                        src={c.image}
                        alt={c.name}
                        className={styles["sml2-img"]}
                        onError={handleImgError}
                      />
                    </div>

                    <div className={styles["sml2-body"]}>
                      <h3 className={styles["sml2-name"]}>{c.name}</h3>
                      <p className={styles["sml2-title"]}>{c.title}</p>

                      <div className={styles["sml2-footer"]}>
                        <a
                          className={styles["sml2-cert"]}
                          href={c.certificateUrl || FALLBACK}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Certificate
                          <span className={styles["sml2-underline"]}></span>
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* CONTROLS */}
            <div className={styles["sml2-controls"]}>
              <button
                className={`${styles["sml2-arrow"]} ${styles["sml2-prev"]}`}
                disabled={index === 0}
                onClick={prev}
              >
                ‹
              </button>

              <button
                className={`${styles["sml2-arrow"]} ${styles["sml2-next"]}`}
                disabled={index === maxIndex}
                onClick={next}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
