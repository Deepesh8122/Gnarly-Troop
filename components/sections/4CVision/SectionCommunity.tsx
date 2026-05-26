"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SectionCommunity.module.css";
import ShareComponent from "@/components/sections/4CVision/SectionVisionShare";

import {
  featuredStory,
  largeCards,
  smallCards,
} from "@/app/data/communityStories";

export default function SectionClimate() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className={styles.sectionCommunity}>
      {/* Title and Video section */}
      <div className={styles.topTealBand}>
        <div className={styles.inner}>
          <div className={styles.breadcrumb}>
            <a href="/" className={styles.link}>Home</a>{" "}
            <span className={styles.breadcrumbSpanSlash}>/</span>{" "}
            <a href="/#sectionVisions" className={styles.link}>4C's Vision</a>{" "}
            <span className={styles.breadcrumbSpanSlash}>/</span>{" "}
            <a className={styles.linkSub}>Community</a>
          </div>

          <center>
            <h1 className={styles.pageTitle}>COMMUNITY</h1>
            <h1 className={styles.pageSubTitle}>
              EMPOWERING PEOPLE, STRENGTHENING THE NATION
            </h1>
          </center>

          <p className={styles.lead}>
            True national progress arises from empowered communities, resilient
            villages, and active citizens...
          </p>

          <p className={styles.lead}>
            Troop Culture—discipline, service, unity, and national pride—forms
            the foundation...
          </p>

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

      {/* Featured article */}
      <section className={styles.featuredStrip}>
        <div className={styles.inner}>
          <div className={styles.featuredCard}>
            <div className={styles.featuredText}>
              <p className={styles.featuredKicker}>FEATURED ARTICLE</p>
              <h2 className={styles.featuredTitle}>
                {featuredStory.title}
              </h2>
              <p className={`${styles.featuredBody} ${styles.smallCaptionClamp}`}>
                {featuredStory.caption}
              </p>
              <button
                className={styles.yellowButton}
                onClick={() =>
                  router.push(`/4cvision/community/${featuredStory.slug}`)
                }
              >
                Read Full Story
              </button>
            </div>

            <div className={styles.featuredImageWrap}>
              <img
                src={featuredStory.imageSrc}
                alt={featuredStory.alt}
                className={styles.featuredImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Large cards */}
      <section className={styles.articleSection}>
        <div className={styles.inner}>
          <div className={styles.topArticleGrid}>
            {largeCards.map((card) => (
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
                      router.push(`/4cvision/community/${card.slug}`)
                    }
                  >
                    Read Full Story
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Small cards */}
          <div className={styles.smallGrid}>
            {smallCards.map((card) => (
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
                      router.push(`/4cvision/community/${card.slug}`)
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
