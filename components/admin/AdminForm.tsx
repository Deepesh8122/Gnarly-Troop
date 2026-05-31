import type { ReactNode } from "react";
import type { ActionResult } from "@/lib/admin/actions";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";

const inputClass = "admin-input";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

export function AdminField({
  label,
  name,
  children,
  hint,
}: {
  label: string;
  name?: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function AdminInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string },
) {
  const { label, className, ...rest } = props;
  const el = <input className={`${inputClass} ${className ?? ""}`} {...rest} />;
  if (!label) return el;
  return (
    <AdminField label={label} name={rest.name}>
      {el}
    </AdminField>
  );
}

export function AdminTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string },
) {
  const { label, className, ...rest } = props;
  const el = (
    <textarea
      className={`${inputClass} min-h-[120px] font-mono text-xs ${className ?? ""}`}
      {...rest}
    />
  );
  if (!label) return el;
  return (
    <AdminField label={label} name={rest.name}>
      {el}
    </AdminField>
  );
}

export function AdminSelect(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    options: { value: string; label: string }[];
  },
) {
  const { label, options, className, ...rest } = props;
  return (
    <AdminField label={label} name={rest.name}>
      <select className={`${inputClass} ${className ?? ""}`} {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </AdminField>
  );
}

export function AdminCheckbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="rounded border-slate-300 text-teal-600"
      />
      {label}
    </label>
  );
}

export function AdminForm({
  action,
  children,
  className,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (formData: FormData) => void | Promise<void> | Promise<ActionResult> | any;
  children: ReactNode;
  className?: string;
}) {
  return (
    <form action={action} className={`space-y-5 ${className ?? ""}`}>
      {children}
    </form>
  );
}

export function AdminSubmit({ label = "Save changes" }: { label?: string }) {
  // Re-exported from client component for forms using server actions
  return <AdminSubmitButton label={label} />;
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export { inputClass, labelClass };
