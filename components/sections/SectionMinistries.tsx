"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "@/app/ministries.module.css";

type Item = {
  id: string;
  img: string;
  title1: string;
  title2?: string;
  description: string;
};

const ITEMS: Item[] = [
  {
    id: "1",
    img: "/images/logos/head-ministry-of-culture-tourism.png",
    title1:
      "Aligned with: Incredible India | Ek Bharat Shreshtha Bharat | Dekho Apna Desh | Cultural Capital Vision",
    title2: "National Synergy:",
    description:
      "Showcasing India's civilizational legacy through youth-led expeditions, eco-spiritual tourism, and cultural enrichment. Enhancing global visibility for folk artists, tribal performers, and heritage knowledge. The 'Explore Bharat' campaign brings local traditions to national audiences while supporting sustainable cultural tourism initiatives.",
  },
  {
    id: "2",
    img: "/images/logos/head-ministry-of-external-affairs.png",
    title1:
      "Aligned with: Know India Pro- gramme | Public Diplomacy | Diaspora Engagement",
    title2: "National Synergy:",
    description:
      "Expands KIP through immersive on- ground programs for diaspora youth and global influencers. Engages embassies, NRIs, and youth leaders in Bharat experiences. Strengthens cultural diplomacy via innovation showcases and community ties, fostering people-to-people diplomacy and reinforcing India's global leadership rooted in diversity, democracy, and shared valuesnarratives. legacy, and interfaith harmony for sustainable future.",
  },
  {
    id: "3",
    img: "/images/logos/head-ministry-of-defence.png",
    title1:
      "Aligned with: Troop Leadership | NCC | United Bharat | Safeguarding National Interests",
    title2: "National Synergy:",
    description:
      "Empowering youth through Sainik School camps, Troop Marathons, and patriotic marches. Showcasing NCC cadets and defence alumni as role models of discipline and service. Ex-servicemen mentor leadership programs, nurturing civic values. Fostering unity through the motto: `My Country, My Responsibility, My Pride.` The Gnarly Troop code is a celebration of India's spirit, culture, and timeless soul.",
  },
  {
    id: "4",
    img: "/images/logos/head-ministry-of-youth-affairs-and-sports.png",
    title1: "Aligned with: Atmnirbhar Bharat | Yuva Shakti | Fit India",
    title2: "National Synergy:",
    description:
      "Empowering youth through 4C vision: Climate, Community, Culture, Cooperation. Providing national and international internships, fellowships, and certified volunteering. Fostering innovation hubs and startups aligned with Digital India, Make in India and Fit India. Building a global youth leadership Grid connecting youth with community outreach and camping initiatives. Our mission is Global Network for Active & Responsibile Leadership amongst Youths (GNARLY).",
  },
  {
    id: "5",
    img: "/images/logos/head-ministry-of-rural-development.png",
    title1:
      "Aligned with: Mission Antyodaya | Atmanirbhar Bharat | Sansad Adarsh Gram Yojana",
    title2: "National Synergy:",
    description:
      "The campaign transforms adopted villages into innovation labs with eco-tourism, climate education, and rural entrepreneurship. It nurtures sustainable livelihoods, crafts, and youth internships, celebrating rural India as the soul of an inclusive Bharat—deeply rooted in Mission Antyodaya and Sansad Adarsh Gram Yojana for Atmanirbhar Bharat. Troops aim to enhance rural health, education, and livelihoods to build empowered, self-reliant village communities.",
  },
  {
    id: "6",
    img: "/images/logos/head-ministry-of-education.png",
    title1:
      "Aligned with: NEP 2020 | Experiential Learning | Bharat Centric Knowledge System",
    title2: "National Synergy:",
    description:
      "Promoting experiential learning through heritage tours, cultural mapping, and value based education. Implementing the `Explore Bharat with Troop spirit` curriculum across schools and universities. Fostering spiritual and cultural education rooted in Indian philosophy, values, and languages. Encouraging collaborative student research on india's civilizational contributions. Building nation- first youth consciousness through immersive learning.",
  },
];

export default function ImageCarousel({
  autoplayInterval = 3000,
}: {
  autoplayInterval?: number;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [cardSize, setCardSize] = useState<number>(0);
  const [current, setCurrent] = useState(0);
  const [pages, setPages] = useState(ITEMS.length);

  const pausedRef = useRef(false);
  const lastInteractionRef = useRef<number>(Date.now());

  // measure card width + compute pages (number of distinct scroll positions)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measure = () => {
      const first = el.querySelector<HTMLElement>(`.${styles.slide}`);
      if (!first) return;

      const gap = parseFloat(getComputedStyle(el).columnGap || "24") || 24;
      const card = first.offsetWidth + gap;
      setCardSize(card);

      // compute pages: number of distinct steps = floor(totalScroll / card) + 1
      // where totalScroll = max(0, scrollWidth - clientWidth)
      const totalScrollable = Math.max(0, el.scrollWidth - el.clientWidth);
      const computedPages = Math.max(1, Math.floor(totalScrollable / card) + 1);
      // But ensure we don't exceed number of items (defensive)
      setPages(Math.min(computedPages, ITEMS.length));
      // also ensure current is within bounds
      setCurrent((c) => Math.min(c, Math.max(0, computedPages - 1)));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // update current index while scrolling and cap by pages-1
  useEffect(() => {
    const el = trackRef.current;
    if (!el || cardSize === 0) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const raw = Math.round(el.scrollLeft / cardSize);
        const capped = Math.min(Math.max(0, raw), Math.max(0, pages - 1));
        setCurrent(capped);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, [cardSize, pages]);

  // autoplay
  useEffect(() => {
    if (cardSize === 0) return;
    const timer = setInterval(() => {
      if (pausedRef.current) {
        if (Date.now() - lastInteractionRef.current > 3000) {
          pausedRef.current = false;
        } else {
          return;
        }
      }

      const el = trackRef.current;
      if (!el) return;
      // if at end, go to start
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      if (Math.abs(el.scrollLeft - maxScrollLeft) < 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: cardSize, behavior: "smooth" });
      }
    }, autoplayInterval);
    return () => clearInterval(timer);
  }, [cardSize, autoplayInterval]);

  function markInteraction() {
    pausedRef.current = true;
    lastInteractionRef.current = Date.now();
  }

  // pause on pointer enter / touch
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onPointerEnter = () => {
      pausedRef.current = true;
      lastInteractionRef.current = Date.now();
    };
    const onPointerLeave = () => {
      lastInteractionRef.current = Date.now();
    };
    const onTouchStart = () => {
      pausedRef.current = true;
      lastInteractionRef.current = Date.now();
    };
    el.addEventListener("pointerenter", onPointerEnter);
    el.addEventListener("pointerleave", onPointerLeave);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    return () => {
      el.removeEventListener("pointerenter", onPointerEnter);
      el.removeEventListener("pointerleave", onPointerLeave);
      el.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el || cardSize === 0) return;
    el.scrollBy({ left: dir * cardSize, behavior: "smooth" });
    markInteraction();
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el || cardSize === 0) return;
    // clamp i
    const targetIndex = Math.min(Math.max(0, i), Math.max(0, pages - 1));
    el.scrollTo({ left: targetIndex * cardSize, behavior: "smooth" });
    markInteraction();
  };

  // render dots based on computed pages
  return (
    <div className={styles.carousel}>
      <button
        className={`${styles.nav} ${styles.left}`}
        aria-label="Previous"
        onClick={() => scrollBy(-1)}
        type="button"
      >
        ‹
      </button>

      <div className={styles.viewport}>
        <div ref={trackRef} className={styles.track} role="list">
          {ITEMS.map((it) => (
            <article
              key={it.id}
              className={styles.slide}
              role="listitem"
              aria-roledescription="slide"
              onPointerDown={markInteraction}
              onTouchStart={markInteraction}
            >
              <div className={styles.topImageWrap}>
                <img src={it.img} alt={it.title1} className={styles.topImage} />
              </div>

              <h4 className={styles.title1}>{it.title1}</h4>
              {it.title2 && <h5 className={styles.title2}>{it.title2}</h5>}

              <p className={styles.description}>{it.description}</p>
            </article>
          ))}
        </div>
      </div>

      <button
        className={`${styles.nav} ${styles.right}`}
        aria-label="Next"
        onClick={() => scrollBy(1)}
        type="button"
      >
        ›
      </button>

      <div className={styles.dots} role="tablist" aria-label="Slides">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === current}
            type="button"
            onPointerDown={markInteraction}
          />
        ))}
      </div>
    </div>
  );
}
