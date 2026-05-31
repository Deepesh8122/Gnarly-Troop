import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";
import AdminSocialLinks from "@/components/admin/AdminSocialLinks";
import { AdminDeleteForm } from "@/components/admin/AdminConfirmDelete";
import {
  AdminCheckbox,
  AdminForm,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminSubmit,
} from "@/components/admin/AdminForm";
import { getAdminTeamCategories, getAdminTeamMember } from "@/lib/admin/data";
import { deleteTeamMemberAction, saveTeamMemberAction } from "@/lib/admin/actions";
import MediaPicker from "@/components/admin/MediaPicker";
import AdminSlugField from "@/components/admin/AdminSlugField";

type Params = { params: Promise<{ id: string }> };

export default async function AdminLeadershipEditPage({ params }: Params) {
  const { id } = await params;
  const [member, categories] = await Promise.all([
    getAdminTeamMember(id),
    getAdminTeamCategories(),
  ]);
  if (!member) notFound();

  const socialLinks =
    (member as { social_links?: Record<string, string> }).social_links ?? null;

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title={member.full_name}
        actions={
          <>
            <Link
              href={`/leadership/${member.slug}/`}
              target="_blank"
              className="admin-link text-sm"
            >
              Preview →
            </Link>
            <Link href="/admin/leadership/" className="text-sm text-slate-500 hover:text-slate-800">
              ← All
            </Link>
          </>
        }
      />
      <section className="admin-card p-6">
        <AdminForm action={saveTeamMemberAction.bind(null, id)}>
          <MediaPicker
            name="profile"
            label="Profile photo"
            bucket="team"
            defaultMediaId={member.image_media_id ?? ""}
            defaultLegacyPath={member.legacy_image_path ?? ""}
          />
          <AdminSlugField
            nameLabel="Full name"
            nameField="full_name"
            slugField="slug"
            nameDefault={member.full_name}
            slugDefault={member.slug}
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput label="Designation" name="designation" defaultValue={member.designation} required />
            <AdminSelect
              label="Category"
              name="category_id"
              defaultValue={member.category_id}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
            <AdminInput label="Division" name="division" defaultValue={member.division ?? ""} />
            <AdminInput label="Region" name="region" defaultValue={member.region ?? ""} />
            <AdminInput label="Education" name="education" defaultValue={member.education ?? ""} />
            <AdminInput
              label="Sort order"
              name="sort_order"
              type="number"
              defaultValue={String(member.sort_order)}
            />
            <AdminSelect
              label="Status"
              name="status"
              defaultValue={member.status}
              options={[
                { value: "published", label: "Published (Active)" },
                { value: "draft", label: "Draft (Inactive)" },
              ]}
            />
          </div>
          <AdminSocialLinks
            defaultValue={socialLinks}
            linkedinDefault={member.linkedin_url ?? ""}
          />
          <AdminRichTextEditor
            name="bio_html"
            label="Bio"
            defaultValue={member.bio_html ?? ""}
            bucket="team"
            hint="Rich biography shown on the profile page."
          />
          <AdminCheckbox name="is_enabled" label="Show on website" defaultChecked={member.is_enabled} />
          <AdminSubmit />
        </AdminForm>
        <div className="mt-6 border-t border-slate-200 pt-6">
          <AdminDeleteForm
            action={deleteTeamMemberAction.bind(null, id)}
            label="Delete member"
            message={`Permanently delete ${member.full_name}? This cannot be undone.`}
          />
        </div>
      </section>
    </div>
  );
}
