import Link from "next/link";
import styles from "./MoreAboutFoundation.module.css";

const LINKS = [
  {
    title: "Our story",
    description:
      "Learn about the origins of Gnarly Troop and the values that drive our work.",
    href: "/#sectionAbout",
    cta: "Learn more",
  },
  {
    title: "4C Vision",
    description:
      "Explore Climate, Community, Culture, and Cooperation programs shaping Viksit Bharat.",
    href: "/#sectionVisions",
    cta: "Learn more",
  },
  {
    title: "Collaboration",
    description:
      "Read the latest partnership stories and discover how to collaborate with GTGF.",
    href: "/collaboration",
    cta: "Learn more",
  },
];

export default function MoreAboutFoundation() {
  return (
    <section className={styles.section} aria-labelledby="more-about-heading">
      <div className={styles.inner}>
        <h2 id="more-about-heading" className={styles.heading}>
          More about the foundation
        </h2>
        <div className={styles.grid}>
          {LINKS.map((item) => (
            <div key={item.title} className={styles.col}>
              <h3 className={styles.colTitle}>{item.title}</h3>
              <p className={styles.colDesc}>{item.description}</p>
              <Link href={item.href} className={styles.colLink}>
                {item.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
