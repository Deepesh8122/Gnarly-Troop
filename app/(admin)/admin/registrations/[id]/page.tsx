import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import { AdminForm, AdminPageHeader, AdminSubmit, AdminTextarea } from "@/components/admin/AdminForm";
import { getAdminRegistration } from "@/lib/admin/data";
import {
  approveRegistrationAction,
  issueRegistrationPassAction,
  rejectRegistrationAction,
} from "@/lib/admin/registration-actions";
import {
  buildRegistrationDetailSections,
  type RegistrationDetailRow,
} from "@/lib/registration/registration-detail";

type Params = { params: Promise<{ id: string }> };

function docLink(id: string, doc: string, label: string, path: string | null | undefined) {
  if (!path) return null;
  return (
    <a
      href={`/api/admin/receipts/download/?type=registration-doc&id=${id}&doc=${doc}`}
      className="admin-link text-sm"
      target="_blank"
      rel="noreferrer"
    >
      {label} ↓
    </a>
  );
}

export default async function AdminRegistrationDetailPage({ params }: Params) {
  const { id } = await params;
  const row = (await getAdminRegistration(id)) as RegistrationDetailRow | null;
  if (!row) notFound();

  const sections = buildRegistrationDetailSections(row);
  const canReview = row.status === "pending_review";
  const meta = row.metadata as { diplomatic_note_path?: string } | null;

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title={row.full_name}
        description={`${row.delegate_id ?? "Pending ID"} · ${row.status.replace(/_/g, " ")}`}
        actions={
          <Link href="/admin/registrations/" className="text-sm text-slate-500 hover:text-slate-800">
            ← All registrations
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        {docLink(id, "photo", "Official photograph", row.photo_storage_path)}
        {docLink(id, "passport", "Passport scan", row.passport_storage_path)}
        {docLink(id, "visa", "Visa document", row.visa_storage_path)}
        {docLink(id, "government_id", "Government ID", row.government_id_storage_path)}
        {docLink(id, "diplomatic_note", "Diplomatic note", meta?.diplomatic_note_path)}
        {row.receipt_storage_path ? (
          <a
            href={`/api/admin/receipts/download/?type=registration&id=${id}`}
            className="admin-link text-sm font-semibold"
            target="_blank"
            rel="noreferrer"
          >
            Delegate pass PDF ↓
          </a>
        ) : null}
        <AdminForm action={issueRegistrationPassAction} className="inline">
          <input type="hidden" name="id" value={id} />
          <AdminSubmit
            label={row.receipt_storage_path ? "Regenerate & resend pass" : "Generate & email pass"}
          />
        </AdminForm>
      </div>

      {canReview && (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="admin-card space-y-4 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Approve accreditation</h3>
            <p className="text-sm text-slate-600">
              Confirms final accreditation. If the delegate pass was not issued at registration, it
              will be generated and sent by email and WhatsApp (if consented).
            </p>
            <AdminForm action={approveRegistrationAction}>
              <input type="hidden" name="id" value={id} />
              <AdminTextarea
                name="review_notes"
                label="Review notes (internal)"
                defaultValue={row.review_notes ?? ""}
                rows={3}
              />
              <AdminSubmit label="Approve & send delegate pass" />
            </AdminForm>
          </section>

          <section className="admin-card space-y-4 border-red-100 p-6">
            <h3 className="text-lg font-semibold text-red-900">Reject application</h3>
            <AdminForm action={rejectRegistrationAction}>
              <input type="hidden" name="id" value={id} />
              <AdminTextarea
                name="rejection_reason"
                label="Reason (sent to delegate)"
                rows={4}
                required
              />
              <AdminSubmit label="Reject registration" />
            </AdminForm>
          </section>
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section) => (
          <section key={section.id} className="admin-card p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
              {section.title}
            </h3>
            <dl className="grid gap-3 sm:grid-cols-2">
              {section.fields.map((field) => (
                <div key={field.label}>
                  <dt className="text-xs font-semibold uppercase text-slate-500">{field.label}</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{field.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
