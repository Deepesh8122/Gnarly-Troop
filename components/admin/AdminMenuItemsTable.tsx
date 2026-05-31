"use client";

import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";

type MenuItem = {
  id: string;
  label: string;
  url: string | null;
  sort_order: number;
  is_enabled: boolean;
  pages: { slug?: string; title?: string; is_home?: boolean } | { slug?: string; title?: string; is_home?: boolean }[] | null;
};

type Props = {
  menuId: string;
  items: MenuItem[];
  toggleAction: (formData: FormData) => void | Promise<void>;
  deleteAction: (formData: FormData) => void | Promise<void>;
};

export default function AdminMenuItemsTable({ menuId, items, toggleAction, deleteAction }: Props) {
  const rows = items.map((i) => {
    const pageRaw = i.pages;
    const page = Array.isArray(pageRaw) ? pageRaw[0] : pageRaw;
    let urlDisplay = i.url ?? "—";
    if (!i.url && page) {
      urlDisplay = page.is_home ? "/" : `/${page.slug}/`;
    }
    return {
      id: i.id,
      sort_order: i.sort_order,
      label: i.label,
      url: urlDisplay,
      is_enabled: i.is_enabled,
    };
  });

  const columns: AdminTableColumn[] = [
    { key: "sort_order", header: "#" },
    { key: "label", header: "Label" },
    { key: "url", header: "URL / Page", format: "mono" },
    { key: "is_enabled", header: "Live", format: "badge-live" },
  ];

  return (
    <div className="space-y-4">
      <AdminDataTable
        rows={rows}
        columns={columns}
        emptyMessage="No items yet — add links above"
        searchKeys={["label", "url"]}
        defaultPageSize={25}
      />
      {items.length > 0 && (
        <ul className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          {items.map((i) => (
            <li
              key={i.id}
              className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-2 last:border-0"
            >
              <span className="font-medium text-slate-800">{i.label}</span>
              <form action={toggleAction}>
                <input type="hidden" name="menu_id" value={menuId} />
                <input type="hidden" name="item_id" value={i.id} />
                <input type="hidden" name="enabled" value={i.is_enabled ? "0" : "1"} />
                <button type="submit" className="admin-link text-xs">
                  {i.is_enabled ? "Disable" : "Enable"}
                </button>
              </form>
              <form action={deleteAction}>
                <input type="hidden" name="menu_id" value={menuId} />
                <input type="hidden" name="item_id" value={i.id} />
                <button type="submit" className="text-xs text-red-600 underline">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
