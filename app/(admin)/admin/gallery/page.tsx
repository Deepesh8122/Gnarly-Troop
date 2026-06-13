import Link from "next/link";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import { deleteGalleryFormAction } from "@/lib/admin/actions";
import { getAdminGalleries } from "@/lib/admin/data";
import { mapGalleriesTableRows } from "@/lib/admin/table-rows";

const columns: AdminTableColumn[] = [
  { key: "thumbUrl", header: "", format: "thumb", sortable: false },
  {
    key: "title",
    header: "Title",
    format: "link",
    linkPattern: "/admin/gallery/{id}/",
    linkLabelKey: "title",
  },
  { key: "slug", header: "Slug", format: "mono" },
  { key: "status", header: "Status" },
  { key: "is_live", header: "Live on site", format: "badge-live" },
];

export default async function AdminGalleryPage() {
  const galleries = await getAdminGalleries();
  const rows = mapGalleriesTableRows(galleries);

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title="Gallery"
        description="Event galleries shown in homepage gallery section."
        actions={
          <Link href="/admin/gallery/new/" className="admin-btn-primary">
            + New gallery
          </Link>
        }
      />
      <AdminDataTable
        rows={rows}
        columns={columns}
        emptyMessage="No galleries yet"
        searchKeys={["title", "slug", "status"]}
        statusFilterKey="status_raw"
        deleteAction={deleteGalleryFormAction}
        deleteEntityLabel="gallery"
      />
    </div>
  );
}
