import Link from "next/link";
import { getAdminDashboardStats } from "@/lib/admin/data";
import { getAdminDashboardCharts } from "@/lib/admin/dashboard-charts";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminDashboardCharts from "@/components/admin/AdminDashboardCharts";
import MigrateStaticButton from "@/components/admin/MigrateStaticButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, charts] = await Promise.all([
    getAdminDashboardStats(),
    getAdminDashboardCharts(),
  ]);

  const cards = stats
    ? [
        { label: "Pages", value: stats.pages, href: "/admin/pages/" },
        { label: "Events", value: stats.events, href: "/admin/events/" },
        { label: "Registrations", value: stats.registrations, href: "/admin/registrations/" },
        { label: "Successful donations", value: stats.donations, href: "/admin/donors/" },
        { label: "Brochure leads", value: stats.brochureLeads, href: "/admin/brochure-leads/" },
        { label: "Team members", value: stats.team, href: "/admin/leadership/" },
        { label: "Partners", value: stats.partners, href: "/admin/collaboration/" },
        { label: "Galleries", value: stats.galleries, href: "/admin/gallery/" },
        { label: "Media files", value: stats.media, href: "/admin/media/" },
      ]
    : [
        { label: "Pages", value: "—", href: "/admin/pages/" },
        { label: "Events", value: "—", href: "/admin/events/" },
      ];

  return (
    <div className="space-y-8">
      <AdminNotConfigured />
      <MigrateStaticButton />
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="mt-1 text-slate-600">
          Payments, registrations, and brochure activity at a glance. Edit content in each
          module — changes appear on the public site within about a minute.
        </p>
      </div>

      <AdminDashboardCharts data={charts} />

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Content overview
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="admin-card p-5 transition hover:border-amber-500/40"
            >
              <p className="text-sm text-slate-600">{s.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{s.value}</p>
            </Link>
          ))}
        </div>
      </div>
      <section className="admin-card p-6">
        <h3 className="font-semibold text-slate-900">Quick links</h3>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/" className="admin-link" target="_blank">
            View website
          </Link>
          <Link href="/admin/menus/" className="admin-link">
            Header & footer menus
          </Link>
          <Link href="/leadership/" className="admin-link" target="_blank">
            Leadership page
          </Link>
          <Link href="/collaboration/" className="admin-link" target="_blank">
            Collaboration page
          </Link>
        </div>
      </section>
    </div>
  );
}
