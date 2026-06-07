"use client";

import { useState, useMemo } from "react";
import type { Client } from "./data";

// Colors mirror bolsa.me/bitso's status-chip tones.
function statusChipClasses(label: string): string {
  switch (label) {
    case "OVERDUE":
      return "bg-red-100 text-red-700";
    case "DUE SOON":
      return "bg-amber-100 text-amber-700";
    case "ON TRACK":
      return "bg-emerald-100 text-emerald-700";
    case "PENDING":
      return "bg-blue-100 text-blue-700";
    case "BOX DOWN":
      return "bg-slate-200 text-slate-600";
    default:
      return "bg-slate-100 text-slate-500";
  }
}

type SortKey =
  | "agent"
  | "port"
  | "born"
  | "days"
  | "phone"
  | "sim"
  | "payDate"
  | "payAmount"
  | "payStatus";
type SortDir = "asc" | "desc" | null;

// Status sort follows urgency, not the alphabet: most urgent first when asc.
const STATUS_RANK: Record<string, number> = {
  OVERDUE: 0,
  "DUE SOON": 1,
  PENDING: 2,
  "BOX DOWN": 3,
  "ON TRACK": 4,
};

// Returns a comparable value for a column, or null for "empty" cells which
// always sink to the bottom regardless of sort direction.
function sortValue(c: Client, key: SortKey): string | number | null {
  switch (key) {
    case "agent":
      return c.agent.toLowerCase();
    case "port":
      return c.port ?? null;
    case "born":
      // ISO date strings sort lexically the same as chronologically.
      return c.born ?? null;
    case "days":
      return c.days ?? null;
    case "phone":
      return c.phone?.toLowerCase() ?? null;
    case "sim":
      return c.sim?.toLowerCase() ?? null;
    case "payDate": {
      if (!c.payDate) return null;
      const t = Date.parse(c.payDate);
      // Non-date phrases ("Pendiente", "Cobrar ahora") sink to the bottom.
      return Number.isFinite(t) ? t : null;
    }
    case "payAmount": {
      if (!c.payAmount) return null;
      const n = parseFloat(c.payAmount.replace(/[^0-9.]/g, ""));
      return Number.isFinite(n) ? n : null;
    }
    case "payStatus":
      if (!c.payStatus) return null;
      return STATUS_RANK[c.payStatus] ?? 99;
  }
}

function SortIcon({ direction }: { direction: SortDir }) {
  if (direction === null) {
    return (
      <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }
  if (direction === "asc") {
    return (
      <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function ClientsTable({ clients }: { clients: Client[] }) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDir === "asc") {
        setSortDir("desc");
      } else if (sortDir === "desc") {
        setSortKey(null);
        setSortDir(null);
      }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return clients;

    const dir = sortDir === "asc" ? 1 : -1;
    return [...clients].sort((a, b) => {
      const aVal = sortValue(a, sortKey);
      const bVal = sortValue(b, sortKey);

      // Empty cells always sink to the bottom, regardless of direction.
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;

      if (aVal < bVal) return -1 * dir;
      if (aVal > bVal) return 1 * dir;
      return 0;
    });
  }, [clients, sortKey, sortDir]);

  const getSortDir = (key: SortKey): SortDir => {
    if (sortKey !== key) return null;
    return sortDir;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">All Clients</h2>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
          {clients.length} clients
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th
                className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none"
                onClick={() => handleSort("agent")}
              >
                <div className="flex items-center gap-1.5">
                  Agent
                  <SortIcon direction={getSortDir("agent")} />
                </div>
              </th>
              <th
                className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none"
                onClick={() => handleSort("port")}
              >
                <div className="flex items-center gap-1.5">
                  Port
                  <SortIcon direction={getSortDir("port")} />
                </div>
              </th>
              <th
                className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none"
                onClick={() => handleSort("born")}
              >
                <div className="flex items-center gap-1.5">
                  Born
                  <SortIcon direction={getSortDir("born")} />
                </div>
              </th>
              <th
                className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none"
                onClick={() => handleSort("days")}
              >
                <div className="flex items-center gap-1.5">
                  Days
                  <SortIcon direction={getSortDir("days")} />
                </div>
              </th>
              <th
                className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none"
                onClick={() => handleSort("phone")}
              >
                <div className="flex items-center gap-1.5">
                  Phone
                  <SortIcon direction={getSortDir("phone")} />
                </div>
              </th>
              <th
                className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none"
                onClick={() => handleSort("sim")}
              >
                <div className="flex items-center gap-1.5">
                  SIM
                  <SortIcon direction={getSortDir("sim")} />
                </div>
              </th>
              <th
                className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none"
                onClick={() => handleSort("payDate")}
              >
                <div className="flex items-center gap-1.5">
                  Fecha de Pago
                  <SortIcon direction={getSortDir("payDate")} />
                </div>
              </th>
              <th
                className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none"
                onClick={() => handleSort("payAmount")}
              >
                <div className="flex items-center gap-1.5">
                  Monto de Pago
                  <SortIcon direction={getSortDir("payAmount")} />
                </div>
              </th>
              <th
                className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none"
                onClick={() => handleSort("payStatus")}
              >
                <div className="flex items-center gap-1.5">
                  Status
                  <SortIcon direction={getSortDir("payStatus")} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.map((client, i) => (
              <tr key={i} className="hover:bg-slate-50/70 transition-colors duration-100">
                <td className="px-6 py-3.5 font-medium text-slate-800">{client.agent}</td>
                <td className="px-6 py-3.5">
                  {client.port ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      {client.port}
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
                <td className="px-6 py-3.5">
                  {client.born ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      {client.born}
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
                <td className="px-6 py-3.5">
                  {client.days !== undefined ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-700">
                      {client.days}
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
                <td className="px-6 py-3.5 text-slate-600 font-mono text-xs">
                  {client.phone || <span className="text-slate-300">—</span>}
                </td>
                <td className="px-6 py-3.5">
                  {client.sim ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                      {client.sim}
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
                <td className="px-6 py-3.5">
                  {client.payDate ? (
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        /^\d{4}-\d{2}-\d{2}$/.test(client.payDate)
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {client.payDate}
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
                <td className="px-6 py-3.5">
                  {client.payAmount ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      {client.payAmount}
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
                <td className="px-6 py-3.5">
                  {client.payStatus ? (
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${statusChipClasses(
                        client.payStatus,
                      )}`}
                    >
                      {client.payStatus}
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
