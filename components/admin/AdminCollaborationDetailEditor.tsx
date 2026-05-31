"use client";

import type { CollaborationDetail } from "@/src/data/collaborationData";
import AdminImagePathField from "@/components/admin/AdminImagePathField";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";
import { AdminInput, AdminTextarea } from "@/components/admin/AdminForm";

type Props = {
  detail: Partial<CollaborationDetail>;
  partnerName: string;
};

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <h4 className="mb-4 text-sm font-semibold text-slate-800">{title}</h4>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function AdminCollaborationDetailEditor({ detail, partnerName }: Props) {
  const pillars = detail.howWeWork ?? [];

  return (
    <div className="space-y-6">
      <Block title="Detail page hero">
        <AdminInput label="Subtitle" name="detail_subtitle" defaultValue={detail.subtitle ?? ""} />
        <AdminImagePathField
          name="detail_heroVideo"
          label="Hero video"
          defaultValue={detail.heroVideo ?? ""}
          bucket="videos"
          accept="video/*"
        />
        <AdminImagePathField
          name="detail_heroImage"
          label="Hero image"
          defaultValue={detail.heroImage ?? ""}
          bucket="partners"
        />
        <AdminTextarea
          label="Lead paragraphs (blank line between)"
          name="detail_lead"
          defaultValue={(detail.lead ?? []).join("\n\n")}
          rows={5}
        />
      </Block>

      <Block title="Key stat">
        <div className="grid gap-4 md:grid-cols-3">
          <AdminInput label="Value" name="detail_stat_value" defaultValue={detail.stat?.value ?? ""} />
          <AdminInput label="Label" name="detail_stat_label" defaultValue={detail.stat?.label ?? ""} />
          <AdminInput label="Source" name="detail_stat_source" defaultValue={detail.stat?.source ?? ""} />
        </div>
      </Block>

      <Block title="Why it matters">
        <AdminInput label="Section title" name="detail_whyTitle" defaultValue={detail.whyTitle ?? ""} />
        <AdminTextarea
          label="Bullet points (one per line)"
          name="detail_whyBullets"
          defaultValue={(detail.whyBullets ?? []).join("\n")}
          rows={5}
        />
        <AdminTextarea label="Pull quote" name="detail_pullQuote" defaultValue={detail.pullQuote ?? ""} rows={3} />
      </Block>

      <Block title="How we work">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg bg-slate-50 p-3">
            <p className="mb-2 text-xs font-semibold text-slate-600">Pillar {i + 1}</p>
            <AdminInput
              label="Title"
              name={`detail_pillar_${i}_title`}
              defaultValue={pillars[i]?.title ?? ""}
            />
            <AdminTextarea
              label="Body"
              name={`detail_pillar_${i}_body`}
              defaultValue={pillars[i]?.body ?? ""}
              rows={3}
            />
          </div>
        ))}
      </Block>

      <AdminRichTextEditor
        name="detail_body"
        label="Main article body"
        defaultValue={detail.body ?? ""}
        bucket="partners"
        hint={`Long-form content for ${partnerName} detail page.`}
      />
    </div>
  );
}
