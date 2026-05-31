import SocialShareFloating from "@/components/SocialShareFloating";
import NewsletterSignup from "@/components/sections/SectionNewsletterSignup";
import Breadcrumb from "@/components/Breadcrumb";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import type { VisionStory } from "@/lib/cms/vision";

type Props = {
  story: VisionStory & { pillarTitle: string };
  pillarSlug: string;
  styles: Record<string, string>;
};

function renderArticleBody(body: string, styles: Record<string, string>) {
  const blocks = body.split("\n\n");
  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (trimmed.includes("•")) {
      const parts = trimmed.split("•").map((p) => p.trim()).filter(Boolean);
      const introText = parts.shift();
      return (
        <div key={idx}>
          {introText && <p className={styles.paragraph}>{introText}</p>}
          <ul className={styles.unorderedList}>
            {parts.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      );
    }
    return (
      <p key={idx} className={styles.paragraph}>
        {block}
      </p>
    );
  });
}

export default function VisionStoryArticle({ story, pillarSlug, styles }: Props) {
  const pillarHref = `/4cvision/${pillarSlug}`;

  return (
    <>
      <Header />
      <article className={styles.article}>
        <header className={styles.header}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: story.pillarTitle, href: pillarHref },
            ]}
          />
          <h1 className={styles.title}>{story.title}</h1>
          <div className={styles.meta}>
            {story.author && <span className={styles.author}>{story.author}</span>}
            {story.readTime != null && (
              <span className={styles.readTime}>• {story.readTime} min read</span>
            )}
          </div>
        </header>
        {story.imageSrc && (
          <div className={styles.heroImage}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={story.imageSrc} alt={story.alt} />
          </div>
        )}
        <div className={styles.content}>{renderArticleBody(story.body ?? "", styles)}</div>
        <SocialShareFloating title={story.title} />
      </article>
      <NewsletterSignup />
      <div className={styles.footerSafe}>
        <Footer />
      </div>
    </>
  );
}
