"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  collaborationLanding,
  type CollaborationInitiative,
} from "@/src/data/collaborationData";
import ScrollReveal from "@/components/ui/ScrollReveal";
import styles from "./SectionCollaborationLanding.module.css";

type LandingContent = typeof collaborationLanding;

type Props = {
  initiatives: CollaborationInitiative[];
  landing: LandingContent | null;
};

export default function SectionCollaborationLanding({ initiatives, landing }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const playHero = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setVideoPlaying(true);
    }
  };

  if (!landing) {
    return (
      <div className={styles.page}>
        <p className="mx-auto max-w-lg p-16 text-center text-zinc-600">
          Collaboration content is not published yet. Import or add content in the admin
          panel.
        </p>
      </div>
    );
  }

  const L = landing;

  return (
    <div className={styles.page}>
      {/* Full-width hero video */}
      <section className={styles.heroShell}>
        <div className={styles.heroMedia}>
          <video
            ref={videoRef}
            className={styles.heroVideo}
            src={L.heroVideo}
            poster={L.heroPoster}
            playsInline
            muted
            loop
            autoPlay
          />
          {!videoPlaying && (
            <button
              type="button"
              className={styles.heroPlay}
              aria-label="Play video"
              onClick={playHero}
            >
              <span className={styles.playIcon} />
            </button>
          )}
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <ScrollReveal>
            <p className={styles.heroLabel}>{L.heroLabel}</p>
            <h1 className={styles.heroTitle}>{L.heroTitle}</h1>
            <p className={styles.heroBody}>{L.heroBody}</p>
            <a href={L.heroCtaHref} className={styles.yellowBtn}>
              {L.heroCtaLabel}
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission quote */}
      <section className={styles.missionBand}>
        <ScrollReveal>
          <blockquote className={styles.missionQuote}>{L.missionQuote}</blockquote>
          <div className={styles.missionLine} />
          <p className={styles.missionAttr}>{L.missionAttr}</p>
        </ScrollReveal>
      </section>

      {/* Alternating narrative rows with scroll reveal */}
      {L.narratives.map((block, i) => (
        <section
          key={block.heading}
          className={`${styles.narrativeRow} ${block.imageOnRight ? styles.narrativeFlip : ""}`}
        >
          <div className={styles.narrativeInner}>
            <ScrollReveal
              className={styles.narrativeMedia}
              direction={block.imageOnRight ? "right" : "left"}
              delay={0.05}
            >
              <img src={block.imageSrc} alt="" />
            </ScrollReveal>
            <ScrollReveal
              className={styles.narrativeCopy}
              direction={block.imageOnRight ? "left" : "right"}
              delay={0.12}
            >
              <h2>{block.heading}</h2>
              {block.paragraphs.map((p) => (
                <p key={p.slice(0, 28)}>{p}</p>
              ))}
            </ScrollReveal>
          </div>
        </section>
      ))}

      {/* Yellow highlight */}
      <section className={styles.highlightBand}>
        <ScrollReveal>
          <div className={styles.highlightCard}>
            <h2>{L.highlight.title}</h2>
            <p>{L.highlight.body}</p>
          </div>
        </ScrollReveal>
      </section>

      {/* Light section: achievement + tracking + road */}
      <div className={styles.lightZone}>
        <section className={styles.achievementSection}>
          <ScrollReveal>
            <div className={styles.achievementCard}>
              <div className={styles.achievementText}>
                <h2>{L.achievement.title}</h2>
                <p>{L.achievement.body}</p>
                <Link href={L.achievement.ctaHref} className={styles.yellowBtn}>
                  {L.achievement.ctaLabel}
                </Link>
              </div>
              <div className={styles.achievementVisual} aria-hidden>
                <div className={styles.waveChart} />
              </div>
            </div>
          </ScrollReveal>
        </section>

        <section className={styles.trackingSection}>
          <ScrollReveal>
            <div className={styles.trackingIcon} aria-hidden>
              <svg viewBox="0 0 48 48" width="48" height="48">
                <path
                  d="M6 38 L18 22 L28 30 L42 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2 className={styles.trackingTitle}>{L.tracking.title}</h2>
            <p className={styles.trackingBody}>{L.tracking.body}</p>
            <div className={styles.trackingRule} />
            <div className={styles.trackingStats}>
              {L.tracking.stats.map((s) => (
                <div key={s.label} className={styles.statCol}>
                  <div className={styles.statValue}>{s.value}</div>
                  <p>{s.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        <section className={styles.roadSection}>
          <ScrollReveal>
            <div className={styles.roadCard}>
              <div className={styles.roadImageWrap}>
                <img src={L.roadTo2045.imageSrc} alt="" />
              </div>
              <div className={styles.roadText}>
                <h2>{L.roadTo2045.title}</h2>
                <p>{L.roadTo2045.body}</p>
                <Link href={L.roadTo2045.ctaHref} className={styles.yellowBtn}>
                  {L.roadTo2045.ctaLabel}
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Collaboration groups grid */}
        <section id="progress-in-action" className={styles.groupsSection}>
          <ScrollReveal>
            <h2 className={styles.groupsTitle}>Progress in action</h2>
            <p className={styles.groupsLead}>
              Explore our collaboration groups—each with a dedicated story, partners,
              and measurable impact.
            </p>
          </ScrollReveal>
          <div className={styles.groupsGrid}>
            {initiatives.map((item, idx) => (
              <ScrollReveal key={item.slug} delay={idx * 0.08}>
                <Link
                  href={`/collaboration/${item.slug}`}
                  className={styles.groupCard}
                >
                  <div className={styles.groupImageWrap}>
                    <img src={item.imageSrc} alt={item.alt} />
                  </div>
                  <div className={styles.groupBody}>
                    <h3>{item.title}</h3>
                    <p>{item.excerpt}</p>
                    <span className={styles.groupLink}>View collaboration →</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
