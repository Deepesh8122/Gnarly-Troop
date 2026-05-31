import Link from "next/link";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { resolveThumbUrl, visionPillarThumb } from "@/lib/admin/thumbnails";

const columns: AdminTableColumn[] = [
  { key: "thumbUrl", header: "", format: "thumb", sortable: false },
  {
    key: "title",
    header: "Pillar",
    format: "link",
    linkPattern: "/admin/vision/{id}/",
    linkLabelKey: "title",
  },
  { key: "slug", header: "Slug", format: "mono" },
  { key: "status", header: "Status" },
  {
    key: "stories_label",
    header: "Stories",
    format: "link",
    linkPattern: "/admin/vision/{id}/",
    linkLabelKey: "stories_label",
  },
];

export default async function AdminVisionPage() {
  let pillars: {
    id: string;
    slug: string;
    title: string;
    status: string;
    sort_order: number;
    cover?: { bucket: string; storage_path: string } | { bucket: string; storage_path: string }[] | null;
  }[] = [];
  let blockCount = 0;

  if (getSupabaseEnv().serviceRoleKey) {
    try {
      const admin = createServiceRoleClient();
      const { data } = await admin
        .from("vision_items")
        .select(
          "id, slug, title, status, sort_order, cover:media_library!vision_items_cover_media_id_fkey(bucket, storage_path)",
        )
        .order("sort_order");
      pillars = data ?? [];
      const { count } = await admin
        .from("vision_item_blocks")
        .select("id", { count: "exact", head: true });
      blockCount = count ?? 0;
    } catch {
      /* empty */
    }
  }

  const rows = pillars.map((p) => ({
    id: p.id,
    thumbUrl: resolveThumbUrl({ media: p.cover }, visionPillarThumb(p.slug)),
    title: p.title,
    slug: p.slug,
    status: p.status,
    stories_label: "Manage blocks →",
  }));

  return (
    <div>
      <AdminPageHeader
        title="4C Vision"
        description={`Climate, Community, Culture, Cooperation — ${blockCount} story blocks in database.`}
        actions={
          <Link href="/" target="_blank" className="admin-link text-sm">
            View 4C on site →
          </Link>
        }
      />
      <p className="admin-card mb-4 p-4 text-sm text-slate-600">
        Use <strong>Import static data</strong> on the Dashboard to load stories. Thumbnails use
        pillar cover media or default 4C artwork.
      </p>
      <AdminDataTable
        rows={rows}
        columns={columns}
        emptyMessage="No vision pillars — run seed.sql"
        searchKeys={["title", "slug", "status"]}
        statusFilterKey="status"
      />
    </div>
  );
}
