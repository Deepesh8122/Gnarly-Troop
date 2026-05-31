"use client";

import { AdminCheckbox, AdminInput, AdminTextarea } from "@/components/admin/AdminForm";

type Props = {
  settingKey: string;
  value: unknown;
};

export default function AdminSiteSettingField({ settingKey, value }: Props) {
  if (settingKey === "brochure_gate_enabled") {
    const checked = value === true || value === "true";
    return (
      <AdminCheckbox name="value_text" label="Require lead form before brochure download" defaultChecked={checked} />
    );
  }

  if (typeof value === "string" || value === null || value === undefined) {
    const text = typeof value === "string" ? value : String(value ?? "").replace(/^"|"$/g, "");
    return (
      <AdminInput
        label="Value"
        name="value_text"
        defaultValue={text}
        className="w-full"
      />
    );
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return (
      <AdminInput
        label="Value"
        name="value_text"
        defaultValue={String(value)}
      />
    );
  }

  return (
    <AdminTextarea
      label="Value"
      name="value_text"
      defaultValue={String(value)}
      rows={2}
      className="font-sans text-sm"
    />
  );
}
