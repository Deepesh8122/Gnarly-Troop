"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { CollaborationDetail } from "@/src/data/collaborationData";
import ScrollReveal from "@/components/ui/ScrollReveal";
import styles from "./SectionCollaborationDetail.module.css";

const PILLAR_ICONS = ["🌾", "🎓", "💻", "🤝", "🏥", "🔧"];

type Props = {
  detail: CollaborationDetail;
};

export default function SectionCollaborationDetail({ detail }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className={styles.page}>
      {/* Mint hero + intro */}
      <div className={styles.topBand}>
        <div className={styles.inner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/collaboration">Collaboration</Link>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>
              {detail.title.replace(/EXPANDING |GLOBAL |HUMANITARIAN |ACADEMIC & /i, "").slice(0, 40)}
            </span>
          </nav>

          <ScrollReveal>
            <h1 className={styles.pageTitle}>{detail.title}</h1>
            <p className={styles.subtitle}>{detail.subtitle}</p>
            {detail.lead.map((p) => (
              <p key={p.slice(0, 30)} className={styles.lead}>
                {p}
              </p>
            ))}
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className={styles.heroFrame}>
              <div className={styles.heroScreen}>
                {detail.heroVideo ? (
                  <>
                    <video
                      ref={videoRef}
                      className={styles.heroVideo}
                      src={detail.heroVideo}
                      playsInline
                      controls={isPlaying}
                      poster={detail.heroImage}
                    />
                    {!isPlaying && (
                      <button
                        type="button"
                        className={styles.playButton}
                        aria-label="Play video"
                        onClick={handlePlay}
                      >
                        <span className={styles.playIcon} />
                        <span className={styles.videoCaption}>
                          Watch how our partners create lasting impact in the field.
                        </span>
                      </button>
                    )}
                  </>
                ) : (
                  <img
                    src={detail.heroImage}
                    alt=""
                    className={styles.heroImage}
                  />
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {detail.stat && (
        <section className={styles.statsSection}>
          <div className={styles.inner}>
            <ScrollReveal>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{detail.stat.value}</div>
                  <p className={styles.statLabel}>{detail.stat.label}</p>
                  {detail.stat.source && (
                    <span className={styles.statSource}>{detail.stat.source}</span>
                  )}
                </div>
                <div className={styles.whyCol}>
                  <h2>{detail.whyTitle ?? "Why this matters"}</h2>
                  <ul>
                    {detail.whyBullets.map((b) => (
                      <li key={b.slice(0, 24)}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      <section className={styles.quoteBand}>
        <ScrollReveal>
          <blockquote>{detail.pullQuote}</blockquote>
        </ScrollReveal>
      </section>

      <section className={styles.howSection}>
        <div className={styles.inner}>
          <ScrollReveal>
            <h2 className={styles.howTitle}>
              How we work on {detail.title.toLowerCase()}
            </h2>
          </ScrollReveal>
          <div className={styles.howGrid}>
            {detail.howWeWork.map((pillar, i) => (
              <ScrollReveal key={pillar.title} delay={i * 0.08}>
                <article className={styles.howCard}>
                  <span className={styles.pillarIcon} aria-hidden>
                    {PILLAR_ICONS[i % PILLAR_ICONS.length]}
                  </span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                  <Link href="/collaboration" className={styles.learnMore}>
                    Learn more
                  </Link>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.bodySection}>
        <div className={styles.inner}>
          <ScrollReveal>
            <div className={styles.bodyContent}>
              {detail.body.split("\n\n").map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className={styles.storiesSection}>
        <div className={styles.inner}>
          <ScrollReveal>
            <div className={styles.storiesHeader}>
              <h2 className={styles.storiesTitle}>
                Stories and insights from the field
              </h2>
            </div>
          </ScrollReveal>
          <div className={styles.storiesTrack}>
            {detail.relatedStories.map((story, i) => (
              <ScrollReveal key={story.slug} delay={i * 0.06} className={styles.storyWrap}>
                <Link
                  href={`/collaboration/${story.slug}`}
                  className={styles.storyCard}
                >
                  <div className={styles.storyImageWrap}>
                    <img src={story.imageSrc} alt="" />
                  </div>
                  <span className={styles.storyType}>{story.type}</span>
                  <h3>{story.title}</h3>
                  <p>{story.caption}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
