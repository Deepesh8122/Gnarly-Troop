"use client";

import type { SectionType } from "@gnarly/types";
import type { MinisterCard } from "@gnarly/lib";
import AdminImagePathField from "@/components/admin/AdminImagePathField";
import AdminRecommendationCardsEditor from "@/components/admin/AdminRecommendationCardsEditor";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";
import { AdminInput } from "@/components/admin/AdminForm";

type Props = {
  sectionType: SectionType;
  effective: Record<string, unknown>;
  bodyHtml: string;
};

const STATIC_SECTIONS = new Set([
  "timeline",
  "ministries",
  "summit_intro",
  "summit_schedules",
  "sikkim_train",
  "sikkim_package",
  "sikkim_circles",
]);

export default function AdminSectionFields({ sectionType, effective, bodyHtml }: Props) {
  return (
    <div className="space-y-6">
      <input type="hidden" name="section_type" value={sectionType} />

      {sectionType === "hero_banner" && (
        <div className="space-y-4">
          <AdminImagePathField
            name="videoSrc"
            label="Hero video"
            defaultValue={(effective.videoSrc as string) ?? ""}
            bucket="videos"
            accept="video/*"
            hint="Upload MP4 or pick from the media library."
          />
          <AdminImagePathField
            name="founderImg"
            label="Founder image"
            defaultValue={(effective.founderImg as string) ?? ""}
            bucket="banners"
          />
          <AdminImagePathField
            name="pmImg"
            label="Secondary hero image"
            defaultValue={(effective.pmImg as string) ?? ""}
            bucket="banners"
          />
        </div>
      )}

      {sectionType === "welcome" && (
        <div className="space-y-4">
          <AdminInput label="Hindi title" name="titleHi" defaultValue={(effective.titleHi as string) ?? ""} />
          <AdminInput label="English title" name="titleEn" defaultValue={(effective.titleEn as string) ?? ""} />
          <AdminInput label="Subtitle" name="subtitle" defaultValue={(effective.subtitle as string) ?? ""} />
          <AdminInput label="Established" name="estd" defaultValue={(effective.estd as string) ?? ""} />
          <AdminImagePathField
            name="backgroundImage"
            label="Background map image"
            defaultValue={(effective.backgroundImage as string) ?? ""}
          />
        </div>
      )}

      {sectionType === "recommendations" && (
        <div className="space-y-4">
          <AdminImagePathField
            name="staticImage"
            label="Left column image"
            defaultValue={(effective.staticImage as string) ?? ""}
          />
          <AdminRecommendationCardsEditor
            initialCards={(effective.cards as MinisterCard[]) ?? []}
          />
        </div>
      )}

      {STATIC_SECTIONS.has(sectionType) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          This block uses the site&apos;s built-in layout. Add optional rich text below to override
          intro copy, or manage linked content in the dedicated admin areas (Vision, Gallery, etc.).
        </div>
      )}

      {sectionType === "custom_html" && (
        <AdminRichTextEditor
          name="body_html"
          label="Section HTML content"
          defaultValue={bodyHtml}
          bucket="banners"
          hint="Full custom HTML for this section."
        />
      )}

      {sectionType !== "custom_html" && (
        <AdminRichTextEditor
          name="body_html"
          label="Additional rich text (optional)"
          defaultValue={bodyHtml}
          bucket="banners"
          hint="Optional extra copy for this section."
        />
      )}
    </div>
  );
}
