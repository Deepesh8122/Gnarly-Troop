import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";

const columns: AdminTableColumn[] = [
  { key: "full_name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "phone", header: "Phone" },
  { key: "organization", header: "Organization" },
  { key: "created_at", header: "Date", format: "date" },
];

export default async function AdminBrochureLeadsPage() {
  let rows: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    organization: string | null;
    created_at: string;
  }[] = [];

  if (getSupabaseEnv().serviceRoleKey) {
    try {
      const admin = createServiceRoleClient();
      const { data } = await admin
        .from("brochure_download_leads")
        .select("id, full_name, email, phone, organization, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      rows = data ?? [];
    } catch {
      /* empty */
    }
  }

  const tableRows = rows.map((r) => ({
    id: r.id,
    full_name: r.full_name,
    email: r.email,
    phone: r.phone ?? "—",
    organization: r.organization ?? "—",
    created_at: r.created_at,
  }));

  return (
    <div>
      <AdminPageHeader
        title="Brochure download leads"
        description="Visitors who filled the form before downloading the summit brochure. Configure brochure URL in Settings."
      />
      <AdminDataTable
        rows={tableRows}
        columns={columns}
        emptyMessage="No brochure downloads yet"
        searchKeys={["full_name", "email", "phone", "organization"]}
        dateFilterKey="created_at"
        defaultPageSize={25}
      />
    </div>
  );
}
