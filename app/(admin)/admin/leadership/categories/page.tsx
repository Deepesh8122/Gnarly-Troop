import Link from "next/link";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import {
  deleteTeamCategoryFormAction,
  moveTeamCategoryFormAction,
} from "@/lib/admin/actions";
import { getAdminTeamCategoriesWithCounts } from "@/lib/admin/data";

const columns: AdminTableColumn[] = [
  { key: "sort_order", header: "#" },
  { key: "name", header: "Category" },
  { key: "slug", header: "Slug", format: "mono" },
  { key: "display_style", header: "Layout", format: "badge" },
  { key: "member_count", header: "Members" },
  { key: "is_enabled", header: "Live", format: "badge-live" },
];

export default async function AdminTeamCategoriesPage() {
  const categories = await getAdminTeamCategoriesWithCounts();

  const rows = categories.map((c) => ({
    id: c.id,
    sort_order: c.sort_order,
    name: c.name,
    slug: c.slug,
    display_style: c.display_style,
    member_count: c.member_count,
    is_enabled: c.is_enabled,
  }));

  return (
    <div className="space-y-8">
      <AdminNotConfigured />
      <AdminPageHeader
        title="Team categories"
        description="Only the five approved leadership categories are used for team membership. Extra categories are hidden and new categories are not allowed."
        actions={
          <>
            <Link href="/admin/leadership/" className="admin-btn-secondary text-sm">
              ← Team members
            </Link>
          </>
        }
      />

      <section className="admin-card p-6">
        <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-slate-700">
          <strong className="font-semibold text-slate-900">Fixed categories only</strong> — the team section uses the five approved leadership categories. You can manage ordering and visibility, but new categories are not supported.
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Categories ({categories.length})</h3>
        <AdminDataTable
          rows={rows}
          columns={columns}
          emptyMessage="No categories — import GTGF Portal document or add one above"
          searchKeys={["name", "slug"]}
          deleteAction={deleteTeamCategoryFormAction}
          deleteEntityLabel="this category"
          defaultPageSize={25}
        />
        {categories.length > 0 && (
          <ul className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-white p-4 text-sm">
            {categories.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-2 last:border-0"
              >
                <span className="font-medium text-slate-800">{c.name}</span>
                <span className="text-xs text-slate-500">{c.member_count} members</span>
                <form action={moveTeamCategoryFormAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button type="submit" className="admin-link text-xs">
                    ↑ Move up
                  </button>
                </form>
                <form action={moveTeamCategoryFormAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button type="submit" className="admin-link text-xs">
                    ↓ Move down
                  </button>
                </form>
                <Link href={`/admin/leadership/categories/${c.id}/`} className="admin-link text-xs">
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
