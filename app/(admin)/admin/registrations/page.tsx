import Link from "next/link";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminRegistrationNotifyTest from "@/components/admin/AdminRegistrationNotifyTest";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import { getAdminEventRegistrations } from "@/lib/admin/data";
import {
  accreditationLabel,
  formatFeeInr,
} from "@/lib/registration/gsce-config";

const columns: AdminTableColumn[] = [
  { key: "full_name", header: "Name", format: "link", linkPattern: "/admin/registrations/{id}/", linkLabelKey: "full_name" },
  { key: "delegate_id", header: "Delegate ID", format: "mono" },
  { key: "email", header: "Email" },
  { key: "phone", header: "Phone", format: "mono" },
  { key: "accreditation_label", header: "Accreditation" },
  { key: "fee_label", header: "Fee" },
  { key: "payment_status", header: "Payment", format: "badge" },
  { key: "event_title", header: "Event" },
  { key: "created_at", header: "Registered", format: "date" },
  { key: "status", header: "Status", format: "badge" },
  {
    key: "receipt_link",
    header: "Receipt PDF",
    format: "link",
    linkPattern: "/api/admin/receipts/download/?type=registration&id={id}",
    linkLabelKey: "receipt_link",
  },
];

export default async function AdminRegistrationsPage() {
  const registrations = await getAdminEventRegistrations();

  const rows = registrations.map((r) => ({
    id: r.id,
    delegate_id: (r.delegate_id as string | null) ?? "—",
    full_name: r.full_name,
    email: r.email,
    phone: r.phone ?? "—",
    accreditation_label: accreditationLabel(r.accreditation_category as string | null),
    fee_label: formatFeeInr((r.amount_paise as number | null) ?? 0),
    payment_status: (r.payment_status as string | null) ?? "—",
    event_title: (r.events as { title?: string } | null)?.title ?? "—",
    created_at: r.created_at,
    status: r.status,
    receipt_link: r.receipt_storage_path ? "Download PDF" : "—",
  }));

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title="GSCE summit registrations"
        description="Delegate registrations with accreditation category, fee, payment status, and downloadable official pass PDFs."
        actions={
          <Link href="/registration/" target="_blank" className="admin-link text-sm">
            View registration portal →
          </Link>
        }
      />
      <AdminRegistrationNotifyTest />
      <AdminDataTable
        rows={rows}
        columns={columns}
        emptyMessage="No registrations yet — share /registration/ with delegates"
        searchKeys={[
          "full_name",
          "email",
          "phone",
          "delegate_id",
          "accreditation_label",
          "organization",
          "event_title",
        ]}
        statusFilterKey="status"
        dateFilterKey="created_at"
        defaultPageSize={25}
      />
    </div>
  );
}
