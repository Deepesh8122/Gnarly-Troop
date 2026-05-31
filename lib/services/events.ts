import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import type { RegistrationEvent } from "@/lib/registration/constants";

export type { RegistrationEvent, EligibilityValue } from "@/lib/registration/constants";
export {
  REGISTRATION_ELIGIBILITY_OPTIONS,
  eligibilityLabel,
} from "@/lib/registration/constants";

export async function getOpenRegistrationEvent(): Promise<RegistrationEvent | null> {
  if (!getSupabaseEnv().configured) return null;
  const supabase = await createServerSupabaseClient();

  const { data: featured } = await supabase
    .from("events")
    .select(
      "id, slug, title, subtitle, description, location, starts_at, ends_at, max_registrations, registration_enabled",
    )
    .eq("status", "published")
    .eq("registration_enabled", true)
    .eq("slug", "global-leadership-summit-2026")
    .maybeSingle();

  if (featured) return featured as RegistrationEvent;

  const { data: fallback } = await supabase
    .from("events")
    .select(
      "id, slug, title, subtitle, description, location, starts_at, ends_at, max_registrations, registration_enabled",
    )
    .eq("status", "published")
    .eq("registration_enabled", true)
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (fallback as RegistrationEvent | null) ?? null;
}

export async function countEventRegistrations(eventId: string): Promise<number> {
  const supabase = createServiceRoleClient();
  const { count } = await supabase
    .from("event_registrations")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId)
    .neq("status", "cancelled");
  return count ?? 0;
}
