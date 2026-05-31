"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import AdminTableRowDelete from "@/components/admin/AdminTableRowDelete";
import { donationStatusClass } from "@/lib/admin/donation-status";
import { paymentEnvironmentBadgeClass } from "@/lib/admin/payment-environment";

export type AdminTableColumn = {
  key: string;
  header: string;
  sortable?: boolean;
  /** text | link | badge-live | badge | status-pill | env-pill | date | datetime | inr | mono | thumb */
  format?: "text" | "link" | "badge-live" | "badge" | "status-pill" | "env-pill" | "date" | "datetime" | "inr" | "mono" | "thumb";
  /** Raw status key used for status-pill colors (defaults to "status"). */
  statusKey?: string;
  /** For link format: `/admin/leadership/{id}/` */
  linkPattern?: string;
  /** Column key used as link label (defaults to column key) */
  linkLabelKey?: string;
};

export type AdminTableRow = Record<string, string | number | boolean | null | undefined>;

type Props = {
  rows: AdminTableRow[];
  columns: AdminTableColumn[];
  emptyMessage: string;
  searchPlaceholder?: string;
  /** Keys to include in global search */
  searchKeys?: string[];
  statusFilterKey?: string;
  /** Initial status filter value (e.g. "success" to hide pending/failed by default). */
  defaultStatusFilter?: string;
  /** Human-readable labels for status filter dropdown values. */
  statusFilterLabels?: Record<string, string>;
  /** Label for the status filter control (defaults to "Status"). */
  statusFilterLabel?: string;
  dateFilterKey?: string;
  /** Prepend a row number column (#). */
  showRowNumbers?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  /** Server action for row delete — FormData must include `id` */
  deleteAction?: (formData: FormData) => void | Promise<void>;
  deleteEntityLabel?: string;
  /** Custom actions per row (client-only render prop alternative via serializable slot) */
  renderActions?: (row: AdminTableRow) => ReactNode;
};

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

function formatDate(value: unknown) {
  if (!value) return "—";
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(value: unknown) {
  if (!value) return "—";
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatInrPaise(value: unknown) {
  const paise = Number(value);
  if (!Number.isFinite(paise)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

function renderCell(row: AdminTableRow, col: AdminTableColumn) {
  const value = row[col.key];

  if (col.format === "thumb") {
    const src = String(row.thumbUrl ?? value ?? "");
    if (!src) return <span className="text-slate-400">—</span>;
    return (
      <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  if (col.format === "link" && col.linkPattern) {
    let href = col.linkPattern;
    for (const [k, val] of Object.entries(row)) {
      href = href.replace(`{${k}}`, String(val ?? ""));
    }
    const label = String(row[col.linkLabelKey ?? col.key] ?? "View");
    return (
      <Link href={href} className="admin-link font-medium">
        {label}
      </Link>
    );
  }

  if (col.format === "badge-live") {
    return value ? (
      <span className="admin-badge admin-badge--live">Yes</span>
    ) : (
      <span className="admin-badge">No</span>
    );
  }

  if (col.format === "badge") {
    return <span className="admin-badge">{String(value ?? "—")}</span>;
  }

  if (col.format === "status-pill") {
    const rawStatus = String(row[col.statusKey ?? "status"] ?? "");
    return (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${donationStatusClass(rawStatus)}`}
      >
        {String(value ?? "—")}
      </span>
    );
  }

  if (col.format === "env-pill") {
    const rawEnv = String(row[col.statusKey ?? "payment_environment"] ?? "");
    return (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${paymentEnvironmentBadgeClass(rawEnv)}`}
      >
        {String(value ?? "—")}
      </span>
    );
  }

  if (col.format === "date") {
    return formatDate(value);
  }

  if (col.format === "datetime") {
    return formatDateTime(value);
  }

  if (col.format === "inr") {
    return <span className="font-semibold text-teal-800">{formatInrPaise(value)}</span>;
  }

  if (col.format === "mono") {
    return <span className="font-mono text-xs text-slate-600">{String(value ?? "—")}</span>;
  }

  return String(value ?? "—");
}

export default function AdminDataTable({
  rows,
  columns,
  emptyMessage,
  searchPlaceholder = "Search all columns…",
  searchKeys,
  statusFilterKey,
  defaultStatusFilter = "",
  statusFilterLabels,
  statusFilterLabel = "Status",
  dateFilterKey,
  showRowNumbers = false,
  defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  deleteAction,
  deleteEntityLabel = "this record",
  renderActions,
}: Props) {
  const [search, setSearch] = useState("");
  const [columnFilter, setColumnFilter] = useState("");
  const [filterColumn, setFilterColumn] = useState("");
  const [statusFilter, setStatusFilter] = useState(defaultStatusFilter);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const keysForSearch = searchKeys ?? columns.map((c) => c.key).filter((k) => k !== "thumbUrl");

  const filtered = useMemo(() => {
    let result = [...rows];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        keysForSearch.some((key) => String(row[key] ?? "").toLowerCase().includes(q)),
      );
    }

    if (filterColumn && columnFilter.trim()) {
      const q = columnFilter.toLowerCase();
      result = result.filter((row) =>
        String(row[filterColumn] ?? "")
          .toLowerCase()
          .includes(q),
      );
    }

    if (statusFilterKey && statusFilter) {
      result = result.filter((row) => String(row[statusFilterKey] ?? "") === statusFilter);
    }

    if (dateFilterKey && (dateFrom || dateTo)) {
      result = result.filter((row) => {
        const raw = row[dateFilterKey];
        if (!raw) return false;
        const t = new Date(String(raw)).getTime();
        if (Number.isNaN(t)) return false;
        if (dateFrom && t < new Date(dateFrom).getTime()) return false;
        if (dateTo && t > new Date(`${dateTo}T23:59:59`).getTime()) return false;
        return true;
      });
    }

    if (sortKey) {
      result.sort((a, b) => {
        const cmp = compareValues(a[sortKey], b[sortKey]);
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [
    rows,
    search,
    filterColumn,
    columnFilter,
    statusFilterKey,
    statusFilter,
    dateFilterKey,
    dateFrom,
    dateTo,
    sortKey,
    sortDir,
    keysForSearch,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const pageRows = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const statusOptions = useMemo(() => {
    if (!statusFilterKey) return [];
    const set = new Set<string>();
    rows.forEach((r) => {
      const v = r[statusFilterKey];
      if (v != null && String(v)) set.add(String(v));
    });
    return Array.from(set).sort();
  }, [rows, statusFilterKey]);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filterableColumns = columns.filter((c) => c.format !== "thumb");
  const showActions = Boolean(deleteAction || renderActions);
  const displayColumns = showRowNumbers
    ? [{ key: "_rowNum", header: "#", sortable: false as const }, ...columns]
    : columns;
  const allColumns = showActions
    ? [...displayColumns, { key: "_actions", header: "Actions", sortable: false as const }]
    : displayColumns;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-600">Global search</label>
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder={searchPlaceholder}
            className="admin-input"
          />
        </div>

        <div className="min-w-[140px]">
          <label className="mb-1 block text-xs font-medium text-slate-600">Filter column</label>
          <select
            value={filterColumn}
            onChange={(e) => {
              setFilterColumn(e.target.value);
              setPage(0);
            }}
            className="admin-input"
          >
            <option value="">All columns</option>
            {filterableColumns.map((c) => (
              <option key={c.key} value={c.key}>
                {c.header}
              </option>
            ))}
          </select>
        </div>

        {filterColumn && (
          <div className="min-w-[160px]">
            <label className="mb-1 block text-xs font-medium text-slate-600">Column search</label>
            <input
              type="search"
              value={columnFilter}
              onChange={(e) => {
                setColumnFilter(e.target.value);
                setPage(0);
              }}
              placeholder={`Search ${filterColumn}…`}
              className="admin-input"
            />
          </div>
        )}

        {statusFilterKey && statusOptions.length > 0 && (
          <div className="min-w-[140px]">
            <label className="mb-1 block text-xs font-medium text-slate-600">{statusFilterLabel}</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="admin-input"
            >
              <option value="">All</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {statusFilterLabels?.[s] ?? s}
                </option>
              ))}
            </select>
          </div>
        )}

        {dateFilterKey && (
          <>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(0);
                }}
                className="admin-input"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(0);
                }}
                className="admin-input"
              />
            </div>
          </>
        )}
      </div>

      <div className="admin-table-wrap overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
            {displayColumns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-semibold">
                {c.sortable !== false && c.format !== "thumb" && c.key !== "_rowNum" ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(c.key)}
                    className="inline-flex items-center gap-1 hover:text-slate-900"
                  >
                    {c.header}
                    {sortKey === c.key && (
                      <span aria-hidden>{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </button>
                ) : (
                  c.header
                )}
              </th>
            ))}
            {showActions && (
              <th className="px-4 py-3 font-semibold">Actions</th>
            )}
            </tr>
          </thead>
          <tbody className="bg-white">
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={allColumns.length} className="px-4 py-12 text-center">
                  <div className="mx-auto max-w-sm">
                    <p className="text-4xl opacity-30" aria-hidden>
                      📋
                    </p>
                    <p className="mt-2 font-medium text-slate-700">
                      {rows.length === 0 ? emptyMessage : "No results match your filters"}
                    </p>
                    {rows.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setColumnFilter("");
                          setFilterColumn("");
                          setStatusFilter(defaultStatusFilter);
                          setDateFrom("");
                          setDateTo("");
                          setPage(0);
                        }}
                        className="admin-link mt-2 text-sm"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((row, rowIndex) => (
                <tr
                  key={String(row.id)}
                  className="border-t border-slate-100 text-slate-800 hover:bg-slate-50/50"
                >
                  {displayColumns.map((c) => (
                    <td key={c.key} className="px-4 py-3">
                      {c.key === "_rowNum"
                        ? safePage * pageSize + rowIndex + 1
                        : renderCell(row, c)}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {renderActions?.(row)}
                        {deleteAction && (
                          <AdminTableRowDelete
                            id={String(row.id)}
                            deleteAction={deleteAction}
                            entityLabel={
                              String(row.full_name ?? row.name ?? row.title ?? row.file_name ?? deleteEntityLabel)
                            }
                          />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <p>
            Showing {safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, filtered.length)}{" "}
            of {filtered.length}
            {filtered.length !== rows.length && ` (filtered from ${rows.length})`}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2">
              <span className="text-xs">Per page</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(0);
                }}
                className="admin-input w-auto py-1"
              >
                {pageSizeOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={safePage <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="admin-btn-secondary px-2 py-1 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="flex items-center px-2">
                {safePage + 1} / {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                className="admin-btn-secondary px-2 py-1 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
