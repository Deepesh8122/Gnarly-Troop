import Link from "next/link";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import { getAdminMenus, getAdminPages } from "@/lib/admin/data";
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
  const [pages, menus] = await Promise.all([getAdminPages(), getAdminMenus()]);
  const rows = mapPagesTableRows(pages);
  const footerMenu = menus.find((m) => m.slug === "footer-quick");

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title="Pages"
        description="Create and edit site pages. Link published pages from Admin → Menus → Footer Quick Links."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {footerMenu && (
              <Link
                href={`/admin/menus/${footerMenu.id}/`}
                className="admin-btn-secondary text-sm"
              >
                Footer links
              </Link>
            )}
            <Link href="/admin/pages/new/" className="admin-btn-primary">
              + New page
            </Link>
          </div>
        }
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
