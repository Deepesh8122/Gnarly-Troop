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
  { key: "is_enabled", header: "Live", format: "badge-live" },
];

export default async function AdminCollaborationPage() {
  const partners = await getAdminCollaborationPartners();
  const rows = mapCollaborationTableRows(partners);

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
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
        statusFilterKey="status"
        deleteAction={deleteCollaborationPartnerFormAction}
        deleteEntityLabel="partner"
      />
    </div>
  );
}
