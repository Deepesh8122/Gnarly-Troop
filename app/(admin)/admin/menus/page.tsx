import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";

import { AdminPageHeader } from "@/components/admin/AdminForm";

import { getAdminMenus } from "@/lib/admin/data";



const MENU_ICONS: Record<string, string> = {

  header: "/images/logos/logo-2.png",

  footer: "/images/sections/img-globe-girl-flag-2.png",

};



const columns: AdminTableColumn[] = [

  { key: "thumbUrl", header: "", format: "thumb", sortable: false },

  {

    key: "name",

    header: "Menu",

    format: "link",

    linkPattern: "/admin/menus/{id}/",

    linkLabelKey: "name",

  },

  { key: "slug", header: "Slug", format: "mono" },

  { key: "location", header: "Location", format: "badge" },

];



export default async function AdminMenusPage() {

  const menus = await getAdminMenus();



  const rows = menus.map((m) => ({

    id: m.id,

    thumbUrl: MENU_ICONS[m.location] ?? "/images/logos/logo-2.png",

    name: m.name,

    slug: m.slug,

    location: m.location,

  }));



  return (

    <div className="space-y-6">

      <AdminNotConfigured />

      <AdminPageHeader

        title="Navigation menus"

        description="Control header and footer links. Footer uses “Footer Quick Links” — link to CMS pages or custom URLs."

      />

      <AdminDataTable

        rows={rows}

        columns={columns}

        emptyMessage="No menus — run supabase/seed.sql"

        searchKeys={["name", "slug", "location"]}

      />

    </div>

  );

}

