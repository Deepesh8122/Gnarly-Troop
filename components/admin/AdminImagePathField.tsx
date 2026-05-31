"use client";

import AdminImageUploadField from "@/components/admin/AdminImageUploadField";

type Props = {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  bucket?: string;
  accept?: string;
};

/** Upload-first image/video field — stores public URL in a single form field. */
export default function AdminImagePathField({
  name,
  label,
  defaultValue = "",
  hint,
  bucket = "banners",
  accept = "image/*,video/*",
}: Props) {
  return (
    <AdminImageUploadField
      name={name}
      label={label}
      defaultValue={defaultValue}
      hint={hint}
      bucket={bucket}
      accept={accept}
    />
  );
}
