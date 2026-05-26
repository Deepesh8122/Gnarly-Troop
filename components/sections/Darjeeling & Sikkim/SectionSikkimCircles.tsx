"use client";

import styles from "./SectionSikkimCircles.module.css";

const items = [
  { label: "Hospitality", icon: "/images/sikkimSection/support.png" },
  { label: "Energy Level", icon: "/images/sikkimSection/proudness.png" },
  { label: "Dependability", icon: "/images/sikkimSection/consulting.png" },
  {
    label: "Communication Skills",
    icon: "/images/sikkimSection/dependencies.png",
  },
  { label: "Personal Pride", icon: "/images/sikkimSection/chart-up.png" },
  { label: "Teamwork", icon: "/images/sikkimSection/collaboration.png" },
];

export default function SectionSikkimCircles() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        {items.map((item, index) => (
          <div key={index} className={styles.circleItem}>
            <div className={styles.circle}>
              <img src={item.icon} alt={item.label} />
            </div>
            <p className={styles.label}>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
