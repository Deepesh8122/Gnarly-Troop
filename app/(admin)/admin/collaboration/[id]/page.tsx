import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminCollaborationDetailEditor from "@/components/admin/AdminCollaborationDetailEditor";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";
import { AdminDeleteForm } from "@/components/admin/AdminConfirmDelete";
import {
  AdminForm,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminSubmit,
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
import { isLiveOnSite, PUBLISH_STATUS_OPTIONS_SIMPLE } from "@/lib/cms/publish-state";
import type { CollaborationDetail } from "@/src/data/collaborationData";

type Params = { params: Promise<{ id: string }> };

export default async function AdminCollaborationEditPage({ params }: Params) {
  const { id } = await params;
  const [partner, categories] = await Promise.all([
    getAdminCollaborationPartner(id),
    getAdminCollaborationCategories(),
  ]);
  if (!partner) notFound();

  const detail = (partner.detail_content ?? {}) as Partial<CollaborationDetail>;

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title={partner.name}
        actions={
          <>
            {isLiveOnSite(partner) && (
              <Link
                href={`/collaboration/${partner.slug}/`}
                target="_blank"
                className="admin-link text-sm"
              >
                View on site →
              </Link>
            )}
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
              options={[...PUBLISH_STATUS_OPTIONS_SIMPLE]}
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
            label="Listing description"
            defaultValue={partner.description_html ?? ""}
            bucket="partners"
          />

          <div className="my-8 border-t border-slate-200 pt-8">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Detail page content</h3>
            <AdminCollaborationDetailEditor detail={detail} partnerName={partner.name} />
          </div>

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

