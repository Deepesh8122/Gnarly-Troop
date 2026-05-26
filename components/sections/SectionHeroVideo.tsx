"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/app/section-hero.css";
import TypeLoop from "../TypeLoop";

type Props = {
  videoSrc?: string;
  founderImg?: string;
  pmImg?: string;
};

export default function SectionHeroVideo({
  videoSrc = "/hero.mp4",
  founderImg = "/images/sections/founder-img.png",
  pmImg = "/images/sections/pm-img.png",
}: Props) {
  const bgRef = useRef<HTMLVideoElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  const [playing, setPlaying] = useState<boolean>(true);
  const [muted, setMuted] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const prevBgPlaying = useRef<boolean>(false);

  // Try autoplay muted on mount
  useEffect(() => {
    const v = bgRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    const p = v.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        setPlaying(!v.paused);
        setMuted(v.muted);
      }).catch(() => {
        setPlaying(false);
      });
    }
    function onPlay() {
      setPlaying(true);
    }
    function onPause() {
      setPlaying(false);
    }
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [videoSrc]);

  // toggle play/pause for background video
  function togglePlay() {
    const v = bgRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }

  // toggle mute/unmute for background video
  function toggleMute() {
    const v = bgRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  // open modal: pause bg video (remember if it was playing), then play modal video
  function openModal() {
    const v = bgRef.current;
    if (v) {
      prevBgPlaying.current = !v.paused;
      try {
        v.pause();
      } catch {}
    }
    setModalOpen(true);
    // ensure modal video plays after it mounts
    setTimeout(() => {
      modalVideoRef.current?.play().catch(() => {});
    }, 60);
  }

  // close modal: stop modal video and resume bg video if previously playing
  function closeModal() {
    modalVideoRef.current?.pause();
    setModalOpen(false);
    const v = bgRef.current;
    if (v && prevBgPlaying.current) {
      v.play().catch(() => {});
    }
  }

  // close modal on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && modalOpen) closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  return (
    <>
      <section id="sectionHero" className="hero-section" aria-label="Hero">
        {/* Background video */}
        <video
          ref={bgRef}
          className="hero-bg-video"
          playsInline
          muted={muted}
          loop
          // poster={founderImg}
          preload="metadata"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* overlay */}
        <div className="hero-overlay" />

        {/* bottom-left controls: play/pause, mute, play video (modal) */}
        <div className="hero-controls-bottom" aria-hidden={false}>
          <button
            className="hc-btn"
            onClick={togglePlay}
            aria-label={
              playing ? "Pause background video" : "Play background video"
            }
            title={playing ? "Pause" : "Play"}
          >
            {playing ? "❚❚" : "▶"}
          </button>

          <button
            className="hc-btn"
            onClick={toggleMute}
            aria-label={
              muted ? "Unmute background video" : "Mute background video"
            }
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? "🔇" : "🔊"}
          </button>

          <button
            className="hc-btn hc-play"
            onClick={openModal}
            aria-label="Open video in popup"
            title="Play Video"
          >
            {/* simple play icon + text */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              aria-hidden
              style={{ marginRight: 8 }}
            >
              <path fill="currentColor" d="M8 5v14l11-7z" />
            </svg>
            <span className="hc-play-text">Play Video</span>
          </button>
        </div>

        {/* content */}
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-theme-script">
              हिमालयं समारभ्य यावत् इंदु सरेावरम् | <br />
              तं देवनिर्मितं देशं हिंदुस्थानं प्रचक्षते ||
            </div>

            <div className="hero-tag">
              GREETING THE WORLD AT BHARAT MANDAPAM
            </div>

            <h1 className="hero-title">
              {/* <span className="accent">Padharo Mhare Desh BHARAT</span> */}
              <TypeLoop />

              <br />
              <span className="big">
                Global Leadership Summit &amp;
                <br /> Cultural Exchange–2026
              </span>
            </h1>

            <a className="hero-date" href="#sectionSummit">
              21st – 22nd FEBRUARY, 2026
            </a>

            <div className="hero-links">
              <a className="hero-links-item" href="#about">
                About Us
              </a>
              <span className="sep">|</span>
              <a className="hero-links-item" href="#visions">
                Vision &amp; Mission
              </a>
              <span className="sep">|</span>
              <a className="hero-links-item" href="#timeline">
                Strategic Objectives
              </a>
              <span className="sep">|</span>
              <a className="hero-links-item" href="#gallery">
                National Alignment
              </a>
            </div>
          </div>

          <div className="">
            <img className="hero-person-img" src={pmImg} alt="PM Image" />
          </div>
        </div>
      </section>

      {/* Modal popup for video */}
      {modalOpen && (
        <div
          className="hero-modal"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div className="hero-modal-card" onClick={(e) => e.stopPropagation()}>
            <video
              ref={modalVideoRef}
              width="100%"
              controls
              src={videoSrc}
              preload="auto"
            />
            <div style={{ marginTop: 8, textAlign: "right" }}>
              <button className="btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
