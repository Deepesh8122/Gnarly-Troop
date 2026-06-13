import Link from "next/link";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";
import {
  AdminForm,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminSubmit,
} from "@/components/admin/AdminForm";
import { saveGalleryAction } from "@/lib/admin/actions";
import MediaPicker from "@/components/admin/MediaPicker";
import AdminSlugField from "@/components/admin/AdminSlugField";
import { PUBLISH_STATUS_OPTIONS_SIMPLE } from "@/lib/cms/publish-state";

export default function AdminGalleryNewPage() {
  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title="New gallery"
        actions={
          <Link href="/admin/gallery/" className="text-sm text-slate-500 hover:text-slate-800">
            ← Cancel
          </Link>
        }
      />
      <section className="admin-card p-6">
        <AdminForm action={saveGalleryAction.bind(null, null)}>
          <MediaPicker name="gallery" label="Cover image" bucket="gallery" />
          <AdminSlugField nameLabel="Gallery title" nameField="title" slugField="slug" required />
          <AdminInput label="Category" name="category" />
          <AdminRichTextEditor name="description" label="Description" bucket="gallery" />
          <AdminSelect
            label="Status"
            name="status"
            defaultValue="draft"
            options={[...PUBLISH_STATUS_OPTIONS_SIMPLE]}
          />
          <AdminInput label="Sort order" name="sort_order" type="number" defaultValue="0" />
          <AdminSubmit label="Create gallery" />
        </AdminForm>
      </section>
    </div>
  );
}
