"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { seedHomepageSectionsAction } from "@/lib/admin/actions";

export default function SeedHomepageSectionsButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function run() {
    if (
      !confirm(
        "Fill empty homepage sections with default content (hero, welcome, minister cards)? Existing section JSON will not be overwritten.",
      )
    ) {
      return;
    }
    startTransition(async () => {
      setMessage(null);
      const result = await seedHomepageSectionsAction();
      if (result.ok) {
        setMessage(result.error ?? "Homepage section defaults saved.");
        router.refresh();
      } else {
        setMessage(result.error ?? "Failed");
      }
    });
  }

  return (
    <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
      <p className="text-sm font-medium text-sky-900">Homepage section defaults</p>
      <p className="mt-1 text-xs text-sky-800">
        If section editors are empty, this copies the live site defaults into{" "}
        <code className="text-sky-900">page_sections.content</code> for the homepage.
      </p>
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className="mt-3 rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Saving…" : "Seed homepage section content"}
      </button>
      {message && <p className="mt-2 text-sm text-slate-700">{message}</p>}
    </div>
  );
}
