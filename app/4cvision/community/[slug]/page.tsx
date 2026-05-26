import { notFound } from "next/navigation";
import {
  featuredStory,
  largeCards,
  smallCards,
} from "@/app/data/communityStories";

import SocialShareFloating from "@/components/SocialShareFloating";
import Footer from "@/components/sections/SectionFooter";
import Header from "@/components/sections/Header";
import styles from "./communityStory.module.css";
import NewsletterSignup from "@/components/sections/SectionNewsletterSignup";
import Breadcrumb from "@/components/Breadcrumb";
/**
 * ✅ Renders article body EXACTLY like Gates Foundation
 * Handles:
 * - Inline bullets (• item • item)
 * - Line bullets (-, *, •)
 * - Ordered lists (1. 2. 3.)
 * - Blockquotes
 * - Paragraphs
 */
function renderArticleBody(body: string) {
  const blocks = body.split("\n\n");

  return blocks.map((block, idx) => {
    const trimmed = block.trim();

    // ----------------------------
    // INLINE BULLETS (• item • item)
    // ----------------------------
    if (trimmed.includes("•")) {
      const parts = trimmed
        .split("•")
        .map((p) => p.trim())
        .filter(Boolean);

      const introText = parts.shift();

      return (
        <div key={idx}>
          {introText && (
            <p className={styles.paragraph}>
              {introText}
            </p>
          )}

          <ul className={styles.unorderedList}>
            {parts.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      );
    }

    // ----------------------------
    // ORDERED LIST (1. item)
    // ----------------------------
    if (/^\d+\.\s+/.test(trimmed)) {
      const items = trimmed
        .split("\n")
        .map((line) =>
          line.replace(/^\d+\.\s*/, "").trim()
        )
        .filter(Boolean);

      return (
        <ol key={idx} className={styles.orderedList}>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
    }

    // ----------------------------
    // UNORDERED LIST (- * • on new lines)
    // ----------------------------
    if (/^[\-•*]\s+/.test(trimmed)) {
      const items = trimmed
        .split("\n")
        .map((line) =>
          line.replace(/^[\-•*]\s*/, "").trim()
        )
        .filter(Boolean);

      return (
        <ul key={idx} className={styles.unorderedList}>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }

    // ----------------------------
    // BLOCKQUOTE
    // ----------------------------
    if (trimmed.startsWith(">")) {
      return (
        <blockquote key={idx} className={styles.blockquote}>
          {trimmed.replace(/^>\s*/, "")}
        </blockquote>
      );
    }

    // ----------------------------
    // NORMAL PARAGRAPH
    // ----------------------------
    return (
      <p key={idx} className={styles.paragraph}>
        {block}
      </p>
    );
  });
}

export default async function CommunityStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const allStories = [
    featuredStory,
    ...largeCards,
    ...smallCards,
  ];

  const story = allStories.find((s) => s.slug === slug);

  if (!story) return notFound();

  return (
    <>
      {/* HEADER */}
      <Header />

      {/* ARTICLE */}
      <article className={styles.article}>
        {/* TITLE + META */}
        <header className={styles.header}>

  {/* ✅ BREADCRUMB — ADD HERE */}
  <Breadcrumb
    items={[
      { label: "Home", href: "/" },
      { label: "community", href: "/4cvision/community" },
    ]}
  />

  {/* TITLE */}
  <h1 className={styles.title}>{story.title}</h1>

  {/* META */}
  <div className={styles.meta}>
    {story.author && (
      <span className={styles.author}>
        {story.author}
      </span>
    )}
    {story.readTime && (
      <span className={styles.readTime}>
        • {story.readTime} min read
      </span>
    )}
  </div>
</header>

        {/* HERO IMAGE */}
        {story.imageSrc && (
          <div className={styles.heroImage}>
            <img
              src={story.imageSrc}
              alt={story.alt}
            />
          </div>
        )}

        {/* CONTENT */}
        <div className={styles.content}>
          {renderArticleBody(story.body)}
        </div>

        {/* SOCIAL SHARE */}
        <SocialShareFloating title={story.title} />
      </article>
      {/* NEWSLETTER SIGNUP (NEW) */}
      <NewsletterSignup />
      {/* FOOTER */}
      <div className={styles.footerSafe}>
  <Footer />
</div>

    </>
  );
}
