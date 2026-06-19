"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  CollaborationInitiative,
  CollaborationLandingContent,
  CollaborationTrackingPillar,
} from "@/src/data/collaborationData";
import ScrollImageReveal from "@/components/ui/ScrollImageReveal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { gatesFontClassName } from "@/components/leadership/fonts";
import styles from "./SectionCollaborationLanding.module.css";

type Props = {
  initiatives: CollaborationInitiative[];
  landing: CollaborationLandingContent;
};

function PillarIcon({ icon }: { icon: CollaborationTrackingPillar["icon"] }) {
  if (icon === "book") {
    return (
      <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden>
        <path
          d="M10 8h12v32H12a2 2 0 0 1-2-2V8zm16 0h12a2 2 0 0 1 2 2v30h-14V8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      </svg>
    );
  }
  if (icon === "chart") {
    return (
      <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden>
        <path
          d="M8 38h32M14 32V20M24 32V14M34 32V24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden>
      <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M8 24h32M24 8a20 20 0 0 1 0 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MediaToggle({
  playing,
  onClick,
  className,
}: {
  playing: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      aria-label={playing ? "Pause the video" : "Play the video"}
      onClick={onClick}
    >
      <span className={styles.srOnly}>{playing ? "Pause" : "Play"}</span>
    </button>
  );
}

export default function SectionCollaborationLanding({ initiatives, landing }: Props) {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const highlightVideoRef = useRef<HTMLVideoElement>(null);
  const achievementVideoRef = useRef<HTMLVideoElement>(null);
  const [heroPlaying, setHeroPlaying] = useState(false);
  const [highlightPlaying, setHighlightPlaying] = useState(false);
  const [achievementPlaying, setAchievementPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");

  const toggle = (ref: React.RefObject<HTMLVideoElement | null>, setPlaying: (v: boolean) => void) => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const playHero = () => {
    const video = heroVideoRef.current;
    if (!video) return;
    void video.play();
    setHeroPlaying(true);
  };

  const L = landing;
  const visibleNarratives = L.narratives.filter((n) => n.enabled !== false);
  const visiblePillars = L.tracking.pillars.filter((p) => p.enabled !== false);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    video.muted = true;
    video.loop = true;
    const attempt = video.play();
    if (attempt && typeof attempt.then === "function") {
      attempt
        .then(() => setHeroPlaying(true))
        .catch(() => setHeroPlaying(false));
    }
    const onPlay = () => setHeroPlaying(true);
    const onPause = () => setHeroPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [L.heroVideo]);

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const item of initiatives) {
      if (item.categorySlug && item.categoryName) {
        seen.set(item.categorySlug, item.categoryName);
      }
    }
    return Array.from(seen.entries()).map(([slug, name]) => ({ slug, name }));
  }, [initiatives]);

  const filteredInitiatives = useMemo(() => {
    if (!activeCategory) return initiatives;
    return initiatives.filter((item) => item.categorySlug === activeCategory);
  }, [initiatives, activeCategory]);

  return (
    <div className={`${gatesFontClassName} ${styles.page}`}>
      {L.sections.hero ? (
        <section className={`${styles.heroSection} ${styles.snapSection}`} id="progress-hero-video">
          <div className={styles.heroWrap}>
            <div className={styles.heroGateShell}>
              <div className={styles.mediaStack}>
                <div className={styles.heroAspect} aria-hidden />
                <div className={styles.heroMedia}>
                  <video
                    ref={heroVideoRef}
                    className={styles.coverMedia}
                    src={L.heroVideo}
                    poster={L.heroPoster}
                    playsInline
                    muted
                    loop
                    autoPlay
                    preload="auto"
                  />
                </div>
                <div className={`${styles.gateOverlay} ${styles.heroGradient}`} aria-hidden />
                <MediaToggle
                  playing={heroPlaying}
                  className={styles.mediaToggle}
                  onClick={() => toggle(heroVideoRef, setHeroPlaying)}
                />
                <div className={styles.heroContent}>
                  <div className={styles.heroInner}>
                    <ScrollReveal delay={0.05}>
                      {L.heroLabel ? <p className={styles.heroEyebrow}>{L.heroLabel}</p> : null}
                      {L.heroTitle ? <h1 className={styles.heroTitle}>{L.heroTitle}</h1> : null}
                      {L.heroBody ? <p className={styles.heroBody}>{L.heroBody}</p> : null}
                      {L.heroCtaLabel ? (
                        <button type="button" className={styles.yellowBtn} onClick={playHero}>
                          {L.heroCtaLabel}
                        </button>
                      ) : null}
                    </ScrollReveal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {L.sections.mission && L.missionQuote ? (
        <section className={`${styles.missionBand} ${styles.snapSection}`}>
          <ScrollReveal>
            <blockquote className={styles.missionQuote}>{L.missionQuote}</blockquote>
            {L.missionAttr ? <p className={styles.missionAttr}>{L.missionAttr}</p> : null}
            {L.missionLinkHref && L.missionLinkLabel ? (
              <a href={L.missionLinkHref} className={styles.outlineBtnLight}>
                {L.missionLinkLabel}
              </a>
            ) : null}
          </ScrollReveal>
        </section>
      ) : null}

      {L.sections.narratives && visibleNarratives.length > 0 ? (
        <div id="progress-narratives">
          {visibleNarratives.map((block, index) => (
            <section key={`${block.heading}-${index}`} className={`${styles.narrativeRow} ${styles.snapSection}`}>
              <div className={`${styles.narrativeInner} ${block.imageOnRight ? styles.narrativeFlip : ""}`}>
                {block.imageSrc ? (
                  <div className={styles.narrativeMedia}>
                    <ScrollImageReveal
                      src={block.imageSrc}
                      shellClassName={styles.narrativeImageShell}
                      imageClassName={styles.narrativeImage}
                      direction={block.imageOnRight ? "right" : "left"}
                    />
                  </div>
                ) : null}
                <ScrollReveal className={styles.narrativeCopy} delay={0.12 + index * 0.06}>
                  {block.heading ? <h2>{block.heading}</h2> : null}
                  {block.paragraphs.map((p, pIndex) => (
                    <p key={`${index}-${pIndex}`}>{p}</p>
                  ))}
                  {block.ctaHref && block.ctaLabel ? (
                    <a href={block.ctaHref} className={styles.textLinkLight}>
                      {block.ctaLabel}
                    </a>
                  ) : null}
                </ScrollReveal>
              </div>
            </section>
          ))}
        </div>
      ) : null}

      {L.sections.highlight && (L.highlight.title || L.highlight.body) ? (
        <section className={`${styles.highlightSection} ${styles.snapSection}`}>
          <ScrollReveal>
            <div className={styles.highlightBand}>
              {L.highlight.videoSrc ? (
                <video
                  ref={highlightVideoRef}
                  className={styles.highlightVideoBg}
                  src={L.highlight.videoSrc}
                  poster={L.highlight.posterSrc || undefined}
                  playsInline
                  muted
                  loop
                  preload="metadata"
                  aria-hidden
                />
              ) : null}
              <div className={styles.highlightInner}>
                {L.highlight.title ? (
                  <h2 className={styles.highlightTitle}>{L.highlight.title}</h2>
                ) : null}
                {L.highlight.body ? <p className={styles.highlightBody}>{L.highlight.body}</p> : null}
                {L.highlight.subline ? (
                  <p className={styles.highlightSubline}>{L.highlight.subline}</p>
                ) : null}
              </div>
              {L.highlight.videoSrc ? (
                <MediaToggle
                  playing={highlightPlaying}
                  className={styles.highlightToggle}
                  onClick={() => toggle(highlightVideoRef, setHighlightPlaying)}
                />
              ) : null}
            </div>
          </ScrollReveal>
        </section>
      ) : null}

      <div className={styles.lightZone}>
        {L.sections.achievement && (L.achievement.title || L.achievement.body) ? (
          <section className={`${styles.achievementSection} ${styles.snapSection}`}>
            <ScrollReveal direction="left">
              <div className={styles.achievementBlock}>
                <div className={styles.achievementText}>
                  {L.achievement.eyebrow ? (
                    <p className={styles.achievementEyebrow}>{L.achievement.eyebrow}</p>
                  ) : null}
                  {L.achievement.title ? (
                    <h2 className={styles.achievementTitle}>{L.achievement.title}</h2>
                  ) : null}
                  {L.achievement.body ? (
                    <p className={styles.achievementBody}>{L.achievement.body}</p>
                  ) : null}
                  {L.achievement.ctaHref && L.achievement.ctaLabel ? (
                    <Link href={L.achievement.ctaHref} className={styles.yellowBtn}>
                      {L.achievement.ctaLabel}
                    </Link>
                  ) : null}
                </div>
                <div className={styles.achievementVisual}>
                  {L.achievement.visualVideoSrc ? (
                    <>
                      <video
                        ref={achievementVideoRef}
                        className={styles.coverMedia}
                        src={L.achievement.visualVideoSrc}
                        playsInline
                        muted
                        loop
                        preload="metadata"
                      />
                      <MediaToggle
                        playing={achievementPlaying}
                        className={styles.mediaToggleDark}
                        onClick={() => toggle(achievementVideoRef, setAchievementPlaying)}
                      />
                    </>
                  ) : L.achievement.visualImageSrc ? (
                    <img src={L.achievement.visualImageSrc} alt="" className={styles.coverMedia} />
                  ) : (
                    <div className={styles.waveChart} aria-hidden />
                  )}
                </div>
              </div>
            </ScrollReveal>
          </section>
        ) : null}

        {L.sections.tracking && (L.tracking.title || visiblePillars.length > 0) ? (
          <section className={`${styles.trackingSection} ${styles.snapSection}`}>
            <ScrollReveal>
              {L.tracking.title ? <h2 className={styles.trackingTitle}>{L.tracking.title}</h2> : null}
              {L.tracking.body ? <p className={styles.trackingBody}>{L.tracking.body}</p> : null}
              {visiblePillars.length > 0 ? (
                <div className={styles.trackingPillars}>
                  {visiblePillars.map((pillar, pillarIndex) => (
                    <ScrollReveal key={pillar.title} delay={pillarIndex * 0.1} direction="up">
                      <div className={styles.pillarCol}>
                      <div className={styles.pillarIcon}>
                        <PillarIcon icon={pillar.icon} />
                      </div>
                      {pillar.title ? <h3 className={styles.pillarTitle}>{pillar.title}</h3> : null}
                      {pillar.description ? (
                        <p className={styles.pillarDescription}>{pillar.description}</p>
                      ) : null}
                      {pillar.linkHref && pillar.linkLabel ? (
                        <Link href={pillar.linkHref} className={styles.pillarLink}>
                          {pillar.linkLabel}
                        </Link>
                      ) : null}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              ) : null}
            </ScrollReveal>
          </section>
        ) : null}

        {L.sections.roadTo2045 && (L.roadTo2045.title || L.roadTo2045.body) ? (
          <section className={`${styles.roadSection} ${styles.snapSection}`}>
            <ScrollReveal direction="right">
              <div className={styles.roadBlock}>
                {L.roadTo2045.imageSrc ? (
                  <div className={styles.roadImageWrap}>
                    <img src={L.roadTo2045.imageSrc} alt="" loading="lazy" decoding="async" />
                  </div>
                ) : null}
                <div className={styles.roadText}>
                  {L.roadTo2045.title ? <h2 className={styles.roadTitle}>{L.roadTo2045.title}</h2> : null}
                  {L.roadTo2045.body ? <p className={styles.roadBody}>{L.roadTo2045.body}</p> : null}
                  {L.roadTo2045.ctaHref && L.roadTo2045.ctaLabel ? (
                    <Link href={L.roadTo2045.ctaHref} className={styles.yellowBtn}>
                      {L.roadTo2045.ctaLabel}
                    </Link>
                  ) : null}
                </div>
              </div>
            </ScrollReveal>
          </section>
        ) : null}

        {L.sections.progressInAction ? (
          <section id="progress-in-action" className={`${styles.groupsSection} ${styles.snapSection}`}>
            <div className={styles.groupsLayout}>
              <aside className={styles.groupsSidebar}>
                <ScrollReveal>
                  {L.progressInAction.title ? (
                    <h2 className={styles.groupsTitle}>{L.progressInAction.title}</h2>
                  ) : null}
                  {L.progressInAction.readMoreHref && L.progressInAction.readMoreLabel ? (
                    <a href={L.progressInAction.readMoreHref} className={styles.groupsReadMore}>
                      {L.progressInAction.readMoreLabel}
                    </a>
                  ) : null}
                  {categories.length > 0 ? (
                    <nav aria-label="Filter collaboration stories">
                      <ul className={styles.filterList}>
                        {categories.map((cat) => (
                          <li key={cat.slug}>
                            <button
                              type="button"
                              className={`${styles.filterBtn} ${
                                activeCategory === cat.slug ? styles.filterBtnActive : ""
                              }`}
                              onClick={() =>
                                setActiveCategory((prev) => (prev === cat.slug ? "" : cat.slug))
                              }
                              aria-pressed={activeCategory === cat.slug}
                            >
                              {cat.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  ) : null}
                </ScrollReveal>
              </aside>

              <div className={styles.groupsGridWrap}>
                {filteredInitiatives.length > 0 ? (
                  <div className={styles.groupsGrid}>
                    {filteredInitiatives.map((item, idx) => (
                      <ScrollReveal key={item.slug} delay={idx * 0.05}>
                        <Link href={`/collaboration/${item.slug}/`} className={styles.storyCard}>
                          <div className={styles.storyImageWrap}>
                            <img src={item.imageSrc} alt={item.alt} loading="lazy" decoding="async" />
                          </div>
                          <h3 className={styles.storyTitle}>{item.title}</h3>
                        </Link>
                      </ScrollReveal>
                    ))}
                  </div>
                ) : (
                  <p className={styles.groupsEmpty}>{L.progressInAction.emptyMessage}</p>
                )}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
