import type { ReactNode } from "react";
import { isAdminDeployEnabled } from "@/lib/deploy-security";
import AdminShell from "@/components/admin/AdminShell";
import AdminDisabled from "@/components/admin/AdminDisabled";
import "./admin.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Gnarly Troop CMS",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  if (!isAdminDeployEnabled()) {
    return <AdminDisabled />;
  }

  return <AdminShell>{children}</AdminShell>;
}
