import Link from "next/link";
import { collaborationLanding } from "@/src/data/collaborationData";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminCollaborationLandingEditor from "@/components/admin/AdminCollaborationLandingEditor";
import { AdminForm, AdminPageHeader, AdminSubmit } from "@/components/admin/AdminForm";
import { getAdminCollaborationLanding } from "@/lib/admin/data";
import { saveCollaborationLandingAction } from "@/lib/admin/actions";

export default async function AdminCollaborationLandingPage() {
  const stored = await getAdminCollaborationLanding();
  const data = (stored ?? collaborationLanding) as typeof collaborationLanding;

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title="Collaboration landing"
        description="Edit hero, mission quote, story blocks, stats, and CTAs — no JSON required."
        actions={
          <Link href="/admin/collaboration/" className="text-sm text-slate-500 hover:text-slate-800">
            ← Partners
          </Link>
        }
      />
      <section className="admin-card p-6">
        <AdminForm action={saveCollaborationLandingAction}>
          <AdminCollaborationLandingEditor data={data} />
          <div className="mt-8 border-t border-slate-200 pt-6">
            <AdminSubmit />
          </div>
        </AdminForm>
      </section>
    </div>
  );
}
