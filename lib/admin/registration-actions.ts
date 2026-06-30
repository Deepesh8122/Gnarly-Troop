"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { fulfillEventRegistration } from "@/lib/registration/fulfill-registration";
import { deliverRegistrationPass } from "@/lib/registration/deliver-registration-pass";
import { sendEmail } from "@/lib/mail";
import type { ActionResult } from "@/lib/admin/actions";

function adminClient() {
  const env = getSupabaseEnv();
  if (!env.configured || !env.serviceRoleKey) {
    throw new Error("Supabase service role key required for admin writes.");
  }
  return createServiceRoleClient();
}

export async function approveRegistrationAction(formData: FormData): Promise<ActionResult> {
  try {
    const id = String(formData.get("id") ?? "").trim();
    const reviewNotes = String(formData.get("review_notes") ?? "").trim();
    if (!id) return { ok: false, error: "Registration ID required." };

    const supabase = adminClient();
    const auth = await createServerSupabaseClient();
    const {
      data: { user },
    } = await auth.auth.getUser();

    const { data: reg, error } = await supabase
      .from("event_registrations")
      .select(
        `id, full_name, email, phone, whatsapp_number, accreditation_category, eligibility,
         amount_paise, delegate_id, receipt_sent_at, status, metadata,
         events(id, title, location, starts_at, ends_at)`,
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !reg) return { ok: false, error: "Registration not found." };

    if (!["pending_review", "confirmed"].includes(reg.status)) {
      return { ok: false, error: `Cannot approve registration with status "${reg.status}".` };
    }

    const event = reg.events as {
      id: string;
      title: string;
      location: string | null;
      starts_at: string | null;
      ends_at: string | null;
    } | null;

    if (!event) return { ok: false, error: "Linked event not found." };

    await supabase
      .from("event_registrations")
      .update({
        approved_at: new Date().toISOString(),
        approved_by: user?.id ?? null,
        review_notes: reviewNotes || null,
        rejected_at: null,
        rejection_reason: null,
      })
      .eq("id", id);

    await fulfillEventRegistration({ registration: reg, event });

    revalidatePath("/admin/registrations/");
    revalidatePath(`/admin/registrations/${id}/`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Approval failed." };
  }
}

export async function issueRegistrationPassAction(formData: FormData): Promise<ActionResult> {
  try {
    const id = String(formData.get("id") ?? "").trim();
    if (!id) return { ok: false, error: "Registration ID required." };

    const result = await deliverRegistrationPass({ registrationId: id, resend: true });

    revalidatePath("/admin/registrations/");
    revalidatePath(`/admin/registrations/${id}/`);

    if (!result.ok) {
      return { ok: false, error: result.error ?? "Could not issue delegate pass." };
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Pass delivery failed." };
  }
}

export async function rejectRegistrationAction(formData: FormData): Promise<ActionResult> {
  try {
    const id = String(formData.get("id") ?? "").trim();
    const reason = String(formData.get("rejection_reason") ?? "").trim();
    if (!id) return { ok: false, error: "Registration ID required." };
    if (!reason) return { ok: false, error: "Rejection reason is required." };

    const supabase = adminClient();

    const { data: reg } = await supabase
      .from("event_registrations")
      .select("id, full_name, email, delegate_id, status")
      .eq("id", id)
      .maybeSingle();

    if (!reg) return { ok: false, error: "Registration not found." };
    if (!["pending_review", "pending_payment"].includes(reg.status)) {
      return { ok: false, error: `Cannot reject registration with status "${reg.status}".` };
    }

    await supabase
      .from("event_registrations")
      .update({
        status: "rejected",
        rejected_at: new Date().toISOString(),
        rejection_reason: reason,
      })
      .eq("id", id);

    await sendEmail({
      to: reg.email,
      subject: "GSCE Registration — Application Update",
      text: [
        `Dear ${reg.full_name},`,
        "",
        "Thank you for your interest in the Global Leadership & Cultural Exchange Summit (GSCE 2026).",
        "",
        "After review by the Summit Secretariat, we are unable to approve your registration at this time.",
        "",
        `Reason: ${reason}`,
        "",
        reg.delegate_id ? `Reference: ${reg.delegate_id}` : "",
        "",
        "For questions, contact president@gnarlytroop.org",
        "",
        "— Gnarly Troop Global Federation",
      ]
        .filter(Boolean)
        .join("\n"),
    });

    revalidatePath("/admin/registrations/");
    revalidatePath(`/admin/registrations/${id}/`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Rejection failed." };
  }
}
