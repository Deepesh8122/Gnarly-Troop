import { adminDb } from "@/lib/admin/data";
import {
  DASHBOARD_CHART_DAYS,
  type DashboardChartsData,
  type DashboardDayPoint,
} from "@/lib/admin/dashboard-charts.types";

export { DASHBOARD_CHART_DAYS };
export type { DashboardChartsData, DashboardDayPoint };

function lastNDayKeys(n: number): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    keys.push(d.toISOString().slice(0, 10));
  }
  return keys;
}

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

function formatDayLabel(dateKey: string) {
  const d = new Date(`${dateKey}T12:00:00`);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function emptySeries(n: number): DashboardDayPoint[] {
  return lastNDayKeys(n).map((dateKey) => ({
    dateKey,
    label: formatDayLabel(dateKey),
    registrations: 0,
    donations: 0,
    donationAmountInr: 0,
    brochureDownloads: 0,
  }));
}

export async function getAdminDashboardCharts(
  days = DASHBOARD_CHART_DAYS,
): Promise<DashboardChartsData | null> {
  const supabase = adminDb();
  if (!supabase) return null;

  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);
  const sinceIso = since.toISOString();

  const [registrationsRes, donationsRes, brochureRes] = await Promise.all([
    supabase
      .from("event_registrations")
      .select("created_at")
      .gte("created_at", sinceIso),
    supabase
      .from("donations")
      .select("created_at, amount_paise, status")
      .gte("created_at", sinceIso),
    supabase
      .from("brochure_download_leads")
      .select("created_at")
      .gte("created_at", sinceIso),
  ]);

  const series = emptySeries(days);
  const byKey = new Map(series.map((d) => [d.dateKey, d]));

  for (const row of registrationsRes.data ?? []) {
    const key = dayKey(row.created_at);
    const point = byKey.get(key);
    if (point) point.registrations += 1;
  }

  for (const row of donationsRes.data ?? []) {
    if (row.status !== "success") continue;
    const key = dayKey(row.created_at);
    const point = byKey.get(key);
    if (!point) continue;
    point.donations += 1;
    point.donationAmountInr += (row.amount_paise ?? 0) / 100;
  }

  for (const row of brochureRes.data ?? []) {
    const key = dayKey(row.created_at);
    const point = byKey.get(key);
    if (point) point.brochureDownloads += 1;
  }

  const totals = series.reduce(
    (acc, d) => ({
      registrations: acc.registrations + d.registrations,
      donations: acc.donations + d.donations,
      donationAmountInr: acc.donationAmountInr + d.donationAmountInr,
      brochureDownloads: acc.brochureDownloads + d.brochureDownloads,
    }),
    {
      registrations: 0,
      donations: 0,
      donationAmountInr: 0,
      brochureDownloads: 0,
    },
  );

  return { days: series, totals };
}
