"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/app/partners.module.css";

type Partner = {
  id: number;
  name: string;
  logo: string;
  short: string;
  description: string;
};

const samplePartners: Partner[] = [
  {
    id: 1,
    name: "Energy Partner",
    logo: "/images/logos/img-urja-logo.png",
    short: "",
    description:
      "Urja Global Ltd , a premier MNRE-approved solar energy pioneer, proudly partners with Gnarly Troop’s flagship initiative — 'Welcome to My Country, India' — as the official CSR Energy Partner. Aligned with the 4C’s Vision of Climate, Community, Culture, Cooperation, Urja is empowering rural electrification, expanding green energy access, illuminating cultural circuits, and supporting youth-driven programs — driving sustainable development and national pride for a resilient, solar-powered Bharat.",
  },
  {
    id: 2,
    name: "Sports Partner",
    logo: "/images/logos/img-decathlon-logo.png",
    short: "",
    description:
      "Decathlon is global sports retailer known for offering a wide range of high quality, affordable sporting goods and equipments. With a mission to make sports accessible to everyone. It provides products for over 80 sports, catering to athletes of all levels. Founded in 1976 in France, the brand is renowned for its innovation, in-house brands, and commitment to sustainability, making it a favourite among sports and enthusiasts worldwide.",
  },
  {
    id: 3,
    name: "Education Partner",
    logo: "/images/logos/img-amity-logo.png",
    short: "",
    description:
      "Amity University is a top private institution in India, offering diverse programs in fields like engineering, management, and law. Known for its academic excellence, modern infrastructure, and global exposure, Amity prepares students for leadership roles through innovative education and research. With campuses in India and abroad, Amity has earned a reputation for nurturing future leaders and fostering holistic development among students.",
  },
  {
    id: 4,
    name: "Technology Partner",
    logo: "/images/logos/img-itd-logo.jpg",
    short: "",
    description: `IT Divine Pvt Ltd is a trusted global technology partner empowering the world’s leading communications and media companies. With deep industry expertise and a strong foundation in engineering excellence, we help our clients navigate the rapidly evolving digital ecosystem. As service providers reinvent their business models and customer experiences, we enable their transformation through innovative software solutions, intelligent automation, and modern network technologies.`,
  },
  {
    id: 5,
    name: "Media Partner",
    logo: "/images/logos/img-jhs-logo.png",
    short: "",
    description:
      "JHS Media is a leading media agency in India, renowned for its innovative approach to digital branding and content creation. Founded in 2023, JHS Media offers a diverse range of services. They are recognized for their commitment to quality, creativity & industry relevance. Branding . Promotions . Content . CreationInfluencer . Marketing . Podcast . PR.",
  },
];

export default function SectionCarousel({
  partners = samplePartners,
  autoPlay = true,
  autoPlayInterval = 4000,
  showArrows = true,
}: {
  partners?: Partner[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [cardWidth, setCardWidth] = useState(300);
  const gap = 16; // must match CSS .track gap

  // ➜ NEW: simple left-aligned sliding, clamped so no blank right side
  const recalc = useCallback(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const firstCard = track.querySelector<HTMLElement>("." + styles.card);
    const cw = container.clientWidth;
    const measuredCardWidth = firstCard
      ? firstCard.offsetWidth
      : Math.min(320, Math.floor(cw * 0.6));

    setCardWidth(measuredCardWidth);

    const step = measuredCardWidth + gap;
    const totalWidth = step * partners.length;
    const maxTranslate = Math.max(0, totalWidth - cw); // how far we can scroll before empty space

    const rawOffset = active * step; // how far we *want* to go
    const clampedOffset = Math.min(rawOffset, maxTranslate); // don't go beyond content

    setTranslateX(-clampedOffset);
  }, [active, gap, partners.length]);

  // recalc on mount + resize
  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(() => recalc());
    if (containerRef.current) ro.observe(containerRef.current);
    if (trackRef.current) ro.observe(trackRef.current);

    const onResize = () => recalc();
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [recalc]);

  // recalc whenever active index changes
  useEffect(() => {
    recalc();
  }, [active, recalc]);

  // autoplay: one-by-one with wrap (last → first)
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % partners.length);
    }, autoPlayInterval);

    return () => window.clearInterval(id);
  }, [autoPlay, autoPlayInterval, isPaused, partners.length]);

  // keyboard navigation (optional: keep simple, no wrap on keyboard)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActive((s) => Math.max(0, s - 1));
      }
      if (e.key === "ArrowRight") {
        setActive((s) => Math.min(partners.length - 1, s + 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [partners.length]);

  const centerSlide = (idx: number) => {
    // now: actually "make it the left-most visible"
    setActive(idx);
  };

  const goPrev = () => {
    setActive((prev) => (prev - 1 + partners.length) % partners.length);
  };

  const goNext = () => {
    setActive((prev) => (prev + 1) % partners.length);
  };

  return (
    <section className={styles.wrapper} aria-label="Partners carousel">
      <h2 className={styles.heading}>Trusted by</h2>

      <div
        className={styles.carouselOuter}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {showArrows && (
          <button
            className={styles.arrowLeft}
            aria-label="Previous"
            onClick={goPrev}
          >
            ‹
          </button>
        )}

        <div className={styles.viewport} ref={containerRef}>
          <div
            className={styles.track}
            ref={trackRef}
            style={{
              transform: `translateX(${translateX}px)`,
            }}
            tabIndex={-1}
          >
            {partners.map((p, i) => (
              <article
                key={p.id}
                className={`${styles.card} ${
                  i === active ? styles.cardActive : ""
                }`}
                onClick={() => centerSlide(i)}
                role="button"
                aria-pressed={i === active}
              >
                <div className={styles.cardHeader}>
                  <h3 className={styles.name}>{p.name}</h3>
                </div>
                <div className={styles.logoWrap}>
                  <img
                    src={p.logo}
                    alt={p.name}
                    width={500}
                    height={90}
                    className={styles.logo}
                  />
                </div>
                <div className={styles.short}>{p.short}</div>
                <p className={styles.desc}>{p.description}</p>
              </article>
            ))}
          </div>
        </div>

        {showArrows && (
          <button
            className={styles.arrowRight}
            aria-label="Next"
            onClick={goNext}
          >
            ›
          </button>
        )}
      </div>

      <div className={styles.dots}>
        {partners.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
            onClick={() => centerSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className={styles.note}>
        <p>
          The event's goals include cultural showcases, community engagement, &
          brand exposure. Lets get connected to empower the public vision and
          your brand
        </p>
      </div>
    </section>
  );
}
