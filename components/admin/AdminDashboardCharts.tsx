"use client";

import Link from "next/link";
import type { DashboardChartsData } from "@/lib/admin/dashboard-charts.types";
import { DASHBOARD_CHART_DAYS } from "@/lib/admin/dashboard-charts.types";

type Props = {
  data: DashboardChartsData | null;
};

const COLORS = {
  teal: "#0d9488",
  tealLight: "rgba(13, 148, 136, 0.15)",
  amber: "#f59e0b",
  amberLight: "rgba(245, 158, 11, 0.2)",
  blue: "#2563eb",
  blueLight: "rgba(37, 99, 235, 0.15)",
  violet: "#7c3aed",
  violetLight: "rgba(124, 58, 237, 0.15)",
};

function paymentKpiSub(totals: DashboardChartsData["totals"], periodLabel: string) {
  const parts = [periodLabel];
  if (totals.donationsPending > 0) {
    parts.push(`${totals.donationsPending} pending`);
  }
  if (totals.donationsFailed > 0) {
    parts.push(`${totals.donationsFailed} failed`);
  }
  return parts.join(" · ");
}

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function KpiCard({
  label,
  value,
  sub,
  href,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  href: string;
  accent: string;
}) {
  return (
    <Link href={href} className="admin-dash-kpi admin-card block p-5 transition hover:border-teal-500/40">
      <div className="admin-dash-kpi-accent" style={{ background: accent }} />
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{sub}</p>
    </Link>
  );
}

function BarChart({
  data,
  dataKey,
  color,
  fill,
  height = 200,
}: {
  data: DashboardChartsData["days"];
  dataKey: keyof DashboardChartsData["days"][number];
  color: string;
  fill: string;
  height?: number;
}) {
  const values = data.map((d) => Number(d[dataKey]) || 0);
  const max = Math.max(...values, 1);
  const width = 100;
  const barGap = width / data.length;
  const barWidth = Math.max(barGap * 0.55, 0.8);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="admin-dash-chart-svg"
      preserveAspectRatio="none"
      role="img"
      aria-hidden
    >
      {data.map((point, i) => {
        const val = Number(point[dataKey]) || 0;
        const barH = (val / max) * (height - 24);
        const x = i * barGap + (barGap - barWidth) / 2;
        const y = height - barH - 8;
        return (
          <g key={point.dateKey}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              rx={1.2}
              fill={val > 0 ? color : fill}
              opacity={val > 0 ? 1 : 0.35}
            />
          </g>
        );
      })}
      <line x1={0} y1={height - 8} x2={width} y2={height - 8} stroke="#e2e8f0" strokeWidth={0.5} />
    </svg>
  );
}

function AreaChart({
  data,
  dataKey,
  color,
  fill,
  height = 200,
}: {
  data: DashboardChartsData["days"];
  dataKey: keyof DashboardChartsData["days"][number];
  color: string;
  fill: string;
  height?: number;
}) {
  const values = data.map((d) => Number(d[dataKey]) || 0);
  const max = Math.max(...values, 1);
  const width = 100;
  const step = width / Math.max(data.length - 1, 1);
  const baseline = height - 8;

  const points = values.map((val, i) => {
    const x = i * step;
    const y = baseline - (val / max) * (height - 24);
    return `${x},${y}`;
  });

  const areaPath = `M0,${baseline} L${points.join(" L")} L${width},${baseline} Z`;
  const linePath = `M${points.join(" L")}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="admin-dash-chart-svg"
      preserveAspectRatio="none"
      role="img"
      aria-hidden
    >
      <path d={areaPath} fill={fill} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
      <line x1={0} y1={baseline} x2={width} y2={baseline} stroke="#e2e8f0" strokeWidth={0.5} />
    </svg>
  );
}

function DualChart({
  data,
  barKey,
  lineKey,
  barColor,
  barFill,
  lineColor,
  lineFill,
}: {
  data: DashboardChartsData["days"];
  barKey: keyof DashboardChartsData["days"][number];
  lineKey: keyof DashboardChartsData["days"][number];
  barColor: string;
  barFill: string;
  lineColor: string;
  lineFill: string;
}) {
  const height = 200;
  const barValues = data.map((d) => Number(d[barKey]) || 0);
  const lineValues = data.map((d) => Number(d[lineKey]) || 0);
  const maxBar = Math.max(...barValues, 1);
  const maxLine = Math.max(...lineValues, 1);
  const width = 100;
  const barGap = width / data.length;
  const barWidth = Math.max(barGap * 0.5, 0.7);
  const step = width / Math.max(data.length - 1, 1);
  const baseline = height - 8;

  const linePoints = lineValues.map((val, i) => {
    const x = i * step;
    const y = baseline - (val / maxLine) * (height - 24);
    return `${x},${y}`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="admin-dash-chart-svg"
      preserveAspectRatio="none"
      role="img"
      aria-hidden
    >
      {data.map((point, i) => {
        const val = barValues[i];
        const barH = (val / maxBar) * (height - 24);
        const x = i * barGap + (barGap - barWidth) / 2;
        const y = baseline - barH;
        return (
          <rect
            key={point.dateKey}
            x={x}
            y={y}
            width={barWidth}
            height={barH}
            rx={1}
            fill={val > 0 ? barFill : "rgba(226,232,240,0.5)"}
            stroke={barColor}
            strokeWidth={0.3}
          />
        );
      })}
      <path
        d={`M${linePoints.join(" L")}`}
        fill="none"
        stroke={lineColor}
        strokeWidth={1.4}
        vectorEffect="non-scaling-stroke"
      />
      {linePoints.map((pt, i) => {
        const [x, y] = pt.split(",").map(Number);
        return (
          <circle
            key={data[i].dateKey}
            cx={x}
            cy={y}
            r={1.2}
            fill={lineColor}
            opacity={lineValues[i] > 0 ? 1 : 0}
          />
        );
      })}
      <line x1={0} y1={baseline} x2={width} y2={baseline} stroke="#e2e8f0" strokeWidth={0.5} />
    </svg>
  );
}

function ChartCard({
  title,
  subtitle,
  href,
  legend,
  children,
}: {
  title: string;
  subtitle: string;
  href: string;
  legend: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-card admin-dash-chart-card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        </div>
        <Link href={href} className="admin-link text-xs">
          View all →
        </Link>
      </div>
      <div className="px-5 pt-4">{legend}</div>
      <div className="admin-dash-chart-wrap px-3 pb-4 pt-2">{children}</div>
    </section>
  );
}

function ChartAxisLabels({ data }: { data: DashboardChartsData["days"] }) {
  const ticks = [0, Math.floor(data.length / 2), data.length - 1];
  return (
    <div className="admin-dash-axis">
      {ticks.map((i) => (
        <span key={data[i].dateKey}>{data[i].label}</span>
      ))}
    </div>
  );
}

export default function AdminDashboardCharts({ data }: Props) {
  if (!data) {
    return (
      <section className="admin-card p-6 text-sm text-slate-500">
        Connect Supabase to see payment, registration, and brochure download charts.
      </section>
    );
  }

  const { days, totals } = data;
  const periodLabel = `Last ${DASHBOARD_CHART_DAYS} days`;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Summit registrations"
          value={String(totals.registrations)}
          sub={periodLabel}
          href="/admin/registrations/"
          accent={COLORS.teal}
        />
        <KpiCard
          label="Successful payments"
          value={String(totals.donations)}
          sub={paymentKpiSub(totals, periodLabel)}
          href="/admin/donors/"
          accent={COLORS.amber}
        />
        <KpiCard
          label="Donation revenue"
          value={formatInr(totals.donationAmountInr)}
          sub={`Completed payments only · ${periodLabel}`}
          href="/admin/donors/"
          accent={COLORS.blue}
        />
        <KpiCard
          label="Brochure downloads"
          value={String(totals.brochureDownloads)}
          sub={periodLabel}
          href="/admin/brochure-leads/"
          accent={COLORS.violet}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Payments & revenue"
          subtitle="Successful PhonePe donations per day"
          href="/admin/donors/"
          legend={
            <div className="admin-dash-legend">
              <span>
                <i style={{ background: COLORS.amberLight, borderColor: COLORS.amber }} />
                Payments
              </span>
              <span>
                <i style={{ background: COLORS.blue }} />
                Revenue (₹)
              </span>
            </div>
          }
        >
          <DualChart
            data={days}
            barKey="donations"
            lineKey="donationAmountInr"
            barColor={COLORS.amber}
            barFill={COLORS.amberLight}
            lineColor={COLORS.blue}
            lineFill={COLORS.blueLight}
          />
          <ChartAxisLabels data={days} />
        </ChartCard>

        <ChartCard
          title="Summit registrations"
          subtitle="New delegate sign-ups per day"
          href="/admin/registrations/"
          legend={
            <div className="admin-dash-legend">
              <span>
                <i style={{ background: COLORS.teal }} />
                Registrations
              </span>
            </div>
          }
        >
          <AreaChart
            data={days}
            dataKey="registrations"
            color={COLORS.teal}
            fill={COLORS.tealLight}
          />
          <ChartAxisLabels data={days} />
        </ChartCard>
      </div>

      <ChartCard
        title="Brochure downloads"
        subtitle="Lead form completions before PDF download"
        href="/admin/brochure-leads/"
        legend={
          <div className="admin-dash-legend">
            <span>
              <i style={{ background: COLORS.violet }} />
              Downloads
            </span>
          </div>
        }
      >
        <BarChart
          data={days}
          dataKey="brochureDownloads"
          color={COLORS.violet}
          fill={COLORS.violetLight}
          height={160}
        />
        <ChartAxisLabels data={days} />
      </ChartCard>

      <section className="admin-card p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Activity overview
        </h3>
        <div className="admin-dash-overview">
          {days.map((d) => {
            const max = Math.max(
              d.registrations,
              d.donations,
              d.brochureDownloads,
              1,
            );
            return (
              <div key={d.dateKey} className="admin-dash-overview-row" title={d.dateKey}>
                <span className="admin-dash-overview-label">{d.label}</span>
                <div className="admin-dash-overview-bars">
                  <span
                    className="admin-dash-overview-bar"
                    style={{
                      width: `${(d.registrations / max) * 100}%`,
                      background: COLORS.teal,
                    }}
                    title={`${d.registrations} registrations`}
                  />
                  <span
                    className="admin-dash-overview-bar"
                    style={{
                      width: `${(d.donations / max) * 100}%`,
                      background: COLORS.amber,
                    }}
                    title={`${d.donations} payments`}
                  />
                  <span
                    className="admin-dash-overview-bar"
                    style={{
                      width: `${(d.brochureDownloads / max) * 100}%`,
                      background: COLORS.violet,
                    }}
                    title={`${d.brochureDownloads} brochure downloads`}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="admin-dash-legend mt-4">
          <span>
            <i style={{ background: COLORS.teal }} />
            Registrations
          </span>
          <span>
            <i style={{ background: COLORS.amber }} />
            Payments
          </span>
          <span>
            <i style={{ background: COLORS.violet }} />
            Brochures
          </span>
        </div>
      </section>
    </div>
  );
}
