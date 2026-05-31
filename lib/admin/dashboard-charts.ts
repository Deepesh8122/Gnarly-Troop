import type { SupabaseClient } from "@supabase/supabase-js";
import { adminDb } from "@/lib/admin/data";
import {
  dateKeyInTimezone,
  formatChartDayLabel,
  lastNDateKeys,
} from "@/lib/admin/chart-date";
import {
  DASHBOARD_CHART_DAYS,
  type DashboardChartsData,
  type DashboardDayPoint,
} from "@/lib/admin/dashboard-charts.types";

export { DASHBOARD_CHART_DAYS };
export type { DashboardChartsData, DashboardDayPoint };

const PAGE_SIZE = 1000;

async function fetchRowsSince<T extends { created_at: string }>(
  supabase: SupabaseClient,
  table: string,
  select: string,
  sinceIso: string,
): Promise<T[]> {
  const rows: T[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      console.error(`[dashboard-charts] ${table}`, error.message);
      break;
    }

    if (!data?.length) break;
    rows.push(...(data as unknown as T[]));
    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return rows;
}

async function fetchDonationRowsForCharts(
  supabase: SupabaseClient,
  sinceIso: string,
): Promise<DonationChartRow[]> {
  const rows: DonationChartRow[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("donations")
      .select("created_at, updated_at, amount_paise, status, phonepe_transaction_id")
      .or(`created_at.gte.${sinceIso},and(status.eq.success,updated_at.gte.${sinceIso})`)
      .order("created_at", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      console.error("[dashboard-charts] donations", error.message);
      break;
    }

    if (!data?.length) break;
    rows.push(...(data as unknown as DonationChartRow[]));
    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return rows;
}

function emptySeries(n: number): DashboardDayPoint[] {
  return lastNDateKeys(n).map((dateKey) => ({
    dateKey,
    label: formatChartDayLabel(dateKey),
    registrations: 0,
    donations: 0,
    donationAmountInr: 0,
    brochureDownloads: 0,
  }));
}

type DonationChartRow = {
  created_at: string;
  updated_at: string | null;
  amount_paise: number | null;
  status: string | null;
  phonepe_transaction_id: string | null;
};

export async function getAdminDashboardCharts(
  days = DASHBOARD_CHART_DAYS,
): Promise<DashboardChartsData | null> {
  const supabase = adminDb();
  if (!supabase) return null;

  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);
  const sinceIso = since.toISOString();
  const sinceMs = since.getTime();

  const [registrations, donations, brochureDownloads] = await Promise.all([
    fetchRowsSince<{ created_at: string }>(
      supabase,
      "event_registrations",
      "created_at",
      sinceIso,
    ),
    fetchDonationRowsForCharts(supabase, sinceIso),
    fetchRowsSince<{ created_at: string }>(
      supabase,
      "brochure_download_leads",
      "created_at",
      sinceIso,
    ),
  ]);

  const series = emptySeries(days);
  const byKey = new Map(series.map((point) => [point.dateKey, point]));

  for (const row of registrations) {
    const key = dateKeyInTimezone(row.created_at);
    const point = byKey.get(key);
    if (point) point.registrations += 1;
  }

  let donationsPending = 0;
  let donationsFailed = 0;

  for (const row of donations) {
    const status = row.status ?? "unknown";
    const createdMs = new Date(row.created_at).getTime();

    if (status === "success") {
      if (!row.phonepe_transaction_id) continue;
      const completedAt = row.updated_at ?? row.created_at;
      const key = dateKeyInTimezone(completedAt);
      const point = byKey.get(key);
      if (!point) continue;
      point.donations += 1;
      point.donationAmountInr += (row.amount_paise ?? 0) / 100;
      continue;
    }

    if (Number.isNaN(createdMs) || createdMs < sinceMs) continue;

    if (status === "failed") {
      donationsFailed += 1;
      continue;
    }

    if (status === "initiated" || status === "pending") {
      donationsPending += 1;
    }
  }

  for (const row of brochureDownloads) {
    const key = dateKeyInTimezone(row.created_at);
    const point = byKey.get(key);
    if (point) point.brochureDownloads += 1;
  }

  const totals = series.reduce(
    (acc, day) => ({
      registrations: acc.registrations + day.registrations,
      donations: acc.donations + day.donations,
      donationsPending: acc.donationsPending,
      donationsFailed: acc.donationsFailed,
      donationAmountInr: acc.donationAmountInr + day.donationAmountInr,
      brochureDownloads: acc.brochureDownloads + day.brochureDownloads,
    }),
    {
      registrations: 0,
      donations: 0,
      donationsPending,
      donationsFailed,
      donationAmountInr: 0,
      brochureDownloads: 0,
    },
  );

  return { days: series, totals };
}
