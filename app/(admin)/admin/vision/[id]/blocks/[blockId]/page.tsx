import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";
import { AdminDeleteForm } from "@/components/admin/AdminConfirmDelete";
import {
  AdminCheckbox,
  AdminForm,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminSubmit,
} from "@/components/admin/AdminForm";
import AdminSlugField from "@/components/admin/AdminSlugField";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  deleteVisionBlockAction,
  saveVisionBlockAction,
} from "@/lib/admin/actions";
import { getAdminVisionBlock, getAdminVisionPillar } from "@/lib/admin/data";

type Params = { params: Promise<{ id: string; blockId: string }> };

export default async function AdminVisionBlockEditPage({ params }: Params) {
  const { id: pillarId, blockId } = await params;
  const [pillar, block] = await Promise.all([
    getAdminVisionPillar(pillarId),
    getAdminVisionBlock(blockId),
  ]);
  if (!pillar || !block || block.vision_item_id !== pillarId) notFound();

  const imageMedia = block.image as { id?: string } | { id?: string }[] | null | undefined;
  const mediaId = Array.isArray(imageMedia) ? imageMedia[0]?.id : imageMedia?.id;

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title={block.title ?? "Story block"}
        description={`${pillar.title} · ${block.block_type}`}
        actions={
          <Link href={`/admin/vision/${pillarId}/`} className="text-sm text-slate-500 hover:text-slate-800">
            ← {pillar.title}
          </Link>
        }
      />
      <section className="admin-card p-6">
        <AdminForm action={saveVisionBlockAction.bind(null, pillarId, blockId)}>
          <MediaPicker
            name="block"
            label="Story image"
            bucket="banners"
            defaultMediaId={mediaId ?? ""}
            defaultLegacyPath={block.legacy_image_path ?? ""}
          />
          <AdminSlugField
            nameLabel="Title"
            nameField="title"
            slugField="slug"
            nameDefault={block.title ?? ""}
            slugDefault={block.slug ?? ""}
            required
          />
          <AdminSelect
            label="Block type"
            name="block_type"
            defaultValue={block.block_type ?? "story"}
            options={[
              { value: "featured", label: "Featured story" },
              { value: "large", label: "Large card" },
              { value: "story", label: "Small story" },
            ]}
          />
          <AdminInput label="Caption / excerpt" name="excerpt" defaultValue={block.excerpt ?? ""} />
          <AdminInput label="Author" name="author" defaultValue={block.author ?? ""} />
          <AdminInput
            label="Read time (minutes)"
            name="read_time"
            type="number"
            defaultValue={block.read_time != null ? String(block.read_time) : ""}
          />
          <AdminInput
            label="Sort order"
            name="sort_order"
            type="number"
            defaultValue={String(block.sort_order ?? 0)}
          />
          <AdminRichTextEditor
            name="body"
            label="Story body"
            defaultValue={block.body ?? ""}
            bucket="banners"
          />
          <AdminCheckbox name="is_enabled" label="Published on site" defaultChecked={block.is_enabled} />
          <AdminSubmit />
        </AdminForm>
        <div className="mt-6 border-t border-slate-200 pt-6">
          <AdminDeleteForm
            action={deleteVisionBlockAction.bind(null, pillarId, blockId)}
            label="Delete story block"
            message={`Permanently delete "${block.title ?? "this story"}"?`}
          />
        </div>
      </section>
    </div>
  );
}
