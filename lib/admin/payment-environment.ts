import {
  phonePeEnvironmentLabel,
  type PhonePePaymentEnvironment,
} from "@/lib/payments/phonepe-env";

export const paymentEnvironmentFilterLabels: Record<string, string> = {
  all: "All payments",
  production: "Live only",
  sandbox: "UAT / Test only",
};

export function paymentEnvironmentBadgeLabel(
  env: PhonePePaymentEnvironment | string | null | undefined,
): string {
  return phonePeEnvironmentLabel(env);
}

export function paymentEnvironmentBadgeClass(
  env: PhonePePaymentEnvironment | string | null | undefined,
): string {
  if (env === "production") return "bg-teal-100 text-teal-900 ring-1 ring-teal-200";
  if (env === "sandbox") return "bg-violet-100 text-violet-900 ring-1 ring-violet-200";
  return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
}
