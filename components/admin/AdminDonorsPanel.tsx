"use client";

import { useMemo, useState } from "react";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import {
  paymentEnvironmentBadgeClass,
  paymentEnvironmentBadgeLabel,
  paymentEnvironmentFilterLabels,
} from "@/lib/admin/payment-environment";
import { donationStatusLabels, displayDonationStatus } from "@/lib/admin/donation-status";
import {
  phonePeEnvironmentDescription,
  phonePeEnvironmentLabel,
  type PhonePePaymentEnvironment,
} from "@/lib/payments/phonepe-env";
import type { DonationEnvironmentFilter } from "@/lib/services/donations";

export type DonorRow = {
  donor_key: string;
  donor_name: string | null;
  email: string | null;
  phone: string | null;
  donation_count: number | null;
  total_amount_paise: number | null;
  last_donation_at: string | null;
};

export type TransactionRow = {
  id: string;
  merchant_transaction_id: string;
  phonepe_transaction_id: string | null;
  donor_name: string | null;
  email: string | null;
  phone: string | null;
  amount_paise: number | null;
  payment_environment: PhonePePaymentEnvironment | null;
  status: string | null;
  created_at: string | null;
};

type Props = {
  donors: DonorRow[];
  transactions: TransactionRow[];
  serverPhonePeEnv: PhonePePaymentEnvironment;
  siteUrl: string;
  phonePeConfigured: boolean;
};

function formatInr(paise: number | null) {
  if (paise == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

const transactionColumns: AdminTableColumn[] = [
  { key: "donor_name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "payment_env_label", header: "Mode", format: "env-pill", statusKey: "payment_environment" },
  { key: "merchant_transaction_id", header: "Transaction ID", format: "mono" },
  { key: "phonepe_transaction_id", header: "PhonePe ID", format: "mono" },
  { key: "amount_paise", header: "Amount", format: "inr" },
  { key: "phone", header: "Phone", format: "mono" },
  { key: "created_at", header: "Date", format: "datetime" },
  { key: "status_label", header: "Status", format: "status-pill", statusKey: "status" },
];

const ENV_OPTIONS: DonationEnvironmentFilter[] = ["all", "production", "sandbox"];

export default function AdminDonorsPanel({
  donors: allDonors,
  transactions: allTransactions,
  serverPhonePeEnv,
  siteUrl,
  phonePeConfigured,
}: Props) {
  const [envFilter, setEnvFilter] = useState<DonationEnvironmentFilter>("all");

  const donors = useMemo(() => {
    if (envFilter === "all") return allDonors;
    return aggregateDonorsFromTransactions(allTransactions, envFilter);
  }, [allDonors, allTransactions, envFilter]);

  const transactionRows = useMemo(() => {
    const filtered =
      envFilter === "all"
        ? allTransactions
        : allTransactions.filter((txn) => txn.payment_environment === envFilter);

    return filtered.map((txn) => {
      const display = displayDonationStatus(txn.status, txn.phonepe_transaction_id);
      return {
        id: txn.id,
        donor_name: txn.donor_name ?? "—",
        email: txn.email ?? "—",
        payment_environment: txn.payment_environment ?? "",
        payment_env_label: paymentEnvironmentBadgeLabel(txn.payment_environment),
        merchant_transaction_id: txn.merchant_transaction_id,
        phonepe_transaction_id: txn.phonepe_transaction_id ?? "—",
        amount_paise: txn.amount_paise,
        phone: txn.phone ?? "—",
        created_at: txn.created_at,
        status: display.status,
        status_label: display.label,
      };
    });
  }, [allTransactions, envFilter]);

  return (
    <>
      <div className="admin-card border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">Payment environment filter</p>
            <p className="mt-1 text-xs text-slate-500">
              Show live vs UAT test donations. New payments are tagged from{" "}
              <code className="rounded bg-slate-100 px-1">PHONEPE_ENV</code> on the server.
            </p>
          </div>
          <div
            className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1"
            role="group"
            aria-label="Filter by payment environment"
          >
            {ENV_OPTIONS.map((option) => {
              const active = envFilter === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setEnvFilter(option)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? option === "production"
                        ? "bg-teal-700 text-white shadow-sm"
                        : option === "sandbox"
                          ? "bg-violet-700 text-white shadow-sm"
                          : "bg-slate-800 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  {paymentEnvironmentFilterLabels[option]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Donations</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Last gift</th>
            </tr>
          </thead>
          <tbody className="bg-white text-slate-800">
            {donors.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No donors for this filter.
                </td>
              </tr>
            ) : (
              donors.map((d, i) => (
                <tr
                  key={d.donor_key}
                  className="border-t border-slate-100"
                >
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{d.donor_name ?? "—"}</td>
                  <td className="px-4 py-3">{d.phone ?? "—"}</td>
                  <td className="px-4 py-3">{d.email ?? "—"}</td>
                  <td className="px-4 py-3">{d.donation_count ?? 0}</td>
                  <td className="px-4 py-3 font-semibold text-teal-800">
                    {formatInr(d.total_amount_paise)}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {d.last_donation_at
                      ? new Date(d.last_donation_at).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-card border-slate-200 bg-slate-50 p-6">
        <div className="mb-4 space-y-3">
          <h2 className="text-lg font-semibold">Recent donation transactions</h2>
          <p className="text-sm text-slate-600">
            Each row is tagged Live or UAT / Test based on{" "}
            <code className="rounded bg-white px-1 text-xs">PHONEPE_ENV</code> when the payment
            started. Use the toggle above to separate test from real donations.
          </p>
          {phonePeConfigured ? (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                serverPhonePeEnv === "production"
                  ? "border-teal-200 bg-teal-50 text-teal-950"
                  : "border-violet-200 bg-violet-50 text-violet-950"
              }`}
            >
              <p>
                <strong>Server PhonePe mode (PHONEPE_ENV):</strong>{" "}
                {phonePeEnvironmentLabel(serverPhonePeEnv)}
              </p>
              <p className="mt-1 text-xs opacity-90">{phonePeEnvironmentDescription(serverPhonePeEnv)}</p>
              <p className="mt-2">
                Return URL:{" "}
                <code className="text-xs">{siteUrl}/collaboration/donation/status/</code>
              </p>
            </div>
          ) : (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              PhonePe is not configured. Set PHONEPE_ENV and credentials in the server environment.
            </p>
          )}
        </div>

        <AdminDataTable
          rows={transactionRows}
          columns={transactionColumns}
          emptyMessage="No donation transactions for this filter"
          searchPlaceholder="Search name, email, phone, transaction ID…"
          searchKeys={[
            "donor_name",
            "email",
            "phone",
            "merchant_transaction_id",
            "phonepe_transaction_id",
            "payment_env_label",
          ]}
          statusFilterKey="status"
          statusFilterLabel="Transaction type"
          statusFilterLabels={donationStatusLabels}
          defaultStatusFilter="success"
          dateFilterKey="created_at"
          showRowNumbers
          defaultPageSize={25}
        />
      </div>
    </>
  );
}

function aggregateDonorsFromTransactions(
  transactions: TransactionRow[],
  env: PhonePePaymentEnvironment,
): DonorRow[] {
  const map = new Map<string, DonorRow>();

  for (const txn of transactions) {
    if (txn.payment_environment !== env) continue;
    if (txn.status !== "success" || !txn.phonepe_transaction_id) continue;

    const key = `${String(txn.email ?? "").toLowerCase()}|${txn.phone ?? ""}`;
    const amount = txn.amount_paise ?? 0;
    const existing = map.get(key);

    if (!existing) {
      map.set(key, {
        donor_key: key,
        donor_name: txn.donor_name,
        email: txn.email,
        phone: txn.phone,
        donation_count: 1,
        total_amount_paise: amount,
        last_donation_at: txn.created_at,
      });
      continue;
    }

    existing.donation_count = (existing.donation_count ?? 0) + 1;
    existing.total_amount_paise = (existing.total_amount_paise ?? 0) + amount;
    if (
      txn.created_at &&
      (!existing.last_donation_at || new Date(txn.created_at) > new Date(existing.last_donation_at))
    ) {
      existing.last_donation_at = txn.created_at;
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => (b.total_amount_paise ?? 0) - (a.total_amount_paise ?? 0),
  );
}
