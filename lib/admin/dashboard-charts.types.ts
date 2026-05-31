export const DASHBOARD_CHART_DAYS = 30;

export type DashboardDayPoint = {
  dateKey: string;
  label: string;
  registrations: number;
  donations: number;
  donationAmountInr: number;
  brochureDownloads: number;
};

export type DashboardChartsData = {
  days: DashboardDayPoint[];
  totals: {
    registrations: number;
    donations: number;
    donationsPending: number;
    donationsFailed: number;
    donationAmountInr: number;
    brochureDownloads: number;
  };
};
