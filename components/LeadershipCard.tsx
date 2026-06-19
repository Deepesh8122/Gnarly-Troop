"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Leader } from "@/components/leadership/types";
import styles from "@/components/leadership/leadership.module.css";

type Props = {
  leader: Leader;
};

const FALLBACK_IMAGE = "/images/logos/logo-2.png";

function truncateShort(text: string | undefined, max = 200): string {
  if (!text?.trim()) return "";
  const trimmed = text.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
}

function ArrowIcon() {
  return <ArrowRight size={20} strokeWidth={1.5} aria-hidden />;
}

export default function LeadershipCard({ leader }: Props) {
  const shortText = truncateShort(leader.short);

  return (
    <article className={styles.profileCard}>
      <figure className={styles.cardMedia}>
        <Link href={leader.profileUrl} className={styles.cardMediaLink} title={leader.name} prefetch>
          <div className={styles.cardImageWrap}>
            <img
              src={leader.image}
              alt={leader.name}
              loading="lazy"
              decoding="async"
              className={styles.cardImage}
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
            />
          </div>
        </Link>
      </figure>
      <div className={styles.cardDetails}>
        <div className={styles.cardName}>{leader.name}</div>
        <div className={styles.cardOccupation}>{leader.designation}</div>
        {shortText && <p className={styles.cardDescription}>{shortText}</p>}
        {!shortText && <p className={styles.cardDescription} aria-hidden="true" />}
        <div className={styles.cardCta}>
          <Link href={leader.profileUrl} className={styles.arrowLink} prefetch>
            <span>View profile</span>
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}
