"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

type Priority = "critical" | "medium" | "low";

type Task = {
  id: string;
  cliente: string;
  request: string;
  fechaInicio: string; // registration time (datetime-local / ISO string)
  prioridad: Priority;
  responsable: string; // team member name, "" = sin asignar
  fechaLimite: string; // due date "YYYY-MM-DD", "" = sin fecha
};

const STORAGE_KEY = "agentbase-tasks";

// Team members that can be assigned as responsable for a task.
const TEAM = ["Shaak", "Joel", "Karina", "Miltron"];

const PRIORITY_LABEL: Record<Priority, string> = {
  critical: "Critical",
  medium: "Medium",
  low: "Low",
};

const PRIORITY_BADGE: Record<Priority, string> = {
  critical: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

// Hours after registering at which the counter turns from yellow to red.
// critical: over 1h · medium: 5+ h · low: 12+ h
const RED_AFTER_HOURS: Record<Priority, number> = {
  critical: 1,
  medium: 5,
  low: 12,
};

const seedTasks: Task[] = [
  {
    id: "seed-1",
    cliente: "Luca",
    request: "Check API limit in MiniMax",
    fechaInicio: "2026-04-21",
    prioridad: "medium",
    responsable: "Joel",
    fechaLimite: "",
  },
];

function hoursSince(dateStr: string, now: number): number {
  const start = new Date(dateStr);
  if (isNaN(start.getTime())) return 0;
  return Math.max(0, (now - start.getTime()) / 3_600_000);
}

// "YYYY-MM-DDTHH:MM" in local time, for <input type="datetime-local">
function nowLocalInput(): string {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function toLocalInput(str: string): string {
  const d = new Date(str);
  if (isNaN(d.getTime())) return nowLocalInput();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function formatStart(str: string): string {
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  return d.toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format a date-only string ("YYYY-MM-DD") for display.
function formatDate(str: string): string {
  if (!str) return "";
  // Parse as local date to avoid the UTC off-by-one with "YYYY-MM-DD".
  const [y, m, d] = str.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  if (isNaN(date.getTime())) return str;
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// A due date is overdue once its day is fully in the past.
function isOverdue(str: string, now: number): boolean {
  if (!str) return false;
  const [y, m, d] = str.split("-").map(Number);
  const due = new Date(y, (m ?? 1) - 1, d ?? 1);
  if (isNaN(due.getTime())) return false;
  due.setHours(23, 59, 59, 999); // end of the due day
  return now > due.getTime();
}

type FormState = {
  cliente: string;
  request: string;
  fechaInicio: string;
  prioridad: Priority;
  responsable: string;
  fechaLimite: string;
};

const emptyForm: FormState = {
  cliente: "",
  request: "",
  fechaInicio: nowLocalInput(),
  prioridad: "medium",
  responsable: "",
  fechaLimite: "",
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");

  // Load from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setTasks(raw ? (JSON.parse(raw) as Task[]) : seedTasks);
    } catch {
      setTasks(seedTasks);
    }
    setLoaded(true);
  }, []);

  // Persist on every change (after initial load)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [tasks, loaded]);

  // Re-evaluate the hour counters/colors once a minute.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const rows = useMemo(
    () =>
      tasks.map((t) => {
        const prioridad: Priority = t.prioridad ?? "medium";
        const responsable = t.responsable ?? "";
        const fechaLimite = t.fechaLimite ?? "";
        const horas = hoursSince(t.fechaInicio, now);
        const isRed = horas >= RED_AFTER_HOURS[prioridad];
        const overdue = isOverdue(fechaLimite, now);
        return {
          ...t,
          prioridad,
          responsable,
          fechaLimite,
          horas: Math.floor(horas),
          isRed,
          overdue,
        };
      }),
    [tasks, now]
  );

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, fechaInicio: nowLocalInput() });
    setError("");
    setModalOpen(true);
  }

  function openEdit(task: Task) {
    setEditingId(task.id);
    setForm({
      cliente: task.cliente,
      request: task.request,
      fechaInicio: toLocalInput(task.fechaInicio),
      prioridad: task.prioridad ?? "medium",
      responsable: task.responsable ?? "",
      fechaLimite: task.fechaLimite ?? "",
    });
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setError("");
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const cliente = form.cliente.trim();
    const request = form.request.trim();
    const fechaInicio = form.fechaInicio;
    const prioridad = form.prioridad;
    const responsable = form.responsable;
    const fechaLimite = form.fechaLimite;

    if (!cliente || !request || !fechaInicio) {
      setError("Cliente, Request y Fecha de registro son obligatorios.");
      return;
    }

    if (editingId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? { ...t, cliente, request, fechaInicio, prioridad, responsable, fechaLimite }
            : t
        )
      );
    } else {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `task-${Date.now()}`;
      setTasks((prev) => [
        ...prev,
        { id, cliente, request, fechaInicio, prioridad, responsable, fechaLimite },
      ]);
    }
    closeModal();
  }

  function handleDelete(task: Task) {
    if (confirm(`¿Eliminar la task de "${task.cliente}"?`)) {
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    }
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 md:mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1">Manage and monitor your agent tasks</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-all duration-150 hover:shadow-md hover:shadow-blue-500/25 hover:-translate-y-px min-h-[44px]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* Tasks table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">All Tasks</h2>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {rows.length} {rows.length === 1 ? "task" : "tasks"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Request
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Responsable
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Fecha de registro
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Fecha límite
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Horas desde el registro
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No hay tasks todavía. Crea una con el botón <span className="font-semibold">New Task</span>.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                    <td className="px-6 py-3.5 font-medium text-slate-800">{row.cliente}</td>
                    <td className="px-6 py-3.5 text-slate-600">{row.request}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${PRIORITY_BADGE[row.prioridad]}`}
                      >
                        {PRIORITY_LABEL[row.prioridad]}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      {row.responsable ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                          {row.responsable}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                        {formatStart(row.fechaInicio)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      {row.fechaLimite ? (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            row.overdue ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {formatDate(row.fechaLimite)}
                          {row.overdue && " · vencida"}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          row.isRed ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {row.horas} {row.horas === 1 ? "hora" : "horas"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(row)}
                          aria-label="Editar task"
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zM19.5 7.125L16.875 4.5" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          aria-label="Eliminar task"
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">
                {editingId ? "Editar task" : "Nueva task"}
              </h3>
              <button
                onClick={closeModal}
                aria-label="Cerrar"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Cliente</label>
                <input
                  type="text"
                  value={form.cliente}
                  onChange={(e) => setForm((f) => ({ ...f, cliente: e.target.value }))}
                  placeholder="Nombre del cliente"
                  autoFocus
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Request</label>
                <textarea
                  value={form.request}
                  onChange={(e) => setForm((f) => ({ ...f, request: e.target.value }))}
                  placeholder="Descripción del request"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Prioridad</label>
                <select
                  value={form.prioridad}
                  onChange={(e) => setForm((f) => ({ ...f, prioridad: e.target.value as Priority }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                >
                  <option value="critical">Critical</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Responsable</label>
                <select
                  value={form.responsable}
                  onChange={(e) => setForm((f) => ({ ...f, responsable: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                >
                  <option value="">Sin asignar</option>
                  {TEAM.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha de registro</label>
                <input
                  type="datetime-local"
                  value={form.fechaInicio}
                  onChange={(e) => setForm((f) => ({ ...f, fechaInicio: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Fecha límite <span className="text-slate-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="date"
                  value={form.fechaLimite}
                  onChange={(e) => setForm((f) => ({ ...f, fechaLimite: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-all duration-150 hover:shadow-md"
                >
                  {editingId ? "Guardar cambios" : "Crear task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
