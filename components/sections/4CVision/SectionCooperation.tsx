"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SectionCooperation.module.css";
import ShareComponent from "@/components/sections/4CVision/SectionVisionShare";

import {
  featuredStory as staticFeatured,
  largeCards as staticLarge,
  smallCards as staticSmall,
} from "@/app/data/cooperationStories";
import type { VisionPillarPageData } from "@/lib/cms/vision";
import { mapVisionPillarCards } from "@/lib/4cvision/pillar-cards";

export default function SectionCooperation({ cmsData }: { cmsData?: VisionPillarPageData | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  const { featured, large, small, pageTitle, pageSubTitle, leads } = mapVisionPillarCards(
    cmsData,
    staticFeatured,
    staticLarge,
    staticSmall,
    {
      pageTitle: "COOPERATION",
      pageSubTitle: "BUILDING BRIDGES FOR A NEW WORLD ORDER",
      leads: [
        "In a world fractured by conflict, competition, and polarization, cooperation is the moral imperative. Inspired by the Indian principle of Vasudhaiva Kutumbakam – The World is One Family, GTGF fosters unity across nations and institutions.",
        "Through global partnerships, peace missions, climate dialogues, academic collaborations, and humanitarian initiatives, borders transform into bridges and shared responsibility becomes the pathway to sustainable global progress.",
      ],
    },
  );

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className={styles.sectionCooperation}>
      {/* ================= TITLE & VIDEO ================= */}
      <div className={styles.topTealBand}>
        <div className={styles.inner}>
          <div className={styles.breadcrumb}>
            <a href="/" className={styles.link}>Home</a>{" "}
            <span className={styles.breadcrumbSpanSlash}>/</span>{" "}
            <a href="/#sectionVisions" className={styles.link}>4C's Vision</a>{" "}
            <span className={styles.breadcrumbSpanSlash}>/</span>{" "}
            <a className={styles.linkSub}>Cooperation</a>
          </div>

          <center>
            <h1 className={styles.pageTitle}>{pageTitle}</h1>
            <h1 className={styles.pageSubTitle}>{pageSubTitle}</h1>
          </center>

          {leads.map((p) => (
            <p key={p.slice(0, 24)} className={styles.lead}>
              {p}
            </p>
          ))}

          <ShareComponent />

          {/* Hero video */}
          <div className={styles.heroFrame}>
            <div className={styles.heroScreen}>
              <video
                ref={videoRef}
                className={styles.heroVideo}
                src="/hero.mp4"
                playsInline
                controls
              />
              {!isPlaying && (
                <button
                  className={styles.playButton}
                  aria-label="Play video"
                  onClick={handlePlay}
                >
                  <span className={styles.playIcon} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= FEATURED ARTICLE ================= */}
      <section className={styles.featuredStrip}>
        <div className={styles.inner}>
          <div className={styles.featuredCard}>
            <div className={styles.featuredText}>
              <p className={styles.featuredKicker}>FEATURED ARTICLE</p>
              <h2 className={styles.featuredTitle}>
                {featured.title}
              </h2>
              <p className={`${styles.featuredBody} ${styles.smallCaptionClamp}`}>
                {featured.caption}
              </p>
              <button
                className={styles.yellowButton}
                onClick={() =>
                  router.push(`/4cvision/cooperation/${featured.slug}`)
                }
              >
                Read Full Story
              </button>
            </div>

            <div className={styles.featuredImageWrap}>
              <img
                src={featured.imageSrc}
                alt={featured.alt}
                className={styles.featuredImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= LARGE CARDS ================= */}
      <section className={styles.articleSection}>
        <div className={styles.inner}>
          <div className={styles.topArticleGrid}>
            {large.map((card) => (
              <article key={card.id} className={styles.largeArticle}>
                <div className={styles.largeImageWrap}>
                  <img
                    src={card.imageSrc}
                    alt={card.alt}
                    className={styles.cardImage}
                  />
                </div>

                <div className={styles.largeContent}>
                  <p className={styles.cardKicker}>{card.kicker}</p>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={`${styles.cardBody} ${styles.smallCaptionClamp}`}>
                    {card.caption}
                  </p>
                  <button
                    className={styles.yellowButton}
                    onClick={() =>
                      router.push(`/4cvision/cooperation/${card.slug}`)
                    }
                  >
                    Read Full Story
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* ================= SMALL CARDS ================= */}
          <div className={styles.smallGrid}>
            {small.map((card) => (
              <article key={card.id} className={styles.smallCard}>
                <div className={styles.smallImageWrap}>
                  <img
                    src={card.imageSrc}
                    alt={card.alt}
                    className={styles.cardImage}
                  />
                </div>

                <div className={styles.smallContent}>
                  <h4 className={styles.smallTitle}>{card.title}</h4>
                  <p className={`${styles.smallBody} ${styles.smallCaptionClamp}`}>
                    {card.caption}
                  </p>
                  <button
                    className={styles.yellowButton}
                    onClick={() =>
                      router.push(`/4cvision/cooperation/${card.slug}`)
                    }
                  >
                    Read Full Story
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
