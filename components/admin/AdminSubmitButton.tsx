"use client";

import { useFormStatus } from "react-dom";

type Props = {
  label?: string;
  pendingLabel?: string;
};

export default function AdminSubmitButton({
  label = "Save changes",
  pendingLabel = "Saving…",
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="admin-btn-primary disabled:opacity-60">
      {pending ? pendingLabel : label}
    </button>
  );
}
