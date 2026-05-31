import Link from "next/link";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import { getAdminEventRegistrations } from "@/lib/admin/data";
import { eligibilityLabel } from "@/lib/registration/constants";

const columns: AdminTableColumn[] = [
  { key: "full_name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "phone", header: "Phone", format: "mono" },
  { key: "eligibility_label", header: "Eligibility" },
  { key: "designation", header: "Designation" },
  { key: "organization", header: "Organization" },
  { key: "event_title", header: "Event" },
  { key: "created_at", header: "Registered", format: "date" },
  { key: "status", header: "Status", format: "badge" },
];

export default async function AdminRegistrationsPage() {
  const registrations = await getAdminEventRegistrations();

  const rows = registrations.map((r) => ({
    id: r.id,
    full_name: r.full_name,
    email: r.email,
    phone: r.phone ?? "—",
    eligibility_label: eligibilityLabel(r.eligibility as string | null),
    designation: r.designation ?? "—",
    organization: r.organization ?? "—",
    event_title: (r.events as { title?: string } | null)?.title ?? "—",
    created_at: r.created_at,
    status: r.status,
  }));

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title="Summit registrations"
        description="All delegate registrations with eligibility category. Confirmation emails are sent automatically on submit."
        actions={
          <Link href="/registration/" target="_blank" className="admin-link text-sm">
            View registration form →
          </Link>
        }
      />
      <AdminDataTable
        rows={rows}
        columns={columns}
        emptyMessage="No registrations yet — share /registration with delegates"
        searchKeys={["full_name", "email", "phone", "eligibility_label", "organization", "event_title"]}
        statusFilterKey="status"
        dateFilterKey="created_at"
        defaultPageSize={25}
      />
    </div>
  );
}
