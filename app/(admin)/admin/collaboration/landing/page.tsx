import Link from "next/link";
import { collaborationLanding } from "@/src/data/collaborationData";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import {
  AdminForm,
  AdminPageHeader,
  AdminSubmit,
  AdminTextarea,
} from "@/components/admin/AdminForm";
import { getAdminCollaborationLanding } from "@/lib/admin/data";
import { saveCollaborationLandingAction } from "@/lib/admin/actions";

export default async function AdminCollaborationLandingPage() {
  const stored = await getAdminCollaborationLanding();
  const json = JSON.stringify(stored ?? collaborationLanding, null, 2);

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title="Collaboration landing"
        description="Hero, mission quote, narrative blocks, stats — full JSON matching the static structure."
        actions={
          <Link href="/admin/collaboration/" className="text-sm text-slate-500 hover:text-slate-800">
            ← Partners
          </Link>
        }
      />
      <section className="admin-card p-6">
        <AdminForm action={saveCollaborationLandingAction}>
          <AdminTextarea label="Landing content (JSON)" name="landing" defaultValue={json} rows={24} />
          <AdminSubmit />
        </AdminForm>
      </section>
    </div>
  );
}
