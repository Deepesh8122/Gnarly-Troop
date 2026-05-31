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
import { getAdminGallery } from "@/lib/admin/data";
import { deleteGalleryAction, saveGalleryAction } from "@/lib/admin/actions";
import MediaPicker from "@/components/admin/MediaPicker";
import AdminSlugField from "@/components/admin/AdminSlugField";

type Params = { params: Promise<{ id: string }> };

export default async function AdminGalleryEditPage({ params }: Params) {
  const { id } = await params;
  const gallery = await getAdminGallery(id);
  if (!gallery) notFound();

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title={gallery.title}
        actions={
          <Link href="/admin/gallery/" className="text-sm text-slate-500 hover:text-slate-800">
            ← All galleries
          </Link>
        }
      />
      <section className="admin-card p-6">
        <AdminForm action={saveGalleryAction.bind(null, id)}>
          <MediaPicker
            name="gallery"
            label="Cover image"
            bucket="gallery"
            defaultMediaId={gallery.cover_media_id ?? ""}
          />
          <AdminSlugField
            nameLabel="Gallery title"
            nameField="title"
            slugField="slug"
            nameDefault={gallery.title}
            slugDefault={gallery.slug}
            required
          />
          <AdminInput label="Category" name="category" defaultValue={gallery.category ?? ""} />
          <AdminRichTextEditor
            name="description"
            label="Description"
            defaultValue={gallery.description ?? ""}
            bucket="gallery"
          />
          <AdminSelect
            label="Status"
            name="status"
            defaultValue={gallery.status}
            options={[
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
            ]}
          />
          <AdminInput
            label="Sort order"
            name="sort_order"
            type="number"
            defaultValue={String(gallery.sort_order)}
          />
          <AdminCheckbox name="is_enabled" label="Enabled" defaultChecked={gallery.is_enabled} />
          <AdminSubmit />
        </AdminForm>
        <div className="mt-6 border-t border-slate-200 pt-6">
          <AdminDeleteForm
            action={deleteGalleryAction.bind(null, id)}
            label="Delete gallery"
            message={`Permanently delete "${gallery.title}"?`}
          />
        </div>
      </section>
    </div>
  );
}
