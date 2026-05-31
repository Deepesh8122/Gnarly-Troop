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
  AdminTextarea,
} from "@/components/admin/AdminForm";
import {
  getAdminCollaborationCategories,
  getAdminCollaborationPartner,
} from "@/lib/admin/data";
import {
  deleteCollaborationPartnerAction,
  saveCollaborationPartnerAction,
} from "@/lib/admin/actions";
import MediaPicker from "@/components/admin/MediaPicker";
import AdminSlugField from "@/components/admin/AdminSlugField";

type Params = { params: Promise<{ id: string }> };

export default async function AdminCollaborationEditPage({ params }: Params) {
  const { id } = await params;
  const [partner, categories] = await Promise.all([
    getAdminCollaborationPartner(id),
    getAdminCollaborationCategories(),
  ]);
  if (!partner) notFound();

  const detailJson = JSON.stringify(partner.detail_content ?? {}, null, 2);

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title={partner.name}
        actions={
          <>
            <Link
              href={`/collaboration/${partner.slug}/`}
              target="_blank"
              className="admin-link text-sm"
            >
              Preview →
            </Link>
            <Link href="/admin/collaboration/" className="text-sm text-slate-500 hover:text-slate-800">
              ← All
            </Link>
          </>
        }
      />
      <section className="admin-card p-6">
        <AdminForm action={saveCollaborationPartnerAction.bind(null, id)}>
          <MediaPicker
            name="partner"
            label="Partner logo / image"
            bucket="partners"
            defaultMediaId={partner.logo_media_id ?? ""}
            defaultLegacyPath={partner.legacy_image_path ?? ""}
          />
          <AdminSlugField
            nameLabel="Partner name"
            nameField="name"
            slugField="slug"
            nameDefault={partner.name}
            slugDefault={partner.slug}
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminSelect
              label="Category"
              name="category_id"
              defaultValue={partner.category_id ?? ""}
              options={[
                { value: "", label: "None" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
            <AdminInput label="Email" name="email" defaultValue={partner.email ?? ""} />
            <AdminInput label="Phone" name="phone" defaultValue={partner.phone ?? ""} />
            <AdminInput
              label="Website"
              name="website_url"
              defaultValue={partner.website_url ?? ""}
            />
            <AdminInput
              label="Sort order"
              name="sort_order"
              type="number"
              defaultValue={String(partner.sort_order)}
            />
            <AdminSelect
              label="Status"
              name="status"
              defaultValue={partner.status}
              options={[
                { value: "published", label: "Published" },
                { value: "draft", label: "Draft" },
              ]}
            />
          </div>
          <AdminRichTextEditor
            name="short_description"
            label="Short description"
            defaultValue={partner.short_description ?? ""}
            bucket="partners"
            minimal
          />
          <AdminRichTextEditor
            name="description_html"
            label="Full description"
            defaultValue={partner.description_html ?? ""}
            bucket="partners"
          />
          <AdminTextarea
            label="Detail page content (JSON — advanced)"
            name="detail_content"
            defaultValue={detailJson}
            rows={12}
          />
          <AdminCheckbox name="is_enabled" label="Show on website" defaultChecked={partner.is_enabled} />
          <AdminSubmit />
        </AdminForm>
        <div className="mt-6 border-t border-slate-200 pt-6">
          <AdminDeleteForm
            action={deleteCollaborationPartnerAction.bind(null, id)}
            label="Delete partner"
            message={`Permanently delete ${partner.name}?`}
          />
        </div>
      </section>
    </div>
  );
}
