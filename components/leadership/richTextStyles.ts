/** Shared typography for TinyMCE editor body and public leadership rich-text blocks */

export const RICH_TEXT_COLOR = "#313a44";
export const RICH_TEXT_COLOR_MUTED = "#696969";
export const RICH_TEXT_FONT_SERIF = '"Noto Serif", Georgia, serif';
export const RICH_TEXT_FONT_SANS = '"Noto Sans", sans-serif';
export const RICH_TEXT_FONT_SIZE = "18px";
export const RICH_TEXT_LINE_HEIGHT = "1.6";

/** Common Word paste classes — inline styles from the editor still win */
export const RICH_TEXT_WORD_CLASS_CSS = `
  .MsoNormal { margin: 0 0 1em; }
  .MsoListParagraph { margin: 0 0 1em 36pt; }
  .MsoListParagraphCxSpFirst { margin: 0 0 0 36pt; }
  .MsoListParagraphCxSpMiddle { margin: 0 0 0 36pt; }
  .MsoListParagraphCxSpLast { margin: 0 0 1em 36pt; }
`.trim();

/** Injected into TinyMCE iframe — must mirror .richText defaults on the frontend */
export const TINYMCE_CONTENT_STYLE = `
  body {
    font-family: ${RICH_TEXT_FONT_SERIF};
    font-size: ${RICH_TEXT_FONT_SIZE};
    line-height: ${RICH_TEXT_LINE_HEIGHT};
    color: ${RICH_TEXT_COLOR};
    margin: 0;
  }
  p { margin: 0 0 1em; }
  h1 { font-family: ${RICH_TEXT_FONT_SERIF}; font-size: 1.5rem; font-weight: 700; line-height: 1.3; margin: 1.5em 0 0.5em; color: ${RICH_TEXT_COLOR}; }
  h2 { font-family: ${RICH_TEXT_FONT_SERIF}; font-size: 1.375rem; font-weight: 700; line-height: 1.3; margin: 1.5em 0 0.5em; color: ${RICH_TEXT_COLOR}; }
  h3 { font-family: ${RICH_TEXT_FONT_SERIF}; font-size: 1.125rem; font-weight: 700; line-height: 1.3; margin: 1.5em 0 0.5em; color: ${RICH_TEXT_COLOR}; }
  h4, h5, h6 { font-family: ${RICH_TEXT_FONT_SERIF}; font-size: 1rem; font-weight: 700; line-height: 1.3; margin: 1.5em 0 0.5em; color: ${RICH_TEXT_COLOR}; }
  strong, b { font-weight: 700; }
  em, i { font-style: italic; }
  ul { margin: 1em 0; padding-left: 1.25rem; list-style-type: disc; list-style-position: outside; }
  ol { margin: 1em 0; padding-left: 1.25rem; list-style-type: decimal; list-style-position: outside; }
  ul ul { list-style-type: circle; }
  ol ol { list-style-type: lower-alpha; }
  li { display: list-item; }
  a { color: inherit; text-decoration: underline; }
  img { max-width: 100%; height: auto; }
  table { border-collapse: collapse; width: 100%; }
  td, th { border: 1px solid #e5e5e5; padding: 8px; }
  ${RICH_TEXT_WORD_CLASS_CSS}
`.trim();
