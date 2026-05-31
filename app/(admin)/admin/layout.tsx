import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isAdminDeployEnabled } from "@/lib/deploy-security";
import AdminShell from "@/components/admin/AdminShell";
import "./admin.css";

export const metadata = {
  title: "Admin — Gnarly Troop CMS",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  if (!isAdminDeployEnabled()) {
    notFound();
  }

  return <AdminShell>{children}</AdminShell>;
}
