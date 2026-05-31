import Link from "next/link";
import { notFound } from "next/navigation";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { resolveThumbUrl, visionPillarThumb } from "@/lib/admin/thumbnails";

type Params = { params: Promise<{ id: string }> };

const columns: AdminTableColumn[] = [
  { key: "thumbUrl", header: "", format: "thumb", sortable: false },
  { key: "block_type", header: "Type", format: "mono" },
  { key: "title", header: "Title" },
  { key: "slug", header: "Slug", format: "mono" },
  { key: "is_enabled", header: "Enabled", format: "badge-live" },
];

export default async function AdminVisionPillarPage({ params }: Params) {
  const { id } = await params;
  if (!getSupabaseEnv().serviceRoleKey) notFound();

  const admin = createServiceRoleClient();
  const { data: pillar } = await admin.from("vision_items").select("*").eq("id", id).maybeSingle();
  if (!pillar) notFound();

  const { data: blocks } = await admin
    .from("vision_item_blocks")
    .select("id, slug, block_type, title, sort_order, is_enabled, legacy_image_path")
    .eq("vision_item_id", id)
    .order("sort_order");

  const pillarThumb = visionPillarThumb(pillar.slug);

  const rows = (blocks ?? []).map((b) => ({
    id: b.id,
    thumbUrl: resolveThumbUrl({ legacy_image_path: b.legacy_image_path }, pillarThumb),
    block_type: b.block_type,
    title: b.title ?? "—",
    slug: b.slug ?? "—",
    is_enabled: b.is_enabled,
    public_url: b.slug ? `/4cvision/${pillar.slug}/${b.slug}/` : "",
  }));

  return (
    <div>
      <AdminPageHeader
        title={pillar.title}
        description={`Pillar: ${pillar.slug}`}
        actions={
          <Link href="/admin/vision/" className="text-sm text-slate-500 hover:text-slate-800">
            ← 4C Vision
          </Link>
        }
      />
      <AdminDataTable
        rows={rows}
        columns={columns}
        emptyMessage="No story blocks — run content import"
        searchKeys={["title", "slug", "block_type"]}
        defaultPageSize={25}
      />
    </div>
  );
}
