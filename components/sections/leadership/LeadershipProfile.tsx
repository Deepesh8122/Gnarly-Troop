import Link from "next/link";
import { gatesFontClassName } from "@/components/leadership/fonts";
import type { LeadershipItem, LeadershipSocialLinks } from "@/src/lib/leadership";
import styles from "./LeadershipProfile.module.css";

type Props = {
  person: LeadershipItem;
};

type SocialPlatform = keyof LeadershipSocialLinks;

const SOCIAL_ORDER: SocialPlatform[] = [
  "twitter",
  "linkedin",
  "facebook",
  "instagram",
  "youtube",
  "website",
];

function BioContent({ person }: { person: LeadershipItem }) {
  if (person.bio?.trim()) {
    return (
      <div
        className={styles.richText}
        aria-label="Biography"
        dangerouslySetInnerHTML={{ __html: person.bio }}
      />
    );
  }

  if (person.bioParagraphs?.length) {
    return (
      <div className={styles.richText} aria-label="Biography">
        {person.bioParagraphs.map((para, index) => (
          <p key={`${person.slug}-bio-${index}`}>{para}</p>
        ))}
      </div>
    );
  }

  return null;
}

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  switch (platform) {
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
          <path
            fill="currentColor"
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
          <path
            fill="currentColor"
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
          <path
            fill="currentColor"
            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
          <path
            fill="currentColor"
            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
          />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
          <path
            fill="currentColor"
            d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9M12 3c-2.5 2.5-4 5.5-4 9s1.5 6.5 4 9"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );
  }
}

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  twitter: "Twitter / X",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  website: "Website",
};

function ConnectSection({
  name,
  socialLinks,
}: {
  name: string;
  socialLinks: LeadershipSocialLinks;
}) {
  const entries = SOCIAL_ORDER.filter((key) => socialLinks[key]?.trim()).map(
    (key) => [key, socialLinks[key]!.trim()] as const,
  );

  if (!entries.length) return null;

  return (
    <div className={styles.connect}>
      <span className={styles.connectLabel}>Connect</span>
      <ul className={styles.socialList}>
        {entries.map(([platform, href]) => (
          <li key={platform}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label={`${name} on ${SOCIAL_LABELS[platform]}`}
            >
              <SocialIcon platform={platform} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function LeadershipProfile({ person }: Props) {
  const hasArticles = person.articles && person.articles.length > 0;
  const hasBio = Boolean(person.bio?.trim() || person.bioParagraphs?.length);
  const firstName = person.name.split(" ")[0] ?? person.name;
  const socialLinks =
    person.socialLinks ??
    (person.linkedin ? { linkedin: person.linkedin } : undefined);
  const hasConnect = Boolean(
    socialLinks && SOCIAL_ORDER.some((key) => socialLinks[key]?.trim()),
  );

  return (
    <article className={`${gatesFontClassName} ${styles.article}`}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li className={styles.breadcrumbItem}>
            <Link href="/leadership" className={styles.breadcrumbLink}>
              Leadership
            </Link>
          </li>
        </ol>
      </nav>

      <div className={styles.contentWrap}>
        <div className={styles.contentCol}>
          <figure className={styles.bioMedia}>
            <img
              src={person.src}
              alt={person.alt || person.name}
              className={styles.portrait}
              loading="eager"
            />
          </figure>

          <div className={styles.identityRow}>
            <header className={styles.bioHeader}>
              <h1 className={styles.bioName}>{person.name}</h1>
              {person.title && <p className={styles.bioOccupation}>{person.title}</p>}
            </header>

            {hasConnect && socialLinks && (
              <ConnectSection name={person.name} socialLinks={socialLinks} />
            )}
          </div>

          {person.education && (
            <section className={styles.education}>
              <h2 className={styles.educationLabel}>Education</h2>
              <p>{person.education}</p>
            </section>
          )}

          {hasBio && (
            <section className={styles.bioBody} aria-label="Profile details">
              <BioContent person={person} />
            </section>
          )}

          {hasArticles && (
            <section className={styles.articles} aria-labelledby="articles-heading">
              <h2 id="articles-heading" className={styles.articlesTitle}>
                See articles by {firstName}
              </h2>
              <ul className={styles.articleList}>
                {person.articles!.map((art) => (
                  <li key={art.href}>
                    <Link href={art.href} className={styles.articleCard}>
                      {art.type && <span className={styles.articleType}>{art.type}</span>}
                      <h3>{art.title}</h3>
                      {art.excerpt && <p>{art.excerpt}</p>}
                      <span className={styles.articleLink}>Read article</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className={styles.back}>
            <Link href="/leadership">← Back to leadership</Link>
          </p>
        </div>
      </div>
    </article>
  );
}
