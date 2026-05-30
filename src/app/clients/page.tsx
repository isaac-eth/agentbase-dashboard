"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";

type Client = {
  customer: string;
  agent: string;
  model: string;
  status: string;
  port?: number;
  phone?: string;
  sim?: string;
  born?: string;
  days?: number;
  notes?: string;
};

const clients: Client[] = [
  { customer: "EchoPrime", agent: "Echo", model: "unknown", status: "ok", port: 2235, phone: "+52 444 289 3990", born: "2026-02-14", days: 72, notes: "EchoPrime / mothership" },
  { customer: "Navi", agent: "Navi", model: "old proxy", status: "ok", port: 2221, phone: "+52 444 289 3990", born: "2026-02-14", days: 72 },
  { customer: "Vera", agent: "Vera", model: "unknown", status: "down", port: 2227, born: "2026-02-18", days: 68 },
  { customer: "Cherry", agent: "Cherry", model: "unknown", status: "down", port: 2226, born: "2026-02-19", days: 67 },
  { customer: "Doc", agent: "Doc", model: "old proxy", status: "ok", port: 2222, phone: "+52 444 315 7963", born: "2026-02-20", days: 66 },
  { customer: "Borz", agent: "Borz", model: "old proxy", status: "ok", port: 2223, phone: "+52 444 315 7963", born: "2026-02-21", days: 65 },
  { customer: "Ed", agent: "Ed", model: "old proxy", status: "ok", port: 2220, phone: "+52 444 575 3406", sim: "119319", born: "2026-02-23", days: 63 },
  { customer: "Manolo", agent: "Manolo", model: "old proxy", status: "ok", port: 2225, phone: "+52 444 431 0958", sim: "31707", born: "2026-02-25", days: 61 },
  { customer: "Lili", agent: "Lili", model: "to check", status: "ok", port: 2228, phone: "+52 485 104 4333", sim: "82665", born: "2026-03-02", days: 56 },
  { customer: "Nikola", agent: "Nikola", model: "Cortex", status: "ok", port: 2229, phone: "+52 444 174 2127", sim: "476431", born: "2026-03-03", days: 55 },
  { customer: "Atena", agent: "Atena", model: "old proxy", status: "ok", port: 2233, phone: "+52 444 121 6753", sim: "614840", born: "2026-03-18", days: 40, notes: "⚠️ fleet.md 'Key Agent IDs' lists this id as Lic — Mongo says Atena. Worth reconciling." },
  { customer: "Lic", agent: "Lic", model: "old proxy", status: "ok", port: 2231, phone: "+52 444 121 6753", sim: "4321F", born: "2026-03-25", days: 33, notes: "Real Lic doc, not in fleet.md key table" },
  { customer: "Muñeco", agent: "Muñeco", model: "unknown", status: "down", port: 2236, born: "2026-03-28", days: 30 },
  { customer: "Ted", agent: "Ted", model: "old proxy", status: "down", port: 2238, phone: "+52 444 287 4841", born: "2026-03-31", days: 27 },
  { customer: "Thor", agent: "Thor", model: "Gemini 3.1/OldProxy", status: "ok", port: 2224, phone: "+52 444 431 0958", sim: "31707", born: "2026-03-31", days: 27 },
  { customer: "Argos", agent: "Argos", model: "Gemini 3.1/oldProxy", status: "down", port: 2239, phone: "+52 444 665 5769", sim: "5004610", born: "2026-03-31", days: 27, notes: "+ 3 duplicate Argos docs created 2026-04-01 (re-onboards)" },
  { customer: "Palomino", agent: "Palomino", model: "Cortex", status: "down", port: 2240, phone: "+52 444 496 9014", sim: "640670", born: "2026-04-05", days: 22, notes: "DOWN. Plus 2 earlier 'Palomo' docs from 2026-04-02" },
  { customer: "Victor", agent: "Victor", model: "unknown", status: "ok", port: 2242, born: "2026-04-22", days: 5, notes: "youngest" },
  { customer: "Henry", agent: "Henry", model: "unknown", status: "down", port: 2245, sim: "OXXO8009F" },
  { customer: "LicFausto", agent: "LicFausto", model: "unknown", status: "ok", port: 2244, phone: "+52 444 203 9984", sim: "4136F" },
  { customer: "Willow", agent: "Willow", model: "unknown", status: "ok", port: 2243 },
  { customer: "Jesus me entiende", agent: "Jesus me entiende", model: "unknown", status: "ok", port: 2246, phone: "+52 984 186 5182", sim: "3160F" },
  { customer: "Chaak", agent: "Chaak", model: "unknown", status: "ok", port: 2247, phone: "+52 998 203 0444", sim: "229F" },
];

type SortKey = "agent" | "port";
type SortDir = "asc" | "desc" | null;

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

export default function ClientsPage() {
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

    return [...clients].sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      if (sortKey === "agent") {
        aVal = a.agent.toLowerCase();
        bVal = b.agent.toLowerCase();
      } else if (sortKey === "port") {
        aVal = a.port ?? 0;
        bVal = b.port ?? 0;
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortKey, sortDir]);

  const okCount = clients.filter((c) => c.status.toLowerCase().trim() === "ok").length;
  const issueCount = clients.filter((c) => c.status.toLowerCase().trim() !== "ok").length;

  const getSortDir = (key: SortKey): SortDir => {
    if (sortKey !== key) return null;
    return sortDir;
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 md:mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Clients</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1">Monitor client agents and their connection status</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-500">Total Clients</p>
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{clients.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-500">Connected (OK)</p>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{okCount}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-500">Issues</p>
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{issueCount}</p>
        </div>
      </div>

      {/* Table */}
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Born
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Days
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  SIM
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
