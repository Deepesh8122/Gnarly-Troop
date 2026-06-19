"use client";

import type { CollaborationLandingContent } from "@/src/data/collaborationData";
import AdminImagePathField from "@/components/admin/AdminImagePathField";
import { AdminCheckbox, AdminInput, AdminSelect, AdminTextarea } from "@/components/admin/AdminForm";

function SectionBlock({
  title,
  showToggle,
  toggleName,
  toggleDefault,
  children,
}: {
  title: string;
  showToggle?: string;
  toggleDefault?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{title}</h4>
        {showToggle ? (
          <AdminCheckbox
            name={showToggle}
            label="Show on page"
            defaultChecked={toggleDefault ?? true}
          />
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function AdminCollaborationLandingEditor({
  data,
}: {
  data: Partial<CollaborationLandingContent>;
}) {
  const narratives = data.narratives ?? [];
  const pillars = data.tracking?.pillars ?? [];
  const sections = data.sections;

  return (
    <div className="space-y-6">
      <SectionBlock
        title="Hero"
        showToggle="section_hero_enabled"
        toggleDefault={sections?.hero ?? true}
      >
        <AdminImagePathField
          name="heroVideo"
          label="Hero video"
          defaultValue={data.heroVideo ?? ""}
          bucket="videos"
          accept="video/*"
        />
        <AdminImagePathField
          name="heroPoster"
          label="Poster image"
          defaultValue={data.heroPoster ?? ""}
          bucket="banners"
        />
        <AdminInput label="Eyebrow label" name="heroLabel" defaultValue={data.heroLabel ?? ""} />
        <AdminInput label="Headline" name="heroTitle" defaultValue={data.heroTitle ?? ""} />
        <AdminTextarea label="Intro paragraph" name="heroBody" defaultValue={data.heroBody ?? ""} rows={4} />
        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput label="CTA label" name="heroCtaLabel" defaultValue={data.heroCtaLabel ?? ""} />
          <AdminInput label="CTA link" name="heroCtaHref" defaultValue={data.heroCtaHref ?? ""} />
        </div>
      </SectionBlock>

      <SectionBlock
        title="Mission quote"
        showToggle="section_mission_enabled"
        toggleDefault={sections?.mission ?? true}
      >
        <AdminTextarea label="Quote" name="missionQuote" defaultValue={data.missionQuote ?? ""} rows={3} />
        <AdminInput label="Attribution" name="missionAttr" defaultValue={data.missionAttr ?? ""} />
        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput
            label="Link label"
            name="missionLinkLabel"
            defaultValue={data.missionLinkLabel ?? ""}
          />
          <AdminInput label="Link URL" name="missionLinkHref" defaultValue={data.missionLinkHref ?? ""} />
        </div>
      </SectionBlock>

      <SectionBlock
        title="Story blocks"
        showToggle="section_narratives_enabled"
        toggleDefault={sections?.narratives ?? true}
      >
        {[0, 1, 2].map((i) => {
          const n = narratives[i] ?? {
            heading: "",
            paragraphs: [],
            imageSrc: "",
            imageOnRight: false,
            enabled: true,
          };
          return (
            <div key={i} className="space-y-4 rounded-lg border border-slate-100 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase text-slate-500">Block {i + 1}</p>
                <AdminCheckbox
                  name={`narrative_${i}_enabled`}
                  label="Show block"
                  defaultChecked={n.enabled !== false}
                />
              </div>
              <AdminInput label="Heading" name={`narrative_${i}_heading`} defaultValue={n.heading ?? ""} />
              <AdminTextarea
                label="Paragraphs (blank line between paragraphs)"
                name={`narrative_${i}_paragraphs`}
                defaultValue={(n.paragraphs ?? []).join("\n\n")}
                rows={5}
              />
              <AdminImagePathField
                name={`narrative_${i}_imageSrc`}
                label="Side image"
                defaultValue={n.imageSrc ?? ""}
              />
              <AdminCheckbox
                name={`narrative_${i}_imageOnRight`}
                label="Image on right"
                defaultChecked={Boolean(n.imageOnRight)}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <AdminInput
                  label="CTA label"
                  name={`narrative_${i}_ctaLabel`}
                  defaultValue={n.ctaLabel ?? ""}
                />
                <AdminInput label="CTA link" name={`narrative_${i}_ctaHref`} defaultValue={n.ctaHref ?? ""} />
              </div>
            </div>
          );
        })}
      </SectionBlock>

      <SectionBlock
        title="Yellow highlight band"
        showToggle="section_highlight_enabled"
        toggleDefault={sections?.highlight ?? true}
      >
        <AdminInput label="Title" name="highlight_title" defaultValue={data.highlight?.title ?? ""} />
        <AdminTextarea label="Body" name="highlight_body" defaultValue={data.highlight?.body ?? ""} rows={3} />
        <AdminInput label="Subline" name="highlight_subline" defaultValue={data.highlight?.subline ?? ""} />
        <AdminImagePathField
          name="highlight_videoSrc"
          label="Background video (optional)"
          defaultValue={data.highlight?.videoSrc ?? ""}
          bucket="videos"
          accept="video/*"
        />
        <AdminImagePathField
          name="highlight_posterSrc"
          label="Video poster (optional)"
          defaultValue={data.highlight?.posterSrc ?? ""}
          bucket="banners"
        />
      </SectionBlock>

      <SectionBlock
        title="Achievement card"
        showToggle="section_achievement_enabled"
        toggleDefault={sections?.achievement ?? true}
      >
        <AdminInput
          label="Eyebrow"
          name="achievement_eyebrow"
          defaultValue={data.achievement?.eyebrow ?? ""}
        />
        <AdminInput label="Title" name="achievement_title" defaultValue={data.achievement?.title ?? ""} />
        <AdminTextarea label="Body" name="achievement_body" defaultValue={data.achievement?.body ?? ""} rows={3} />
        <AdminImagePathField
          name="achievement_visualImageSrc"
          label="Right-side visual image (optional)"
          defaultValue={data.achievement?.visualImageSrc ?? ""}
        />
        <AdminImagePathField
          name="achievement_visualVideoSrc"
          label="Right-side visual video (optional — overrides image)"
          defaultValue={data.achievement?.visualVideoSrc ?? ""}
          bucket="videos"
          accept="video/*"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput label="CTA label" name="achievement_ctaLabel" defaultValue={data.achievement?.ctaLabel ?? ""} />
          <AdminInput label="CTA link" name="achievement_ctaHref" defaultValue={data.achievement?.ctaHref ?? ""} />
        </div>
      </SectionBlock>

      <SectionBlock
        title="Tracking pillars"
        showToggle="section_tracking_enabled"
        toggleDefault={sections?.tracking ?? true}
      >
        <AdminInput label="Title" name="tracking_title" defaultValue={data.tracking?.title ?? ""} />
        <AdminTextarea label="Body" name="tracking_body" defaultValue={data.tracking?.body ?? ""} rows={3} />
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-3 rounded-lg bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase text-slate-500">Pillar {i + 1}</p>
              <AdminCheckbox
                name={`pillar_${i}_enabled`}
                label="Show pillar"
                defaultChecked={pillars[i]?.enabled !== false}
              />
            </div>
            <AdminSelect
              label="Icon"
              name={`pillar_${i}_icon`}
              defaultValue={pillars[i]?.icon ?? "globe"}
              options={[
                { value: "globe", label: "Globe" },
                { value: "book", label: "Book" },
                { value: "chart", label: "Chart" },
              ]}
            />
            <AdminInput label="Title" name={`pillar_${i}_title`} defaultValue={pillars[i]?.title ?? ""} />
            <AdminTextarea
              label="Description"
              name={`pillar_${i}_description`}
              defaultValue={pillars[i]?.description ?? ""}
              rows={2}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <AdminInput
                label="Link label"
                name={`pillar_${i}_linkLabel`}
                defaultValue={pillars[i]?.linkLabel ?? ""}
              />
              <AdminInput label="Link URL" name={`pillar_${i}_linkHref`} defaultValue={pillars[i]?.linkHref ?? ""} />
            </div>
          </div>
        ))}
      </SectionBlock>

      <SectionBlock
        title="Road to 2045"
        showToggle="section_road_enabled"
        toggleDefault={sections?.roadTo2045 ?? true}
      >
        <AdminInput label="Title" name="road_title" defaultValue={data.roadTo2045?.title ?? ""} />
        <AdminTextarea label="Body" name="road_body" defaultValue={data.roadTo2045?.body ?? ""} rows={3} />
        <AdminImagePathField name="road_imageSrc" label="Image" defaultValue={data.roadTo2045?.imageSrc ?? ""} />
        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput label="CTA label" name="road_ctaLabel" defaultValue={data.roadTo2045?.ctaLabel ?? ""} />
          <AdminInput label="CTA link" name="road_ctaHref" defaultValue={data.roadTo2045?.ctaHref ?? ""} />
        </div>
      </SectionBlock>

      <SectionBlock
        title="Progress in action"
        showToggle="section_progress_enabled"
        toggleDefault={sections?.progressInAction ?? true}
      >
        <AdminInput
          label="Section title"
          name="progressInAction_title"
          defaultValue={data.progressInAction?.title ?? ""}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput
            label="Read more label"
            name="progressInAction_readMoreLabel"
            defaultValue={data.progressInAction?.readMoreLabel ?? ""}
          />
          <AdminInput
            label="Read more link"
            name="progressInAction_readMoreHref"
            defaultValue={data.progressInAction?.readMoreHref ?? ""}
          />
        </div>
        <AdminInput
          label="Empty state message"
          name="progressInAction_emptyMessage"
          defaultValue={data.progressInAction?.emptyMessage ?? ""}
        />
        <p className="text-sm text-slate-500">
          Story cards are managed under Collaboration → Partners.
        </p>
      </SectionBlock>
    </div>
  );
}
