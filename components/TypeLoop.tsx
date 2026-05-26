import React, { useEffect, useState } from "react";

type Props = {
  phrases?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseAfter?: number;
  className?: string;
};

export default function TypeLoop({
  phrases = [
    "पधारो म्हारे देश भारत!",
    "Welcome to my country India!",
    "स्वागतम् मम राष्ट्रे भारतवर्षे!",
  ],
  typingSpeed = 120,
  deletingSpeed = 40,
  pauseAfter = 1200,
  className = "",
}: Props) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    const current = phrases[phraseIndex];

    if (!isDeleting && charIndex < current.length) {
      timer = window.setTimeout(() => setCharIndex((i) => i + 1), typingSpeed);
    } else if (!isDeleting && charIndex === current.length) {
      timer = window.setTimeout(() => setIsDeleting(true), pauseAfter);
    } else if (isDeleting && charIndex > 0) {
      timer = window.setTimeout(
        () => setCharIndex((i) => i - 1),
        deletingSpeed
      );
    } else if (isDeleting && charIndex === 0) {
      // finished deleting -> small pause, then switch phrase and start typing
      timer = window.setTimeout(() => {
        setPhraseIndex((p) => (p + 1) % phrases.length);
        setIsDeleting(false);
      }, 450); // pause after deletion
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [
    charIndex,
    isDeleting,
    phraseIndex,
    phrases,
    typingSpeed,
    deletingSpeed,
    pauseAfter,
  ]);
  // Styles can be moved to your CSS/SCSS file
  const style = {
    accent: `display:inline-block;color:#f08b3a;font-weight:600;font-size:44px;font-style:italic;margin-bottom:18px;whiteSpace:'nowrap'`,
  } as any;

  return (
    <div className={`hero-title ${className}`}>
      <span className="accent" style={undefined} aria-live="polite">
        {phrases[phraseIndex].slice(0, charIndex)}&nbsp;
      </span>
      <span
        className="cursor"
        aria-hidden="true"
        style={{
          display: "inline-block",
          fontWeight: 600,
          fontSize: 44,
          color: "#f08b3a",
          marginLeft: 6,
          verticalAlign: "bottom",
          animation: "blink 1s steps(2,start) infinite",
        }}
      ></span>

      <style jsx>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          50.1%,
          100% {
            opacity: 0;
          }
        }
        .accent {
          white-space: nowrap;
          letter-spacing: 0.5px;
        }
        @media (max-width: 480px) {
          .accent,
          .cursor {
            font-size: 28px !important;
          }
        }
      `}</style>
    </div>
  );
}
