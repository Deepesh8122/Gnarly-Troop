import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminMenuItemsTable from "@/components/admin/AdminMenuItemsTable";
import {
  AdminCheckbox,
  AdminForm,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminSubmit,
} from "@/components/admin/AdminForm";
import {
  deleteMenuItemFormAction,
  saveMenuItemAction,
  toggleMenuItemFormAction,
} from "@/lib/admin/actions";
import {
  getAdminMenu,
  getAdminMenuItems,
  getAdminPagesForSelect,
} from "@/lib/admin/data";

type Params = { params: Promise<{ id: string }> };

export default async function AdminMenuEditPage({ params }: Params) {
  const { id } = await params;
  const [menu, items, pages] = await Promise.all([
    getAdminMenu(id),
    getAdminMenuItems(id),
    getAdminPagesForSelect(),
  ]);
  if (!menu) notFound();

  const pageOptions = [
    { value: "", label: "— Custom URL only —" },
    ...pages.map((p) => ({
      value: p.id,
      label: p.is_home ? `Home (${p.title})` : `${p.title} (/${p.slug})`,
    })),
  ];

  return (
    <div className="space-y-8">
      <AdminNotConfigured />
      <AdminPageHeader
        title={menu.name}
        description={`${menu.location} navigation · slug: ${menu.slug}`}
        actions={
          <Link href="/admin/menus/" className="text-sm text-slate-500 hover:text-slate-800">
            ← All menus
          </Link>
        }
      />

      <section className="admin-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Add menu item</h3>
        <AdminForm action={saveMenuItemAction.bind(null, id, null)}>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput label="Label" name="label" required placeholder="Leadership" />
            <AdminInput
              label="URL (optional if page selected)"
              name="url"
              placeholder="/leadership/ or /#sectionGallery"
            />
            <AdminSelect label="Link to page" name="page_id" options={pageOptions} />
            <AdminInput label="Sort order" name="sort_order" type="number" defaultValue="0" />
          </div>
          <div className="flex flex-wrap gap-4">
            <AdminCheckbox name="is_enabled" label="Visible on site" defaultChecked />
            <AdminCheckbox name="open_in_new_tab" label="Open in new tab" />
          </div>
          <AdminSubmit label="Add item" />
        </AdminForm>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Menu items</h3>
        <AdminMenuItemsTable
          menuId={id}
          items={items}
          toggleAction={toggleMenuItemFormAction}
          deleteAction={deleteMenuItemFormAction}
        />
      </section>
    </div>
  );
}
