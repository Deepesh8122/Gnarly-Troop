import type { PageSection } from "@gnarly/types";
import styles from "./CmsStaticPage.module.css";

type Props = {
  title: string;
  sections: PageSection[];
};

function sectionHtml(section: PageSection): string {
  const content = (section.content ?? {}) as Record<string, unknown>;
  return (
    String(content.body_html ?? content.html ?? content.body ?? "").trim() ||
    ""
  );
}

export default function CmsStaticPage({ title, sections }: Props) {
  const blocks = sections.filter((s) => s.is_enabled !== false);
  const hasContent = blocks.some((s) => sectionHtml(s).length > 0);

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <h1>{title}</h1>
      </header>
      <div className={styles.body}>
        {blocks.map((section) => {
          const html = sectionHtml(section);
          if (!html) return null;
          return (
            <section
              key={section.id}
              className={styles.block}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        })}
        {!hasContent && (
          <p className={styles.empty}>
            This page has no content yet. Add a section in Admin → Pages.
          </p>
        )}
      </div>
    </article>
  );
}
