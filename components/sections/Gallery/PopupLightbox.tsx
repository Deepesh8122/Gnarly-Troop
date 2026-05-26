"use client";

import React, { useEffect, useState } from "react";
import styles from "./gallery.module.css";

type Section = {
  id: string;
  imageInitial: string;
  title: string;
  count: number;
  cover?: string;
};

export default function PopupLightbox({
  section,
  onClose,
}: {
  section: Section;
  onClose: () => void;
}) {
  // DEFAULT → carousel opened first
  const [gridOpen, setGridOpen] = useState(false);
  const [carouselOpen, setCarouselOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // images list
  const images = Array.from({ length: section.count }, (_, i) => {
    return `/images/gallery/${section.id}/${section.imageInitial}-${i + 1}.jpg`;
  });

  // keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (carouselOpen) {
          setCarouselOpen(false);
          setGridOpen(true);
        } else {
          onClose();
        }
      }
      if (e.key === "ArrowLeft" && carouselOpen) {
        setActiveIndex((s) => Math.max(0, s - 1));
      }
      if (e.key === "ArrowRight" && carouselOpen) {
        setActiveIndex((s) => Math.min(images.length - 1, s + 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [carouselOpen, images.length, onClose]);

  // open from grid
  const openCarousel = (idx: number) => {
    setActiveIndex(idx);
    setGridOpen(false);
    setCarouselOpen(true);
  };

  const goNext = () =>
    setActiveIndex((s) => Math.min(images.length - 1, s + 1));
  const goPrev = () => setActiveIndex((s) => Math.max(0, s - 1));

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <header className={styles.modalHeader}>
          <h3>{section.title}</h3>
          <div className={styles.modalActions}>
            {gridOpen && (
              <span className={styles.modalCount}>{images.length} images</span>
            )}
            <button className={styles.closeBtn} onClick={onClose}>
              ✕
            </button>
          </div>
        </header>

        <div className={styles.modalBody}>
          {/* GRID */}
          {gridOpen && (
            <>
              <div className={styles.gridButtons}>
                <button className={styles.activeViewBtn}>Grid</button>
                <button
                  onClick={() => {
                    setGridOpen(false);
                    setCarouselOpen(true);
                    setActiveIndex(0);
                  }}
                >
                  Open Carousel
                </button>
              </div>

              <div className={styles.imageGrid}>
                {images.map((src, idx) => (
                  <button
                    key={src}
                    className={styles.gridItem}
                    onClick={() => openCarousel(idx)}
                  >
                    <img src={src} className={styles.gridThumb} />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* CAROUSEL */}
          {carouselOpen && (
            <div className={styles.carouselWrap}>
              <button className={styles.carouselNavLeft} onClick={goPrev}>
                ‹
              </button>

              <div className={styles.carouselViewport}>
                <div className={styles.carouselImageWrap}>
                  <img
                    src={images[activeIndex]}
                    alt={`${section.title} ${activeIndex + 1}`}
                    className={styles.carouselImage}
                  />
                </div>

                <div className={styles.carouselFooter}>
                  <button
                    onClick={() => {
                      setCarouselOpen(false);
                      setGridOpen(true);
                    }}
                    className={styles.backToGrid}
                  >
                    Back to grid
                  </button>

                  <div className={styles.carouselCounter}>
                    {activeIndex + 1} / {images.length}
                  </div>
                </div>
              </div>

              <button className={styles.carouselNavRight} onClick={goNext}>
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
