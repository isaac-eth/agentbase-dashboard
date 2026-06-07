import DashboardLayout from "@/components/DashboardLayout";
import ClientsTable from "./ClientsTable";
import { LEDGER_URL, REVALIDATE_SECONDS, mergeLedger, type MergeResult } from "./data";

// Re-generate this page at most once every 12 hours (Next.js ISR on Vercel).
// On the first request after the window elapses, the page is rebuilt with a
// fresh pull of bolsa.me/bitso's customer ledger.
export const revalidate = 43200;

async function loadClients(): Promise<MergeResult> {
  try {
    const res = await fetch(LEDGER_URL, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) throw new Error(`ledger fetch failed: ${res.status}`);
    const ledger = await res.json();
    return mergeLedger(ledger);
  } catch (err) {
    console.error("[clients] falling back to static payment data:", err);
    return mergeLedger(null);
  }
}

function formatUpdated(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ClientsPage() {
  const { clients, ledgerUpdatedAt, live } = await loadClients();

  const okCount = clients.filter((c) => c.status.toLowerCase().trim() === "ok").length;
  const issueCount = clients.filter((c) => c.status.toLowerCase().trim() !== "ok").length;
  const updatedLabel = formatUpdated(ledgerUpdatedAt);

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

      {/* Payment data freshness */}
      <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${live ? "bg-emerald-500" : "bg-amber-500"}`}
        />
        {live ? (
          <span>
            Datos de pago en vivo desde bolsa.me/bitso
            {updatedLabel ? ` · actualizado ${updatedLabel}` : ""} · se refresca cada 12 h
          </span>
        ) : (
          <span>Datos de pago de respaldo (no se pudo contactar bolsa.me/bitso)</span>
        )}
      </div>

      {/* Table */}
      <ClientsTable clients={clients} />
    </DashboardLayout>
  );
}
