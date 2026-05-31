"use client";

import AdminDataTable, { type AdminTableColumn, type AdminTableRow } from "@/components/admin/AdminDataTable";
import AdminMediaRowDelete from "@/components/admin/AdminMediaRowDelete";
import MediaActions from "@/components/admin/MediaActions";

type MediaRow = AdminTableRow & {
  id: string;
  file_name: string;
  bucket: string;
  media_kind: string;
  mime_type?: string;
  publicUrl?: string;
};

type Props = {
  rows: MediaRow[];
  columns: AdminTableColumn[];
};

export default function AdminMediaListingTable({ rows, columns }: Props) {
  return (
    <AdminDataTable
      rows={rows}
      columns={columns}
      emptyMessage="No uploads yet"
      searchKeys={["file_name", "bucket", "media_kind"]}
      dateFilterKey="created_at"
      defaultPageSize={25}
      renderActions={(row) => (
        <>
          <MediaActions
            id={String(row.id)}
            file_name={String(row.file_name)}
            bucket={String(row.bucket)}
            media_kind={String(row.media_kind)}
            mime_type={row.mime_type as string | undefined}
            publicUrl={row.publicUrl as string | undefined}
          />
          <AdminMediaRowDelete id={String(row.id)} fileName={String(row.file_name)} />
        </>
      )}
    />
  );
}
