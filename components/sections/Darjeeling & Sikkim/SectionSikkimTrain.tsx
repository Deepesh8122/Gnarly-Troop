"use client";

import styles from "./SectionSikkimTrain.module.css";

export default function SectionSikkimTrain() {
  return (
    <section className={styles.wrapper}>
      {/* HERO IMAGE */}
      <div className={styles.hero}>
        <img
          src="/images/landingpage/sikkim-train-banner.png"
          alt="Explore Bharat with Gnarly Troop – Sikkim Train Journey"
          className={styles.heroImage}
        />
      </div>

      {/* CONTENT BELOW IMAGE */}
      <div className={styles.content}>
        {/* Subtitle with top & bottom lines */}
        <p className={styles.subtitle}>
          <span className={styles.topLine} />
          <span className={styles.subtitleText}>
            EXPLORE BHARAT WITH GNARLY TROOP
          </span>
          <span className={styles.bottomLine} />
        </p>

        <h1 className={styles.title}>
          TROOP CULTURAL EXCHANGE & CAMPING – 2026
        </h1>

        <p className={styles.recognised}>
          Recognised by Hon’ble Minister of Culture & Tourism, Government of
          India
        </p>

        <div className={styles.values}>
          CLIMATE <span>∙</span> COMMUNITY <span>∙</span> CULTURE <span>∙</span>{" "}
          COOPERATION
        </div>
      </div>
    </section>
  );
}
