import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import {
  AdminCheckbox,
  AdminForm,
  AdminInput,
  AdminPageHeader,
  AdminSubmit,
  AdminTextarea,
} from "@/components/admin/AdminForm";
import { getAdminSettings } from "@/lib/admin/data";
import { saveSocialLinkAction, updateSiteSettingAction } from "@/lib/admin/actions";

export default async function AdminSettingsPage() {
  const { settings, social } = await getAdminSettings();

  return (
    <div className="space-y-8">
      <AdminNotConfigured />
      <AdminPageHeader
        title="Settings"
        description="Site-wide values and social links used in the footer and CTAs."
      />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Site settings</h3>
        {settings.map((s) => (
          <div key={s.key} className="admin-card p-5">
            <p className="mb-2 font-mono text-sm text-amber-200">{s.key}</p>
            {s.description && <p className="mb-3 text-xs text-zinc-500">{s.description}</p>}
            <AdminForm action={updateSiteSettingAction.bind(null, s.key)}>
              <AdminTextarea
                label="Value (JSON)"
                name="value"
                defaultValue={JSON.stringify(s.value, null, 2)}
                rows={3}
              />
              <AdminSubmit />
            </AdminForm>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Social links</h3>
        {social.map((link) => (
          <div key={link.id} className="admin-card p-5">
            <AdminForm action={saveSocialLinkAction.bind(null, link.id)}>
              <div className="grid gap-4 md:grid-cols-2">
                <AdminInput label="Platform" name="platform" defaultValue={link.platform} />
                <AdminInput label="URL" name="url" type="url" defaultValue={link.url} />
                <AdminInput
                  label="Sort order"
                  name="sort_order"
                  type="number"
                  defaultValue={String(link.sort_order)}
                />
                <div className="flex items-end">
                  <AdminCheckbox name="is_enabled" label="Enabled" defaultChecked={link.is_enabled} />
                </div>
              </div>
              <AdminSubmit />
            </AdminForm>
          </div>
        ))}
        <div className="admin-card border-dashed p-5">
          <p className="mb-3 text-sm text-zinc-400">Add social link</p>
          <AdminForm action={saveSocialLinkAction.bind(null, null)}>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminInput label="Platform" name="platform" required />
              <AdminInput label="URL" name="url" type="url" required />
            </div>
            <AdminSubmit label="Add link" />
          </AdminForm>
        </div>
      </section>
    </div>
  );
}
