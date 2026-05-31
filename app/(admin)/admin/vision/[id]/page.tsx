import Link from "next/link";
import { notFound } from "next/navigation";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import {
  AdminCheckbox,
  AdminForm,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminSubmit,
} from "@/components/admin/AdminForm";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  deleteVisionBlockForPillarFormAction,
  saveVisionPillarAction,
} from "@/lib/admin/actions";
import { getAdminVisionPillar, adminDb } from "@/lib/admin/data";
import { getSupabaseEnv } from "@/lib/env";
import { resolveThumbUrl, visionPillarThumb } from "@/lib/admin/thumbnails";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";

type Params = { params: Promise<{ id: string }> };

const columns: AdminTableColumn[] = [
  { key: "thumbUrl", header: "", format: "thumb", sortable: false },
  {
    key: "title",
    header: "Title",
    format: "link",
    linkPattern: "/admin/vision/{pillar_id}/blocks/{id}/",
    linkLabelKey: "title",
  },
  { key: "block_type", header: "Type", format: "mono" },
  { key: "slug", header: "Slug", format: "mono" },
  { key: "is_enabled", header: "Enabled", format: "badge-live" },
];

export default async function AdminVisionPillarPage({ params }: Params) {
  const { id } = await params;
  if (!getSupabaseEnv().serviceRoleKey) notFound();

  const pillar = await getAdminVisionPillar(id);
  if (!pillar) notFound();

  const admin = adminDb();
  if (!admin) notFound();

  const { data: blocks } = await admin
    .from("vision_item_blocks")
    .select("id, slug, block_type, title, sort_order, is_enabled, legacy_image_path")
    .eq("vision_item_id", id)
    .order("sort_order");

  const pillarThumb = visionPillarThumb(pillar.slug);
  const coverMedia = pillar.cover as { id?: string } | { id?: string }[] | null | undefined;
  const coverMediaId = Array.isArray(coverMedia) ? coverMedia[0]?.id : coverMedia?.id;

  const rows = (blocks ?? []).map((b) => ({
    id: b.id,
    pillar_id: id,
    thumbUrl: resolveThumbUrl({ legacy_image_path: b.legacy_image_path }, pillarThumb),
    block_type: b.block_type,
    title: b.title ?? "—",
    slug: b.slug ?? "—",
    is_enabled: b.is_enabled,
  }));

  return (
    <div className="space-y-8">
      <AdminNotConfigured />
      <AdminPageHeader
        title={pillar.title}
        description={`Pillar: ${pillar.slug}`}
        actions={
          <>
            <Link href="/admin/vision/" className="text-sm text-slate-500 hover:text-slate-800">
              ← 4C Vision
            </Link>
            <Link href={`/admin/vision/${id}/blocks/new/`} className="admin-btn-primary text-sm">
              + Add story block
            </Link>
          </>
        }
      />

      <section className="admin-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Pillar settings</h3>
        <AdminForm action={saveVisionPillarAction.bind(null, id)}>
          <MediaPicker
            name="cover"
            label="Cover image"
            bucket="banners"
            defaultMediaId={coverMediaId ?? ""}
          />
          <AdminInput label="Title" name="title" defaultValue={pillar.title} required />
          <AdminInput label="Subtitle" name="subtitle" defaultValue={pillar.subtitle ?? ""} />
          <AdminInput
            label="Short description"
            name="short_description"
            defaultValue={pillar.short_description ?? ""}
          />
          <AdminSelect
            label="Status"
            name="status"
            defaultValue={pillar.status ?? "published"}
            options={[
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
            ]}
          />
          <AdminCheckbox name="is_enabled" label="Enabled on site" defaultChecked={pillar.is_enabled} />
          <AdminSubmit />
        </AdminForm>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Story blocks</h3>
        <AdminDataTable
          rows={rows}
          columns={columns}
          emptyMessage="No story blocks — add one or run content import"
          searchKeys={["title", "slug", "block_type"]}
          defaultPageSize={25}
          deleteAction={deleteVisionBlockForPillarFormAction.bind(null, id)}
          deleteEntityLabel="story block"
        />
      </section>
    </div>
  );
}
