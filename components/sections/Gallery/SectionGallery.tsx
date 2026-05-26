"use client";

import React, { useState } from "react";
import PopupLightbox from "./PopupLightbox";
import styles from "./gallery.module.css";

type Section = {
  id: string; // folder slug
  imageInitial: string;
  title: string;
  count: number;
  cover?: string;
};

// YOUR SECTIONS
// const sections: Section[] = [
//   { id: "climate", title: "Climate Excellence", count: 10 },
//   { id: "community", title: "Community Engagement", count: 9 },
//   { id: "cultural", title: "Cultural Excellence", count: 12 },
//   { id: "cooperation", title: "Cooperation Excellence", count: 10 },
// ];

export default function GallerySections({ sections }: { sections: Section[] }) {
  const [openSection, setOpenSection] = useState<Section | null>(null);

  const scrollLeft = () => {
    const el = document.getElementById("sectionsCarousel");
    el?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    const el = document.getElementById("sectionsCarousel");
    el?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section
      id="sectionGallery"
      className={styles.galleryWrapper}
      aria-label="Gallery sections"
    >
      <h2 className={styles.pageHeading}>Gallery</h2>

      {/* CAROUSEL WRAPPER */}
      <div className={styles.sectionsCarouselWrapper}>
        <button className={styles.carouselArrowLeft} onClick={scrollLeft}>
          ‹
        </button>

        {/* HORIZONTAL SCROLLABLE LIST */}
        <div id="sectionsCarousel" className={styles.sectionsCarousel}>
          {sections.map((s) => {
            const cover = s.cover ?? `/images/gallery/${s.id}/cover.jpg`;

            return (
              <button
                key={s.id}
                className={styles.sectionCard}
                onClick={() => setOpenSection(s)}
              >
                <div className={styles.cardImageWrap}>
                  <img src={cover} alt={s.title} className={styles.cardImage} />
                </div>

                <div className={styles.cardMeta}>
                  <h3 className={styles.cardTitle}>{s.title}</h3>
                  <p className={styles.cardCount}>{s.count} Images</p>
                </div>
              </button>
            );
          })}
        </div>

        <button className={styles.carouselArrowRight} onClick={scrollRight}>
          ›
        </button>
      </div>

      {/* POPUP */}
      {openSection && (
        <PopupLightbox
          section={openSection}
          onClose={() => setOpenSection(null)}
        />
      )}
    </section>
  );
}
