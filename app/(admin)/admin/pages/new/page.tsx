import Link from "next/link";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";
import AdminSlugField from "@/components/admin/AdminSlugField";
import {
  AdminForm,
  AdminPageHeader,
  AdminSelect,
  AdminSubmit,
} from "@/components/admin/AdminForm";
import { createPageAction } from "@/lib/admin/actions";

export default function AdminNewPagePage() {
  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title="New page"
        description="Create a content page for the footer, help center, contact, etc. Link it from Admin → Menus → Footer Quick Links."
        actions={
          <Link href="/admin/pages/" className="text-sm text-slate-500 hover:text-slate-800">
            ← All pages
          </Link>
        }
      />
      <section className="admin-card p-6">
        <AdminForm action={createPageAction}>
          <AdminSlugField
            nameLabel="Page title"
            nameField="title"
            slugField="slug"
            nameDefault=""
            slugDefault=""
            required
          />
          <AdminSelect
            label="Status"
            name="status"
            defaultValue="published"
            options={[
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
            ]}
          />
          <AdminRichTextEditor
            name="body_html"
            label="Page content"
            defaultValue=""
            bucket="banners"
            hint="Main text for this page. You can refine sections after saving."
          />
          <AdminSubmit label="Create page" />
        </AdminForm>
      </section>
    </div>
  );
}
