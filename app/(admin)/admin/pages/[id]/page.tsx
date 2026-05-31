import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminSlugField from "@/components/admin/AdminSlugField";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import SeedHomepageSectionsButton from "@/components/admin/SeedHomepageSectionsButton";
import {
  AdminCheckbox,
  AdminForm,
  AdminPageHeader,
  AdminSelect,
  AdminSubmit,
} from "@/components/admin/AdminForm";
import { getAdminPage, getAdminPageSections } from "@/lib/admin/data";
import { addPageSectionFormAction, togglePageSectionFormAction, updatePageAction } from "@/lib/admin/actions";
import { pageThumb, sectionThumbFromContent } from "@/lib/admin/thumbnails";

type Params = { params: Promise<{ id: string }> };

const sectionColumns: AdminTableColumn[] = [
  { key: "thumbUrl", header: "", format: "thumb", sortable: false },
  { key: "sort_order", header: "#" },
  { key: "section_type", header: "Type", format: "mono" },
  { key: "title", header: "Title" },
  { key: "is_enabled", header: "Enabled", format: "badge-live" },
  {
    key: "edit_label",
    header: "",
    format: "link",
    linkPattern: "/admin/pages/{page_id}/sections/{id}/",
    linkLabelKey: "edit_label",
  },
];

export default async function AdminPageEditPage({ params }: Params) {
  const { id } = await params;
  const [page, sections] = await Promise.all([
    getAdminPage(id),
    getAdminPageSections(id),
  ]);
  if (!page) notFound();

  const thumb = pageThumb(page.slug, page.is_home);

  const sectionRows = sections.map((s) => ({
    id: s.id,
    page_id: id,
    thumbUrl: sectionThumbFromContent(
      s.section_type,
      (s.content as Record<string, unknown>) ?? null,
    ),
    sort_order: s.sort_order,
    section_type: s.section_type,
    title: s.title ?? "—",
    is_enabled: s.is_enabled,
    edit_label: "Edit content",
  }));

  return (
    <div className="space-y-8">
      <AdminNotConfigured />
      <AdminPageHeader
        title={`Edit: ${page.title}`}
        description={`Slug: /${page.slug}`}
        actions={
          <>
            {!page.is_home && page.status === "published" && (
              <Link
                href={`/${page.slug}/`}
                target="_blank"
                className="admin-link text-sm"
              >
                View on site →
              </Link>
            )}
            <Link href="/admin/pages/" className="text-sm text-slate-500 hover:text-slate-800">
              ← All pages
            </Link>
          </>
        }
      />

      <section className="admin-card p-6">
        <div className="mb-4 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb} alt={page.title} className="h-16 w-24 rounded-lg border object-cover" />
          <h3 className="text-lg font-semibold text-slate-900">Page settings</h3>
        </div>
        <AdminForm action={updatePageAction.bind(null, id)}>
          <AdminSlugField
            nameLabel="Page title"
            nameField="title"
            slugField="slug"
            nameDefault={page.title}
            slugDefault={page.slug}
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminSelect
              label="Status"
              name="status"
              defaultValue={page.status}
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
                { value: "archived", label: "Archived" },
              ]}
            />
            <div className="flex items-end">
              <AdminCheckbox name="is_home" label="Homepage" defaultChecked={page.is_home} />
            </div>
          </div>
          <AdminSubmit />
        </AdminForm>
      </section>

      {page.slug === "home" && (
        <SeedHomepageSectionsButton />
      )}

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Sections</h3>
          {!page.is_home && (
            <form action={addPageSectionFormAction.bind(null, id)}>
              <input type="hidden" name="section_type" value="custom_html" />
              <input type="hidden" name="title" value="Page content" />
              <button type="submit" className="admin-btn-secondary text-sm">
                + Add content section
              </button>
            </form>
          )}
        </div>
        <AdminDataTable
          rows={sectionRows}
          columns={sectionColumns}
          emptyMessage="No sections"
          searchKeys={["section_type", "title"]}
          defaultPageSize={25}
        />
        <p className="mt-3 text-xs text-slate-500">Toggle enabled state (saves immediately):</p>
        <ul className="mt-2 space-y-1 text-sm">
          {sections.map((s) => (
            <li key={s.id} className="flex items-center gap-3 text-slate-600">
              <span>{s.section_type}</span>
              <form action={togglePageSectionFormAction}>
                <input type="hidden" name="section_id" value={s.id} />
                <input type="hidden" name="enabled" value={s.is_enabled ? "0" : "1"} />
                <button type="submit" className="admin-link text-xs">
                  {s.is_enabled ? "Disable" : "Enable"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
