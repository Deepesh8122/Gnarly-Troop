import React from "react";
import styles from "@/app/about.module.css";

export default function SectionAbout() {
  return (
    <section
      id="sectionAbout"
      className={styles["hero-map-root"]}
      role="region"
      aria-label="Welcome to India map hero"
    >
      <div className={styles["hero-map-viewport"]}>
        <img
          src="/images/sections/bg-about-country-maps.png"
          alt="World map with India highlighted"
          className={styles["hero-map-image"]}
          aria-hidden="true"
        />

        <div className={styles["hero-content"]}>
          <h1 className={styles["hero-title-hi"]}>
            स्वागतम् मम राष्ट्रे भारतवर्षे !
          </h1>

          <h2 className={styles["hero-title-en"]}>
            Welcome to My Country, India
          </h2>

          <p className={styles["hero-sub"]}>
            <span className={styles["hero-sub-text"]}>
              Explore Bharat with Gnarly Troop
            </span>
            <span className={styles["hero-sub-estd"]}>EST. 2013</span>
          </p>

          <div className={styles.legend}>
            <div className={styles["legend-bar"]} aria-hidden>
              <span className={`${styles.dot} ${styles["dot-left"]}`} />
              <span className={`${styles.dot} ${styles["dot-center"]}`} />
              <span className={`${styles.dot} ${styles["dot-right"]}`} />
            </div>

            <div className={styles["legend-labels"]}>
              <span
                className={styles["legend-item"]}
                style={{ color: "var(--pink)" }}
              >
                My Country
              </span>

              <span
                className={styles["legend-item"]}
                style={{ color: "var(--accent-2)" }}
              >
                My Responsibility
              </span>

              <span
                className={styles["legend-item"]}
                style={{ color: "var(--blue)" }}
              >
                My Pride
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
