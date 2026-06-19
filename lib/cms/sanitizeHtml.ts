/**
 * Sanitize leadership bio HTML from TinyMCE / Word paste.
 * Removes only unsafe markup — keeps inline styles, classes, and formatting.
 */
export function sanitizeLeadershipHtml(html: string | null | undefined): string {
  if (!html?.trim()) return "";

  return (
    html
      // Dangerous elements
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
      .replace(/<object[\s\S]*?<\/object>/gi, "")
      .replace(/<embed[\s\S]*?>/gi, "")
      .replace(/<form[\s\S]*?<\/form>/gi, "")
      // Embedded style blocks (XSS vector) — inline style="" attributes are kept
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      // Event handlers
      .replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      // Dangerous URL schemes
      .replace(/javascript:/gi, "")
      .replace(/vbscript:/gi, "")
      .trim()
  );
}
