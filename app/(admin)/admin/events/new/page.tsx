import Link from "next/link";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";
import {
  AdminCheckbox,
  AdminForm,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminSubmit,
} from "@/components/admin/AdminForm";
import { saveEventAction } from "@/lib/admin/actions";
import MediaPicker from "@/components/admin/MediaPicker";
import AdminSlugField from "@/components/admin/AdminSlugField";

export default function AdminEventNewPage() {
  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title="New event"
        actions={
          <Link href="/admin/events/" className="text-sm text-slate-500 hover:text-slate-800">
            ← Cancel
          </Link>
        }
      />
      <section className="admin-card p-6">
        <AdminForm action={saveEventAction.bind(null, null)}>
          <MediaPicker name="banner" label="Event banner" bucket="events" />
          <AdminSlugField nameLabel="Event title" nameField="title" slugField="slug" required />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput label="Subtitle" name="subtitle" />
            <AdminSelect
              label="Status"
              name="status"
              defaultValue="draft"
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
              ]}
            />
            <AdminInput label="Location" name="location" />
            <AdminInput label="Starts at" name="starts_at" type="datetime-local" />
            <AdminInput label="Ends at" name="ends_at" type="datetime-local" />
          </div>
          <AdminRichTextEditor name="description" label="Description" bucket="events" />
          <AdminCheckbox name="registration_enabled" label="Registration open" defaultChecked />
          <AdminCheckbox name="is_featured" label="Featured" />
          <AdminSubmit label="Create event" />
        </AdminForm>
      </section>
    </div>
  );
}
