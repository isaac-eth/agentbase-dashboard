"use client";

import { ReactNode } from "react";
import DashboardLayout from "@/components/DashboardLayout";

type Tone = "decision" | "action" | "success" | "warning" | "danger";

const nodeTones: Record<Tone, string> = {
  decision: "bg-blue-50 border-blue-200 text-blue-900",
  action: "bg-slate-50 border-slate-200 text-slate-800",
  success: "bg-emerald-50 border-emerald-200 text-emerald-900",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  danger: "bg-red-50 border-red-200 text-red-900",
};

const branchTones: Record<Tone, { border: string; chip: string }> = {
  decision: { border: "border-blue-300", chip: "bg-blue-100 text-blue-700" },
  action: { border: "border-slate-300", chip: "bg-slate-100 text-slate-600" },
  success: { border: "border-emerald-300", chip: "bg-emerald-100 text-emerald-700" },
  warning: { border: "border-amber-300", chip: "bg-amber-100 text-amber-700" },
  danger: { border: "border-red-300", chip: "bg-red-100 text-red-700" },
};

function Node({ tone, title, children }: { tone: Tone; title: ReactNode; children?: ReactNode }) {
  return (
    <div className={`rounded-xl border px-4 py-3 shadow-sm ${nodeTones[tone]}`}>
      <p className="font-semibold text-sm leading-snug">{title}</p>
      {children && <div className="text-xs mt-1.5 leading-relaxed opacity-90">{children}</div>}
    </div>
  );
}

function Branch({ label, tone, children }: { label: string; tone: Tone; children: ReactNode }) {
  const t = branchTones[tone];
  return (
    <div className={`relative ml-3 pl-5 border-l-2 ${t.border} pb-1`}>
      <span className={`inline-block mb-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${t.chip}`}>
        {label}
      </span>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Cmd({ children }: { children: ReactNode }) {
  return (
    <code className="inline-block bg-slate-800 text-slate-100 px-1.5 py-0.5 rounded font-mono text-[11px]">
      {children}
    </code>
  );
}

export default function BotDownPage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">What to do?: Bot Down</h1>
        <p className="text-slate-500 text-xs md:text-sm mt-1">
          Flujo de pasos a seguir cuando un bot se cae · DownBot Flow Chart
        </p>
      </div>

      {/* Flowchart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 md:p-8 overflow-x-auto">
        <div className="min-w-[320px] space-y-3">
          {/* Root */}
          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 shadow-md">
            <svg className="w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-bold text-sm">DownBot Flow Chart</span>
          </div>

          {/* Q: ¿El bot responde? */}
          <Node tone="decision" title="¿El bot responde?" />

          {/* 2.1 Sí, correcto */}
          <Branch label="Sí, de forma correcta" tone="success">
            <Node tone="success" title="✅ Todo OK — el bot responde correctamente." />
          </Branch>

          {/* 2.2 Sí, pero con error */}
          <Branch label="Sí, pero con error" tone="warning">
            <Node
              tone="decision"
              title="Validar vigencia de los access tokens y conexión con la VPS."
            >
              Que el bot haga fetch a los tokens presentes en la MongoDB del VPS. Si están
              expirados, actualizarlos en la MongoDB entrando a <strong>Echo</strong> usando Claude.
              <span className="block mt-1 font-semibold">¿Funciona OK?</span>
            </Node>

            <Branch label="Sí" tone="success">
              <Node tone="success" title="✅ Listo." />
            </Branch>

            <Branch label="No" tone="danger">
              <Node
                tone="action"
                title="Entrar a Claude en el puente del bot."
              >
                Corregir con Claude de acuerdo al error y a los logs.
              </Node>
            </Branch>
          </Branch>

          {/* 2.3 No responde */}
          <Branch label="No responde" tone="danger">
            <Node tone="decision" title="¿Tenemos conexión al puente?" />

            {/* 2.3.1.1 Sí */}
            <Branch label="Sí" tone="success">
              <Node tone="decision" title="¿El robot responde por el TUI?" />

              <Branch label="Sí — problema de Gateway o canales" tone="warning">
                <Node tone="action" title="Reiniciar el gateway.">
                  Correr: <Cmd>openclaw gateway restart</Cmd>, esperar 1-3 minutos e intentar
                  contactar al bot por WhatsApp / Telegram.
                  <span className="block mt-1 font-semibold text-amber-700">
                    [Matssa y Argos: esperar hasta 5 min]
                  </span>
                </Node>

                <Branch label="Si no funciona" tone="danger">
                  <Node tone="action" title="Re-vincular WhatsApp.">
                    Volver a escanear el QR de WhatsApp y luego correr{" "}
                    <Cmd>openclaw gateway restart</Cmd>.
                  </Node>
                </Branch>
              </Branch>
            </Branch>

            {/* 2.3.1.2 No */}
            <Branch label="No" tone="danger">
              <Node tone="danger" title="⚠️ Posible caída de la mini PC o de internet." />
            </Branch>
          </Branch>
        </div>
      </div>
    </DashboardLayout>
  );
}
