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
};

const clients: Client[] = [
  { customer: "Ed", agent: "Ed", model: "old proxy", status: "down", port: 2220, phone: "+52 444 575 3406", sim: "119319" },
  { customer: "Navi", agent: "Navi", model: "old proxy", status: "ok", port: 2221, phone: "+52 444 289 3990" },
  { customer: "Doc", agent: "Doc", model: "old proxy", status: "ok", port: 2222, phone: "+52 444 315 7963" },
  { customer: "Borz", agent: "Borz", model: "old proxy", status: "ok", port: 2223, phone: "+52 444 315 7963" },
  { customer: "Thor", agent: "Thor", model: "Gemini 3.1/OldProxy", status: "ok", port: 2224, phone: "+52 444 431 0958", sim: "31707" },
  { customer: "Cherry", agent: "Cherry", model: "unknown", status: "down", port: 2226 },
  { customer: "Vera", agent: "Vera", model: "unknown", status: "down", port: 2227 },
  { customer: "Lili", agent: "Lili", model: "to check", status: "ok", port: 2228, phone: "+52 485 104 4333", sim: "82665" },
  { customer: "Niko", agent: "Nikola", model: "Cortex", status: "ok", port: 2229, phone: "+52 444 174 2127", sim: "476431" },
  { customer: "Lic", agent: "Lic", model: "old proxy", status: "ok", port: 2231, phone: "+52 444 121 6753", sim: "774321" },
  { customer: "Atena", agent: "Atena", model: "old proxy", status: "ok", port: 2233, phone: "+52 444 121 6753", sim: "614840" },
  { customer: "Muñeco", agent: "Muñeco", model: "unknown", status: "down", port: 2236 },
  { customer: "Ted", agent: "Ted", model: "old proxy", status: "degraded", port: 2238, phone: "+52 444 287 4841" },
  { customer: "Argo", agent: "Argos", model: "Gemini 3.1/oldProxy", status: "down", port: 2239, phone: "+52 444 665 5769", sim: "5004610" },
  { customer: "Palomino", agent: "Palomino", model: "Cortex", status: "down", port: 2240, phone: "+52 444 496 9014", sim: "640670" },
];

type SortKey = "customer" | "agent" | "model" | "port" | "status";
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

function getStatusBadge(status: string) {
  const s = status.toLowerCase().trim();
  if (s === "ok") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        {status}
      </span>
    );
  }
  if (s === "down") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        {status}
      </span>
    );
  }
  if (s === "degraded") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        {status}
      </span>
    );
  }
  if (s === "whatsunlinked" || s === "whatsapp unlinked") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
        {status}
      </span>
    );
  }
  if (s === "issue") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      {status}
    </span>
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

      if (sortKey === "customer") {
        aVal = a.customer.toLowerCase();
        bVal = b.customer.toLowerCase();
      } else if (sortKey === "agent") {
        aVal = a.agent.toLowerCase();
        bVal = b.agent.toLowerCase();
      } else if (sortKey === "model") {
        aVal = a.model.toLowerCase();
        bVal = b.model.toLowerCase();
      } else if (sortKey === "port") {
        aVal = a.port ?? 0;
        bVal = b.port ?? 0;
      } else if (sortKey === "status") {
        aVal = a.status.toLowerCase();
        bVal = b.status.toLowerCase();
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
                  onClick={() => handleSort("customer")}
                >
                  <div className="flex items-center gap-1.5">
                    Customer
                    <SortIcon direction={getSortDir("customer")} />
                  </div>
                </th>
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
                  onClick={() => handleSort("model")}
                >
                  <div className="flex items-center gap-1.5">
                    Model
                    <SortIcon direction={getSortDir("model")} />
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
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1.5">
                    Status
                    <SortIcon direction={getSortDir("status")} />
                  </div>
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
                  <td className="px-6 py-3.5 font-medium text-slate-800">{client.customer}</td>
                  <td className="px-6 py-3.5 text-slate-600">{client.agent}</td>
                  <td className="px-6 py-3.5 text-slate-500 font-mono text-xs">{client.model}</td>
                  <td className="px-6 py-3.5">
                    {client.port ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {client.port}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5">{getStatusBadge(client.status)}</td>
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
