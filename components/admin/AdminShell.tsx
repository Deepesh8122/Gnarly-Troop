"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { label: "Dashboard", href: "/admin/", icon: "◉" },
  { label: "Pages", href: "/admin/pages/", icon: "▤" },
  { label: "4C Vision", href: "/admin/vision/", icon: "◎" },
  { label: "Team Members", href: "/admin/leadership/", icon: "👥" },
  { label: "Team Categories", href: "/admin/leadership/categories/", icon: "🏷" },
  { label: "Collaboration", href: "/admin/collaboration/", icon: "🤝" },
  { label: "Events", href: "/admin/events/", icon: "📅" },
  { label: "Registrations", href: "/admin/registrations/", icon: "🎫" },
  { label: "Gallery", href: "/admin/gallery/", icon: "🖼" },
  { label: "Media", href: "/admin/media/", icon: "📁" },
  { label: "Menus", href: "/admin/menus/", icon: "☰" },
  { label: "Brochure leads", href: "/admin/brochure-leads/", icon: "📄" },
  { label: "Donors", href: "/admin/donors/", icon: "♥" },
  { label: "Settings", href: "/admin/settings/", icon: "⚙" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const bare =
    pathname?.includes("/admin/login") || pathname?.includes("/admin/setup");

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login/");
    router.refresh();
  }

  if (bare) {
    return <div className="admin-root">{children}</div>;
  }

  function isActive(href: string) {
    if (href === "/admin/") return pathname === "/admin" || pathname === "/admin/";
    return pathname?.startsWith(href.replace(/\/$/, ""));
  }

  return (
    <div className="admin-root flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="border-b border-slate-200 px-5 py-5">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Gnarly Troop
          </p>
          <p className="text-lg font-semibold text-slate-900">Content Studio</p>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive(item.href)
                  ? "bg-teal-50 text-teal-800"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="text-base opacity-70" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <Link
            href="/"
            target="_blank"
            className="mb-2 block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            View website →
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">Content Management</h1>
          <button
            type="button"
            onClick={signOut}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Sign out
          </button>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
