"use client";

import type { CollaborationNarrative } from "@/src/data/collaborationData";
import AdminImagePathField from "@/components/admin/AdminImagePathField";
import { AdminCheckbox, AdminInput, AdminTextarea } from "@/components/admin/AdminForm";

type LandingData = {
  heroVideo?: string;
  heroPoster?: string;
  heroLabel?: string;
  heroTitle?: string;
  heroBody?: string;
  heroCtaLabel?: string;
  heroCtaHref?: string;
  missionQuote?: string;
  missionAttr?: string;
  narratives?: CollaborationNarrative[];
  highlight?: { title?: string; body?: string };
  achievement?: { title?: string; body?: string; ctaLabel?: string; ctaHref?: string };
  tracking?: { title?: string; body?: string; stats?: { value: string; label: string }[] };
  roadTo2045?: {
    title?: string;
    body?: string;
    imageSrc?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
};

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">{title}</h4>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function AdminCollaborationLandingEditor({ data }: { data: LandingData }) {
  const narratives = data.narratives ?? [];
  const stats = data.tracking?.stats ?? [];

  return (
    <div className="space-y-6">
      <SectionBlock title="Hero">
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

      <SectionBlock title="Mission quote">
        <AdminTextarea label="Quote" name="missionQuote" defaultValue={data.missionQuote ?? ""} rows={3} />
        <AdminInput label="Attribution" name="missionAttr" defaultValue={data.missionAttr ?? ""} />
      </SectionBlock>

      {[0, 1, 2].map((i) => {
        const n = narratives[i] ?? {
          heading: "",
          paragraphs: [],
          imageSrc: "",
          imageOnRight: false,
        };
        return (
          <SectionBlock key={i} title={`Story block ${i + 1}`}>
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
          </SectionBlock>
        );
      })}

      <SectionBlock title="Highlight">
        <AdminInput label="Title" name="highlight_title" defaultValue={data.highlight?.title ?? ""} />
        <AdminTextarea label="Body" name="highlight_body" defaultValue={data.highlight?.body ?? ""} rows={3} />
      </SectionBlock>

      <SectionBlock title="Achievement">
        <AdminInput label="Title" name="achievement_title" defaultValue={data.achievement?.title ?? ""} />
        <AdminTextarea label="Body" name="achievement_body" defaultValue={data.achievement?.body ?? ""} rows={3} />
        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput label="CTA label" name="achievement_ctaLabel" defaultValue={data.achievement?.ctaLabel ?? ""} />
          <AdminInput label="CTA link" name="achievement_ctaHref" defaultValue={data.achievement?.ctaHref ?? ""} />
        </div>
      </SectionBlock>

      <SectionBlock title="Impact stats">
        <AdminInput label="Title" name="tracking_title" defaultValue={data.tracking?.title ?? ""} />
        <AdminTextarea label="Body" name="tracking_body" defaultValue={data.tracking?.body ?? ""} rows={3} />
        {[0, 1, 2].map((i) => (
          <div key={i} className="grid gap-3 rounded-lg bg-slate-50 p-3 md:grid-cols-2">
            <AdminInput label={`Stat ${i + 1} value`} name={`stat_${i}_value`} defaultValue={stats[i]?.value ?? ""} />
            <AdminInput label={`Stat ${i + 1} label`} name={`stat_${i}_label`} defaultValue={stats[i]?.label ?? ""} />
          </div>
        ))}
      </SectionBlock>

      <SectionBlock title="Road to 2045">
        <AdminInput label="Title" name="road_title" defaultValue={data.roadTo2045?.title ?? ""} />
        <AdminTextarea label="Body" name="road_body" defaultValue={data.roadTo2045?.body ?? ""} rows={3} />
        <AdminImagePathField name="road_imageSrc" label="Image" defaultValue={data.roadTo2045?.imageSrc ?? ""} />
        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput label="CTA label" name="road_ctaLabel" defaultValue={data.roadTo2045?.ctaLabel ?? ""} />
          <AdminInput label="CTA link" name="road_ctaHref" defaultValue={data.roadTo2045?.ctaHref ?? ""} />
        </div>
      </SectionBlock>
    </div>
  );
}
