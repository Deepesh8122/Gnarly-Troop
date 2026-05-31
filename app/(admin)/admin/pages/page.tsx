import Link from "next/link";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import { getAdminPages } from "@/lib/admin/data";
import { mapPagesTableRows } from "@/lib/admin/table-rows";

const columns: AdminTableColumn[] = [
  { key: "thumbUrl", header: "", format: "thumb", sortable: false },
  {
    key: "title",
    header: "Title",
    format: "link",
    linkPattern: "/admin/pages/{id}/",
    linkLabelKey: "title",
  },
  { key: "slug", header: "Slug", format: "mono" },
  { key: "status", header: "Status" },
];

export default async function AdminPagesPage() {
  const pages = await getAdminPages();
  const rows = mapPagesTableRows(pages);

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title="Pages"
        description="Edit homepage sections and other pages. Published pages with sections drive the live site."
      />
      <AdminDataTable
        rows={rows}
        columns={columns}
        emptyMessage="No pages — run supabase/seed.sql"
        searchKeys={["title", "slug", "status"]}
        statusFilterKey="status"
      />
    </div>
  );
}
