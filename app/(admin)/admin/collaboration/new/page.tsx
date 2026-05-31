import Link from "next/link";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";
import {
  AdminCheckbox,
  AdminForm,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminSubmit,
  AdminTextarea,
} from "@/components/admin/AdminForm";
import { getAdminCollaborationCategories } from "@/lib/admin/data";
import { saveCollaborationPartnerAction } from "@/lib/admin/actions";
import MediaPicker from "@/components/admin/MediaPicker";
import AdminSlugField from "@/components/admin/AdminSlugField";

export default async function AdminCollaborationNewPage() {
  const categories = await getAdminCollaborationCategories();

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title="New collaboration partner"
        actions={
          <Link href="/admin/collaboration/" className="text-sm text-slate-500 hover:text-slate-800">
            ← Cancel
          </Link>
        }
      />
      <section className="admin-card p-6">
        <AdminForm action={saveCollaborationPartnerAction.bind(null, null)}>
          <MediaPicker name="partner" label="Partner logo / image" bucket="partners" />
          <AdminSlugField nameLabel="Partner name" nameField="name" slugField="slug" required />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminSelect
              label="Category"
              name="category_id"
              options={[
                { value: "", label: "None" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
            <AdminInput label="Email" name="email" type="email" />
            <AdminInput label="Phone" name="phone" />
            <AdminInput label="Website" name="website_url" type="url" />
            <AdminInput label="Sort order" name="sort_order" type="number" defaultValue="0" />
            <AdminSelect
              label="Status"
              name="status"
              defaultValue="published"
              options={[
                { value: "published", label: "Published" },
                { value: "draft", label: "Draft" },
              ]}
            />
          </div>
          <AdminRichTextEditor name="short_description" label="Short description" bucket="partners" minimal />
          <AdminRichTextEditor name="description_html" label="Full description" bucket="partners" />
          <AdminTextarea
            label="Detail page content (JSON — advanced)"
            name="detail_content"
            defaultValue="{}"
            rows={8}
          />
          <AdminCheckbox name="is_enabled" label="Show on website" defaultChecked />
          <AdminSubmit label="Create partner" />
        </AdminForm>
      </section>
    </div>
  );
}
