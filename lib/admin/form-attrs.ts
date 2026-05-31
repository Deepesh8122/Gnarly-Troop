/** Tell password-manager extensions not to inject icons into CMS fields (avoids hydration mismatch). */
export const passwordManagerIgnoreAttrs = {
  autoComplete: "off",
  "data-lpignore": "true",
  "data-1p-ignore": true,
  "data-bwignore": "true",
  "data-form-type": "other",
} as const;

export const passwordManagerIgnoreFormAttrs = {
  autoComplete: "off",
  "data-lpignore": "true",
  "data-form-type": "other",
} as const;
