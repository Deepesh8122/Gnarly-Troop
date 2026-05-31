import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminSectionFields from "@/components/admin/AdminSectionFields";
import {
  AdminCheckbox,
  AdminForm,
  AdminInput,
  AdminPageHeader,
  AdminSubmit,
} from "@/components/admin/AdminForm";
import { getAdminPageSection } from "@/lib/admin/data";
import { updatePageSectionAction } from "@/lib/admin/actions";
import { mergeSectionContent } from "@gnarly/lib";
import { SECTION_REGISTRY, type SectionType } from "@gnarly/types";

type Params = { params: Promise<{ id: string; sectionId: string }> };

const MANAGED_ELSEWHERE: Partial<
  Record<string, { href: string; label: string; hint: string }>
> = {
  vision_4c: {
    href: "/admin/vision/",
    label: "Manage 4C Vision pillars",
    hint: "Pillar titles, colors, and story pages are edited under 4C Vision.",
  },
  gallery: {
    href: "/admin/gallery/",
    label: "Manage galleries",
    hint: "Photo galleries are managed in the Gallery admin.",
  },
  partners: {
    href: "/admin/collaboration/",
    label: "Manage partners",
    hint: "Partner logos and descriptions are managed under Collaboration.",
  },
};

export default async function AdminSectionEditPage({ params }: Params) {
  const { id, sectionId } = await params;
  const section = await getAdminPageSection(sectionId);
  if (!section) notFound();

  const pages = section.pages as { slug?: string; title?: string } | null;
  const stored = (section.content as Record<string, unknown>) ?? {};
  const effective = mergeSectionContent(section.section_type, stored);
  const registry = SECTION_REGISTRY.find((r) => r.type === section.section_type);
  const external = MANAGED_ELSEWHERE[section.section_type];
  const bodyHtml =
    (stored.body_html as string) ||
    (stored.html as string) ||
    (stored.body as string) ||
    "";

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title={section.title ?? section.section_type}
        description={
          registry?.description ??
          `Section on ${pages?.title ?? "page"} — edit with the fields below`
        }
        actions={
          <Link href={`/admin/pages/${id}/`} className="text-sm text-slate-500 hover:text-slate-800">
            ← Back to page
          </Link>
        }
      />

      {external && (
        <div className="admin-card border-l-4 border-sky-500 p-4 text-sm text-slate-700">
          <p className="mb-2">{external.hint}</p>
          <Link href={external.href} className="admin-link font-semibold">
            {external.label} →
          </Link>
        </div>
      )}

      <section className="admin-card p-6">
        <AdminForm action={updatePageSectionAction.bind(null, sectionId)}>
          <div className="mb-6 grid gap-4 border-b border-slate-200 pb-6 md:grid-cols-3">
            <AdminInput label="Section title (admin label)" name="title" defaultValue={section.title ?? ""} />
            <AdminInput
              label="Sort order"
              name="sort_order"
              type="number"
              defaultValue={String(section.sort_order)}
            />
            <div className="flex items-end">
              <AdminCheckbox name="is_enabled" label="Enabled on site" defaultChecked={section.is_enabled} />
            </div>
          </div>

          <AdminSectionFields
            sectionType={section.section_type as SectionType}
            effective={effective}
            bodyHtml={bodyHtml}
          />

          <div className="mt-8 border-t border-slate-200 pt-6">
            <AdminSubmit />
          </div>
        </AdminForm>
      </section>
    </div>
  );
}
