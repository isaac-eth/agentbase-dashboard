export type Client = {
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
  payAmount?: string;
  payDate?: string;
};

// Base roster. Fleet-specific fields (port, phone, sim, etc.) live here.
// payAmount / payDate are fallbacks used only if the live ledger fetch fails.
export const baseClients: Client[] = [
  { customer: "EchoPrime", agent: "Echo", model: "unknown", status: "ok", port: 2235, phone: "+52 444 289 3990", born: "2026-02-14", days: 72, notes: "EchoPrime / mothership" },
  { customer: "Navi", agent: "Navi", model: "old proxy", status: "ok", port: 2221, phone: "+52 444 289 3990", born: "2026-02-14", days: 72, payAmount: "$5,000.00 MXN", payDate: "2026-05-28" },
  { customer: "Vera", agent: "Vera", model: "unknown", status: "down", port: 2227, born: "2026-02-18", days: 68 },
  { customer: "Cherry", agent: "Cherry", model: "unknown", status: "down", port: 2226, born: "2026-02-19", days: 67 },
  { customer: "Doc", agent: "Doc", model: "old proxy", status: "ok", port: 2222, phone: "+52 444 315 7963", born: "2026-02-20", days: 66, payAmount: "$9,900.00 MXN", payDate: "2026-06-23" },
  { customer: "Borz", agent: "Borz", model: "old proxy", status: "ok", port: 2223, phone: "+52 444 315 7963", born: "2026-02-21", days: 65, payAmount: "$9,900.00 MXN", payDate: "2026-05-28" },
  { customer: "Ed", agent: "Ed", model: "old proxy", status: "ok", port: 2220, phone: "+52 444 575 3406", sim: "119319", born: "2026-02-23", days: 63 },
  { customer: "Manolo", agent: "Manolo", model: "old proxy", status: "ok", port: 2225, phone: "+52 444 431 0958", sim: "31707", born: "2026-02-25", days: 61, payAmount: "350 USD", payDate: "Pendiente" },
  { customer: "Lili", agent: "Lili", model: "to check", status: "ok", port: 2228, phone: "+52 485 104 4333", sim: "82665", born: "2026-03-02", days: 56, payAmount: "$9,900.00 MXN", payDate: "2026-05-29" },
  { customer: "Nikola", agent: "Nikola", model: "Cortex", status: "ok", port: 2229, phone: "+52 444 174 2127", sim: "476431", born: "2026-03-03", days: 55, payAmount: "$9,900.00 MXN", payDate: "2026-06-09" },
  { customer: "Atena", agent: "Atena", model: "old proxy", status: "ok", port: 2233, phone: "+52 444 121 6753", sim: "614840", born: "2026-03-18", days: 40, payAmount: "350 USD", payDate: "2026-06-01", notes: "⚠️ fleet.md 'Key Agent IDs' lists this id as Lic — Mongo says Atena. Worth reconciling." },
  { customer: "Lic", agent: "Lic", model: "old proxy", status: "ok", port: 2231, phone: "+52 444 121 6753", sim: "4321F", born: "2026-03-25", days: 33, notes: "Real Lic doc, not in fleet.md key table" },
  { customer: "Muñeco", agent: "Muñeco", model: "unknown", status: "down", port: 2236, born: "2026-03-28", days: 30, payAmount: "$9,900.00 MXN", payDate: "2026-05-28" },
  { customer: "Ted", agent: "Ted", model: "old proxy", status: "down", port: 2238, phone: "+52 444 287 4841", born: "2026-03-31", days: 27 },
  { customer: "Thor", agent: "Thor", model: "Gemini 3.1/OldProxy", status: "ok", port: 2224, phone: "+52 444 431 0958", sim: "31707", born: "2026-03-31", days: 27, payAmount: "350 USD", payDate: "2026-06-01" },
  { customer: "Argos", agent: "Argos", model: "Gemini 3.1/oldProxy", status: "down", port: 2239, phone: "+52 444 665 5769", sim: "5004610", born: "2026-03-31", days: 27, payAmount: "350 USD", payDate: "2026-06-01", notes: "+ 3 duplicate Argos docs created 2026-04-01 (re-onboards)" },
  { customer: "Palomino", agent: "Palomino", model: "Cortex", status: "down", port: 2240, phone: "+52 444 496 9014", sim: "640670", born: "2026-04-05", days: 22, payAmount: "$14,900.00 MXN", payDate: "2026-06-02", notes: "DOWN. Plus 2 earlier 'Palomo' docs from 2026-04-02" },
  { customer: "Victor", agent: "Victor", model: "unknown", status: "ok", port: 2242, born: "2026-04-22", days: 5, payAmount: "$14,900.00 MXN", payDate: "2026-06-23", notes: "youngest" },
  { customer: "Henry", agent: "Henry", model: "unknown", status: "down", port: 2245, sim: "OXXO8009F", payAmount: "$14,900.00 MXN", payDate: "2026-06-22" },
  { customer: "LicFausto", agent: "LicFausto", model: "unknown", status: "ok", port: 2244, phone: "+52 444 203 9984", sim: "4136F" },
  { customer: "Willow", agent: "Willow", model: "unknown", status: "ok", port: 2243, payAmount: "$19,800.00 MXN", payDate: "2026-06-06" },
  { customer: "Jesus me entiende", agent: "Jesus me entiende", model: "unknown", status: "ok", port: 2246, phone: "+52 984 186 5182", sim: "3160F", payAmount: "$14,990.00 MXN", payDate: "2026-06-25" },
  { customer: "Chaak", agent: "Chaak", model: "unknown", status: "ok", port: 2247, phone: "+52 998 203 0444", sim: "229F", payAmount: "$14,900.00 MXN", payDate: "Pendiente" },
];

// Live payment data source — the same JSON that powers bolsa.me/bitso's customer roster.
export const LEDGER_URL = "https://bolsa.me/bitso/customer-ledger.json";
export const REVALIDATE_SECONDS = 12 * 60 * 60; // 12 hours

type LedgerCustomer = {
  agent: string;
  amount?: number;
  currency?: string;
  nextInvoiceDate?: string | null;
};

type Ledger = {
  generatedAt?: string;
  updatedAt?: string;
  customers?: LedgerCustomer[];
};

// Mirrors bolsa.me's fmtMoney: MXN -> "$9,900.00 MXN", USD -> "350 USD".
function formatMoney(amount?: number, currency = "MXN"): string | undefined {
  if (amount === undefined || amount === null || !Number.isFinite(amount)) return undefined;
  if (currency === "MXN" || currency === "USDC") {
    const n = amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: currency === "MXN" ? 2 : 6,
    });
    return `$${n} ${currency}`;
  }
  const n = amount.toLocaleString("en-US", { maximumFractionDigits: 8 });
  return `${n} ${currency}`;
}

// nextInvoiceDate may be an ISO date, a phrase like "collect now", or null.
function formatPayDate(next?: string | null): string {
  if (!next) return "Pendiente";
  if (/^\d{4}-\d{2}-\d{2}$/.test(next)) return next;
  // Non-date phrases (e.g. "collect now") -> mark as due now.
  if (/collect/i.test(next)) return "Cobrar ahora";
  return next;
}

export type MergeResult = {
  clients: Client[];
  /** Timestamp the live ledger was generated, or null if the fetch failed. */
  ledgerUpdatedAt: string | null;
  /** True when live data was applied; false means fallback values are shown. */
  live: boolean;
};

// Overlays live payment fields onto the base roster, matched by agent name
// (case-insensitive). Fleet fields are always preserved from baseClients.
export function mergeLedger(ledger: Ledger | null): MergeResult {
  if (!ledger?.customers?.length) {
    return { clients: baseClients, ledgerUpdatedAt: null, live: false };
  }

  const byAgent = new Map<string, LedgerCustomer>();
  for (const c of ledger.customers) {
    if (c.agent) byAgent.set(c.agent.trim().toLowerCase(), c);
  }

  const clients = baseClients.map((client) => {
    const match = byAgent.get(client.agent.trim().toLowerCase());
    if (!match) return client;
    return {
      ...client,
      payAmount: formatMoney(match.amount, match.currency) ?? client.payAmount,
      payDate: formatPayDate(match.nextInvoiceDate),
    };
  });

  return {
    clients,
    ledgerUpdatedAt: ledger.updatedAt ?? ledger.generatedAt ?? null,
    live: true,
  };
}
