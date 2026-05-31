"use client";

import { useTransition } from "react";
import { importTeamPortalAction } from "@/lib/admin/actions";

export default function ImportTeamPortalButton() {
  const [pending, startTransition] = useTransition();

  function runImport() {
    if (
      !confirm(
        "Import GTGF Portal categories and team members? Existing members with matching slugs will be updated.",
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await importTeamPortalAction();
      if (result.ok) {
        alert("GTGF Portal content imported successfully.");
        window.location.reload();
      } else {
        alert(result.error ?? "Import failed");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={runImport}
      disabled={pending}
      className="admin-btn-secondary disabled:opacity-50"
    >
      {pending ? "Importing…" : "Import GTGF Portal document"}
    </button>
  );
}
