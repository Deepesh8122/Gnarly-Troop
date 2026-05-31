import Link from "next/link";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import { deleteEventFormAction } from "@/lib/admin/actions";
import { getAdminEventRegistrations, getAdminEvents } from "@/lib/admin/data";
import { mapEventsTableRows } from "@/lib/admin/table-rows";

const eventColumns: AdminTableColumn[] = [
  { key: "thumbUrl", header: "", format: "thumb", sortable: false },
  {
    key: "title",
    header: "Title",
    format: "link",
    linkPattern: "/admin/events/{id}/",
    linkLabelKey: "title",
  },
  { key: "slug", header: "Slug", format: "mono" },
  { key: "status", header: "Status" },
  { key: "starts_at", header: "Starts", format: "date" },
];

const regColumns: AdminTableColumn[] = [
  { key: "full_name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "event_title", header: "Event" },
  { key: "created_at", header: "Registered", format: "date" },
  { key: "status", header: "Status" },
];

export default async function AdminEventsPage() {
  const [events, registrations] = await Promise.all([
    getAdminEvents(),
    getAdminEventRegistrations(),
  ]);

  const eventRows = mapEventsTableRows(events);
  const regRows = registrations.map((r) => ({
    id: r.id,
    full_name: r.full_name,
    email: r.email,
    event_title: (r.events as { title?: string } | null)?.title ?? "—",
    created_at: r.created_at,
    status: r.status,
  }));

  return (
    <div className="space-y-8">
      <AdminNotConfigured />
      <AdminPageHeader
        title="Events"
        description="Create and edit summits and programs."
        actions={
          <Link href="/admin/events/new/" className="admin-btn-primary">
            + New event
          </Link>
        }
      />
      <AdminDataTable
        rows={eventRows}
        columns={eventColumns}
        emptyMessage="No events yet — create one"
        searchKeys={["title", "slug", "status"]}
        statusFilterKey="status"
        dateFilterKey="starts_at"
        deleteAction={deleteEventFormAction}
        deleteEntityLabel="event"
      />
      <section>
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Recent registrations</h3>
        <AdminDataTable
          rows={regRows}
          columns={regColumns}
          emptyMessage="No registrations yet"
          searchKeys={["full_name", "email", "event_title"]}
          statusFilterKey="status"
          dateFilterKey="created_at"
          defaultPageSize={25}
        />
      </section>
    </div>
  );
}
