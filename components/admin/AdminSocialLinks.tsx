"use client";

import { useState } from "react";
import { AdminField } from "@/components/admin/AdminForm";

export type SocialLinks = {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
};

type Props = {
  defaultValue?: SocialLinks | null;
  /** Legacy single LinkedIn field support */
  linkedinDefault?: string;
};

export default function AdminSocialLinks({ defaultValue, linkedinDefault }: Props) {
  const initial: SocialLinks = {
    linkedin: defaultValue?.linkedin ?? linkedinDefault ?? "",
    twitter: defaultValue?.twitter ?? "",
    facebook: defaultValue?.facebook ?? "",
    instagram: defaultValue?.instagram ?? "",
    youtube: defaultValue?.youtube ?? "",
    website: defaultValue?.website ?? "",
  };

  const [links, setLinks] = useState(initial);

  function update(key: keyof SocialLinks, value: string) {
    setLinks((prev) => ({ ...prev, [key]: value }));
  }

  const fields: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
    { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/…" },
    { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/…" },
    { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/…" },
    { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/…" },
    { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/…" },
    { key: "website", label: "Website", placeholder: "https://…" },
  ];

  return (
    <div className="admin-card p-4">
      <input type="hidden" name="social_links" value={JSON.stringify(links)} />
      <input type="hidden" name="linkedin_url" value={links.linkedin ?? ""} />
      <p className="mb-3 text-sm font-medium text-slate-700">Social media links</p>
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map(({ key, label, placeholder }) => (
          <AdminField key={key} label={label} name={`social_${key}`}>
            <input
              type="url"
              className="admin-input"
              value={links[key] ?? ""}
              onChange={(e) => update(key, e.target.value)}
              placeholder={placeholder}
            />
          </AdminField>
        ))}
      </div>
    </div>
  );
}
