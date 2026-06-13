import Link from "next/link";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";
import AdminSocialLinks from "@/components/admin/AdminSocialLinks";
import {
  AdminForm,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminSubmit,
} from "@/components/admin/AdminForm";
import { getAdminTeamCategories } from "@/lib/admin/data";
import { saveTeamMemberAction } from "@/lib/admin/actions";
import MediaPicker from "@/components/admin/MediaPicker";
import AdminSlugField from "@/components/admin/AdminSlugField";
import { PUBLISH_STATUS_OPTIONS_SIMPLE } from "@/lib/cms/publish-state";

export default async function AdminLeadershipNewPage() {
  const categories = await getAdminTeamCategories();

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title="Add team member"
        actions={
          <Link href="/admin/leadership/" className="text-sm text-slate-500 hover:text-slate-800">
            ← Cancel
          </Link>
        }
      />
      <section className="admin-card p-6">
        <AdminForm action={saveTeamMemberAction.bind(null, null)}>
          <MediaPicker name="profile" label="Profile photo" bucket="team" />
          <AdminSlugField
            nameLabel="Full name"
            nameField="full_name"
            slugField="slug"
            namePlaceholder="Dr. Jane Smith"
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput label="Designation / title" name="designation" required />
            <AdminSelect
              label="Category"
              name="category_id"
              required
              options={[
                { value: "", label: "Select…" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
            <AdminInput label="Division" name="division" />
            <AdminInput label="Region" name="region" />
            <AdminInput label="Education" name="education" />
            <AdminInput label="Sort order" name="sort_order" type="number" defaultValue="0" />
            <AdminSelect
              label="Status"
              name="status"
              defaultValue="draft"
              options={[...PUBLISH_STATUS_OPTIONS_SIMPLE]}
            />
          </div>
          <AdminSocialLinks />
          <AdminRichTextEditor
            name="bio_html"
            label="Bio"
            bucket="team"
            hint="Rich biography shown on the profile page."
          />
          <AdminSubmit label="Create member" />
        </AdminForm>
      </section>
    </div>
  );
}
