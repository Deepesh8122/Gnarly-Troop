"use client";

import { useMemo, useState } from "react";
import { slugify } from "@/lib/utils/slug";
import { passwordManagerIgnoreAttrs } from "@/lib/admin/form-attrs";

type Props = {
  nameLabel: string;
  slugLabel?: string;
  nameField?: string;
  slugField?: string;
  nameDefault?: string;
  slugDefault?: string;
  namePlaceholder?: string;
  required?: boolean;
};

export default function AdminSlugField({
  nameLabel,
  slugLabel = "URL slug",
  nameField = "name",
  slugField = "slug",
  nameDefault = "",
  slugDefault = "",
  namePlaceholder,
  required,
}: Props) {
  const initialManual = useMemo(() => {
    if (!nameDefault || !slugDefault) return false;
    return slugify(nameDefault) !== slugDefault;
  }, [nameDefault, slugDefault]);

  const [slug, setSlug] = useState(slugDefault || slugify(nameDefault));
  const [manual, setManual] = useState(initialManual);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">{nameLabel}</label>
        <input
          type="text"
          name={nameField}
          defaultValue={nameDefault}
          placeholder={namePlaceholder}
          required={required}
          className="admin-input"
          {...passwordManagerIgnoreAttrs}
          onChange={(e) => {
            if (!manual) setSlug(slugify(e.target.value));
          }}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">{slugLabel}</label>
        <input
          type="text"
          name={slugField}
          value={slug}
          required={required}
          className="admin-input font-mono text-sm"
          {...passwordManagerIgnoreAttrs}
          onChange={(e) => {
            setManual(true);
            setSlug(slugify(e.target.value));
          }}
        />
        <p className="mt-1 text-xs text-slate-500">
          Auto-generated from name. Edit to customize.
        </p>
      </div>
    </div>
  );
}
