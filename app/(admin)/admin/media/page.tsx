import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminMediaListingTable from "@/components/admin/AdminMediaListingTable";
import type { AdminTableColumn } from "@/components/admin/AdminDataTable";
import MediaUploadForm from "@/components/admin/MediaUploadForm";
import ManageBuckets from "@/components/admin/ManageBuckets";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import { getAdminMediaList } from "@/lib/admin/data";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";

export const revalidate = 0;

const columns: AdminTableColumn[] = [
  { key: "thumbUrl", header: "", format: "thumb", sortable: false },
  { key: "file_name", header: "File" },
  { key: "bucket", header: "Bucket" },
  { key: "media_kind", header: "Type" },
  { key: "created_at", header: "Uploaded", format: "date" },
];

export default async function AdminMediaPage() {
  const media = await getAdminMediaList();
  const env = getSupabaseEnv();

  let buckets = ["gallery", "team", "partners", "banners", "events", "videos"];
  try {
    const admin = createServiceRoleClient();
    const { data: setting } = await admin
      .from("site_settings")
      .select("value")
      .eq("key", "media_buckets")
      .maybeSingle();

    if (setting && Array.isArray(setting.value)) {
      buckets = setting.value.map(String);
    }
  } catch (err) {
    console.error("Error loading dynamic media buckets:", err);
  }

  const rows = media.map((m) => ({
    id: m.id,
    thumbUrl:
      m.media_kind === "image" && m.storage_path
        ? `${env.url}/storage/v1/object/public/${m.bucket}/${m.storage_path}`
        : "",
    file_name: m.file_name,
    bucket: m.bucket,
    media_kind: m.media_kind,
    created_at: m.created_at,
    mime_type: m.mime_type,
    publicUrl:
      m.storage_path && env.url
        ? `${env.url}/storage/v1/object/public/${m.bucket}/${m.storage_path}`
        : "",
  }));

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title="Media library"
        description="Upload, preview, rename, and delete files. Use media IDs in CMS forms."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <MediaUploadForm buckets={buckets} />
          <AdminMediaListingTable rows={rows} columns={columns} />
        </div>
        <div className="lg:col-span-1">
          <ManageBuckets initialBuckets={buckets} />
        </div>
      </div>
    </div>
  );
}
