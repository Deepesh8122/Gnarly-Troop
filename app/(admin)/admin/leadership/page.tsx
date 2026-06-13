import Link from "next/link";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import ImportTeamPortalButton from "@/components/admin/ImportTeamPortalButton";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import { deleteTeamMemberFormAction } from "@/lib/admin/actions";
import { getAdminTeam } from "@/lib/admin/data";
import { mapLeadershipTableRows } from "@/lib/admin/table-rows";

const columns: AdminTableColumn[] = [
  { key: "thumbUrl", header: "", format: "thumb", sortable: false },
  {
    key: "full_name",
    header: "Name",
    format: "link",
    linkPattern: "/admin/leadership/{id}/",
    linkLabelKey: "full_name",
  },
  { key: "designation", header: "Designation" },
  { key: "category", header: "Category" },
  { key: "status", header: "Status" },
  { key: "is_live", header: "Live on site", format: "badge-live" },
];

export default async function AdminLeadershipPage() {
  const team = await getAdminTeam();
  const rows = mapLeadershipTableRows(team);

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title="Team Members"
        description="Manage leadership profiles by category on /leadership."
        actions={
          <>
            <Link href="/leadership/" target="_blank" className="admin-link text-sm">
              View site →
            </Link>
            <Link href="/admin/leadership/categories/" className="admin-btn-secondary text-sm">
              Manage categories
            </Link>
            <ImportTeamPortalButton />
            <Link href="/admin/leadership/new/" className="admin-btn-primary">
              + Add member
            </Link>
          </>
        }
      />

      <AdminDataTable
        rows={rows}
        columns={columns}
        emptyMessage="No members — import GTGF Portal document or add manually"
        searchKeys={["full_name", "designation", "category", "status"]}
        statusFilterKey="status_raw"
        deleteAction={deleteTeamMemberFormAction}
        deleteEntityLabel="team member"
      />
    </div>
  );
}
