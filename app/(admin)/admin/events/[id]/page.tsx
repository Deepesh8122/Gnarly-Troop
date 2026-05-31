import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";
import { AdminDeleteForm } from "@/components/admin/AdminConfirmDelete";
import {
  AdminCheckbox,
  AdminForm,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminSubmit,
} from "@/components/admin/AdminForm";
import { getAdminEvent } from "@/lib/admin/data";
import { deleteEventAction, saveEventAction } from "@/lib/admin/actions";
import MediaPicker from "@/components/admin/MediaPicker";
import AdminSlugField from "@/components/admin/AdminSlugField";

type Params = { params: Promise<{ id: string }> };

function dtLocal(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default async function AdminEventEditPage({ params }: Params) {
  const { id } = await params;
  const event = await getAdminEvent(id);
  if (!event) notFound();

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title={event.title}
        actions={
          <Link href="/admin/events/" className="text-sm text-slate-500 hover:text-slate-800">
            ← All events
          </Link>
        }
      />
      <section className="admin-card p-6">
        <AdminForm action={saveEventAction.bind(null, id)}>
          <MediaPicker
            name="banner"
            label="Event banner"
            bucket="events"
            defaultMediaId={event.banner_media_id ?? ""}
          />
          <AdminSlugField
            nameLabel="Event title"
            nameField="title"
            slugField="slug"
            nameDefault={event.title}
            slugDefault={event.slug}
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput label="Subtitle" name="subtitle" defaultValue={event.subtitle ?? ""} />
            <AdminSelect
              label="Status"
              name="status"
              defaultValue={event.status}
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
                { value: "archived", label: "Archived" },
              ]}
            />
            <AdminInput label="Location" name="location" defaultValue={event.location ?? ""} />
            <AdminInput
              label="Starts at"
              name="starts_at"
              type="datetime-local"
              defaultValue={dtLocal(event.starts_at)}
            />
            <AdminInput
              label="Ends at"
              name="ends_at"
              type="datetime-local"
              defaultValue={dtLocal(event.ends_at)}
            />
          </div>
          <AdminRichTextEditor
            name="description"
            label="Description"
            defaultValue={event.description ?? ""}
            bucket="events"
          />
          <AdminCheckbox
            name="registration_enabled"
            label="Registration open"
            defaultChecked={event.registration_enabled}
          />
          <AdminCheckbox name="is_featured" label="Featured" defaultChecked={event.is_featured} />
          <AdminSubmit />
        </AdminForm>
        <div className="mt-6 border-t border-slate-200 pt-6">
          <AdminDeleteForm
            action={deleteEventAction.bind(null, id)}
            label="Delete event"
            message={`Permanently delete "${event.title}"?`}
          />
        </div>
      </section>
    </div>
  );
}
