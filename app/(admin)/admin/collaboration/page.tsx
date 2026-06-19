import Link from "next/link";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import { deleteCollaborationPartnerFormAction } from "@/lib/admin/actions";
import { getAdminCollaborationPartners } from "@/lib/admin/data";
import { mapCollaborationTableRows } from "@/lib/admin/table-rows";

const columns: AdminTableColumn[] = [
  { key: "thumbUrl", header: "", format: "thumb", sortable: false },
  {
    key: "name",
    header: "Name",
    format: "link",
    linkPattern: "/admin/collaboration/{id}/",
    linkLabelKey: "name",
  },
  { key: "slug", header: "Slug", format: "mono" },
  { key: "category", header: "Category" },
  { key: "status", header: "Status" },
  { key: "is_live", header: "Live on site", format: "badge-live" },
];

export default async function AdminCollaborationPage() {
  const partners = await getAdminCollaborationPartners();
  const rows = mapCollaborationTableRows(partners);

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <section className="admin-card border-teal-100 bg-teal-50/50 p-5">
        <p className="text-sm font-semibold text-teal-900">Collaboration landing page</p>
        <p className="mt-1 text-sm text-slate-600">
          Edit hero, mission quote, yellow band, achievement, tracking pillars, and section
          visibility for <code className="text-xs">/collaboration/</code>.
        </p>
        <Link href="/admin/collaboration/landing/" className="admin-btn-primary mt-3 inline-block text-sm">
          Open landing editor →
        </Link>
      </section>
      <AdminPageHeader
        title="Collaboration"
        description="Partners shown on /collaboration and profile pages."
        actions={
          <>
            <Link href="/collaboration/" target="_blank" className="admin-link text-sm">
              View site →
            </Link>
            <Link href="/admin/collaboration/landing/" className="admin-btn-secondary text-sm">
              Landing page
            </Link>
            <Link href="/admin/collaboration/new/" className="admin-btn-primary">
              + Add partner
            </Link>
          </>
        }
      />
      <AdminDataTable
        rows={rows}
        columns={columns}
        emptyMessage="No partners — import from Dashboard or add manually"
        searchKeys={["name", "slug", "category", "status"]}
        statusFilterKey="status_raw"
        deleteAction={deleteCollaborationPartnerFormAction}
        deleteEntityLabel="partner"
      />
    </div>
  );
}
