import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";
import {
  AdminCheckbox,
  AdminForm,
  AdminInput,
  AdminPageHeader,
  AdminSubmit,
  AdminTextarea,
} from "@/components/admin/AdminForm";
import { getAdminPageSection } from "@/lib/admin/data";
import { updatePageSectionAction } from "@/lib/admin/actions";

type Params = { params: Promise<{ id: string; sectionId: string }> };

function extractBodyHtml(content: Record<string, unknown> | null | undefined): string {
  if (!content) return "";
  for (const key of ["body_html", "html", "body", "description", "text"]) {
    const val = content[key];
    if (typeof val === "string" && val.trim()) return val;
  }
  return "";
}

export default async function AdminSectionEditPage({ params }: Params) {
  const { id, sectionId } = await params;
  const section = await getAdminPageSection(sectionId);
  if (!section) notFound();

  const pages = section.pages as { slug?: string; title?: string } | null;
  const content = (section.content as Record<string, unknown>) ?? {};
  const bodyHtml = extractBodyHtml(content);

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title={section.title ?? section.section_type}
        description={`Section on ${pages?.title ?? "page"} — edit content for this block`}
        actions={
          <Link href={`/admin/pages/${id}/`} className="text-sm text-slate-500 hover:text-slate-800">
            ← Back to page
          </Link>
        }
      />

      <section className="admin-card p-6">
        <AdminForm action={updatePageSectionAction.bind(null, sectionId)}>
          <AdminInput label="Title" name="title" defaultValue={section.title ?? ""} />
          <AdminInput
            label="Sort order"
            name="sort_order"
            type="number"
            defaultValue={String(section.sort_order)}
          />
          <AdminCheckbox name="is_enabled" label="Enabled on site" defaultChecked={section.is_enabled} />
          <AdminRichTextEditor
            name="body_html"
            label="Page content"
            defaultValue={bodyHtml}
            bucket="banners"
            hint="Rich text content for this section. Saved into section JSON on submit."
          />
          <AdminTextarea
            label="Content (JSON — advanced)"
            name="content"
            defaultValue={JSON.stringify(section.content ?? {}, null, 2)}
            rows={12}
          />
          <p className="text-xs text-slate-500">
            Use the rich editor for text content, or edit JSON directly for structured section data.
          </p>
          <AdminSubmit />
        </AdminForm>
      </section>
    </div>
  );
}
