/** Tell password-manager extensions not to inject icons into CMS fields (avoids hydration mismatch). */
export const passwordManagerIgnoreAttrs = {
  autoComplete: "off",
  "data-lpignore": "true",
  "data-1p-ignore": true,
  "data-bwignore": "true",
  "data-form-type": "other",
} as const;

/** Password-manager ignore attrs while keeping semantic autoComplete on public forms. */
export function publicFormInputAttrs(autoComplete: string) {
  return {
    "data-lpignore": "true",
    "data-1p-ignore": true,
    "data-bwignore": "true",
    "data-form-type": "other",
    autoComplete,
  } as const;
}

export const passwordManagerIgnoreFormAttrs = {
  autoComplete: "off",
  "data-lpignore": "true",
  "data-form-type": "other",
} as const;
