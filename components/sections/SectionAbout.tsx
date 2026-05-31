import React from "react";
import styles from "@/app/about.module.css";

type Props = {
  titleHi?: string;
  titleEn?: string;
  subtitle?: string;
  estd?: string;
  backgroundImage?: string;
};

export default function SectionAbout({
  titleHi = "स्वागतम् मम राष्ट्रे भारतवर्षे !",
  titleEn = "Welcome to My Country, India",
  subtitle = "Explore Bharat with Gnarly Troop",
  estd = "EST. 2013",
  backgroundImage = "/images/sections/bg-about-country-maps.png",
}: Props) {
  return (
    <section
      id="sectionAbout"
      className={styles["hero-map-root"]}
      role="region"
      aria-label="Welcome to India map hero"
    >
      <div className={styles["hero-map-viewport"]}>
        <img
          src={backgroundImage}
          alt="World map with India highlighted"
          className={styles["hero-map-image"]}
          aria-hidden="true"
        />

        <div className={styles["hero-content"]}>
          <h1 className={styles["hero-title-hi"]}>{titleHi}</h1>
          <h2 className={styles["hero-title-en"]}>{titleEn}</h2>

          <p className={styles["hero-sub"]}>
            <span className={styles["hero-sub-text"]}>{subtitle}</span>
            <span className={styles["hero-sub-estd"]}>{estd}</span>
          </p>

          <div className={styles.legend}>
            <div className={styles["legend-bar"]} aria-hidden>
              <span className={`${styles.dot} ${styles["dot-left"]}`} />
              <span className={`${styles.dot} ${styles["dot-center"]}`} />
              <span className={`${styles.dot} ${styles["dot-right"]}`} />
            </div>

            <div className={styles["legend-labels"]}>
              <span className={styles["legend-item"]} style={{ color: "var(--pink)" }}>
                My Country
              </span>
              <span
                className={styles["legend-item"]}
                style={{ color: "var(--accent-2)" }}
              >
                My Responsibility
              </span>
              <span className={styles["legend-item"]} style={{ color: "var(--blue)" }}>
                My Pride
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
