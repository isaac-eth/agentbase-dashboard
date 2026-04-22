"use client";

import { useState } from "react";

const sections = [
  {
    id: "introduccion",
    navLabel: "Intro",
    heading: "Bienvenido a AgentBase",
    sub: "Tu agente de inteligencia artificial",
    body: "AgentBase te conecta con un agente de IA diseñado para ayudarte a trabajar más eficientemente.\n\n• Automatiza tareas\n• Responde preguntas\n• Disponible 24/7",
  },
  {
    id: "onboarding",
    navLabel: "Onboarding",
    heading: "Configura tu Agente",
    sub: "3 pasos para empezar",
    body: "Habla con él por WhatsApp.\n¡Dile a tu agente quién es y en qué te ayudará!\n\n• [b]Su nombre[/b] — Cómo quieres que se llame\n• [b]Sus tareas[/b] — Qué trabajoará\n• [b]Su operador[/b] — Quién recibirá las respuestas",
  },
  {
    id: "uso",
    navLabel: "Uso",
    heading: "Cómo hablarle a tu agente",
    sub: "Comunicarte de forma efectiva",
    body: "• [b]Envía un mensaje a la vez[/b] — tu agente interpreta cada mensaje como una indicación separada\n• [b]Habla claro y con contexto[/b] — mientras más detalles des, mejor será la respuesta\n• [b]Itera y refina[/b] — si la primera respuesta no es lo que buscas, ajusta tu petición\n• [b]Usa comandos simples[/b] — para tareas frecuentes, frases cortas y directas funcionan mejor",
  },
  {
    id: "habilidades",
    navLabel: "Habilidades",
    heading: "Habilidades",
    sub: "Lo que tu agente sabe hacer",
    body: "Las habilidades permiten al agente ejecutar tareas de manera efectiva. Algunos ejemplos:\n\n• Consultar inventario\n• Generar reportes\n• Publicar en redes\n\nCuando tu agente logre hacer algo que será una tarea repetitiva, dile que guarde su flujo de trabajo como habilidad. Así lo podrá realizar cada vez que lo necesites.",
  },
  {
    id: "tips",
    navLabel: "Tips",
    heading: "Tips & Recommendations",
    sub: "Elige una categoría",
  },
  {
    id: "soporte",
    navLabel: "Soporte",
    heading: "Soporte y Ayuda",
    sub: "Estamos aquí para ayudarte",
    body: "• Contacta a tu administrador de AgentBase para cualquier problema\n• Reporta errores o sugiere mejoras\n• El equipo está disponible para resolver dudas técnicas",
  },
];

const tipsItems = [
  {
    title: "Para atención a clientes",
    content: `Dale a tu agente un mensaje de presentación para que conteste cuando un cliente le mande mensaje, incluye opciones para guiar a tu cliente.\n\n<<📱 Hola, soy [Nombre], asistente digital de [empresa/negocio].\n\nEstoy aquí para ayudarte con cualquier duda sobre nuestros productos, servicios o procesos. También puedo apoyarte con pedidos, agendamiento y más.\n\n¿En qué te puedo ayudar?>>`,
  },
];

// Helper to render body text with [b]...[/b] or <<...>> as bold blue spans
function renderBody(text: string) {
  const parts = text.split(/(\[b\]|\[\/b\]|<<|>>)/);
  const elements: React.ReactNode[] = [];
  let isBold = false;
  let key = 0;

  for (const part of parts) {
    if (part === '[b]') {
      isBold = true;
    } else if (part === '[/b]') {
      isBold = false;
    } else if (part === '<<') {
      isBold = true;
    } else if (part === '>>') {
      isBold = false;
    } else if (part) {
      elements.push(
        isBold ? (
          <span key={key++} className="font-bold text-[#4EA5F0]">{part}</span>
        ) : (
          part
        )
      );
    }
  }

  return elements;
}

export default function ManualPage() {
  const [openTip, setOpenTip] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#080B12] font-sans scroll-smooth">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-[#080B12] py-24 px-6 text-white">
        {/* deep steel blue glow blobs */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[#1A2A40] blur-3xl opacity-70" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-[#1A2A40] blur-3xl opacity-50" />
        <div className="pointer-events-none absolute top-12 right-0 h-64 w-64 rounded-full bg-[#4EA5F0]/10 blur-3xl" />
        {/* sky blue glow behind content */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-96 rounded-full bg-[#8CC6FF]/5 blur-2xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full border border-[#4EA5F0]/30 bg-[#1A2A40] px-4 py-1.5 text-sm font-medium tracking-wide uppercase text-[#4EA5F0] shadow-lg shadow-[#4EA5F0]/10">
            AgentBase · Guía de Usuario
          </span>
          <h1
            className="mt-4 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl"
            style={{ textShadow: "0 0 40px rgba(140,198,255,0.25)" }}
          >
            Manual de Usuario
          </h1>
          <p className="mt-4 text-xl font-light text-[#8CC6FF]/80 sm:text-2xl">
            Tu guía para aprovechar al máximo tu agente de inteligencia artificial
          </p>
        </div>
      </header>

      {/* ── STICKY NAV ───────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-[#1A2A40] bg-[#080B12]/90 shadow-lg shadow-[#4EA5F0]/5 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 py-3 sm:gap-2">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-[#1A2A40] hover:text-[#4EA5F0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4EA5F0]"
            >
              {s.navLabel}
            </a>
          ))}
        </div>
      </nav>

      {/* ── CONTENT SECTIONS ─────────────────────────────────────── */}
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        {sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className="scroll-mt-16 rounded-2xl bg-[#1A2A40] p-8 shadow-xl shadow-[#4EA5F0]/5 ring-1 ring-[#4EA5F0]/10"
          >
            {/* section number pill */}
            <div className="mb-5 flex items-center gap-3">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4EA5F0] text-sm font-bold text-[#080B12] shadow-md shadow-[#4EA5F0]/40"
              >
                {i + 1}
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#4EA5F0]">
                {s.navLabel}
              </span>
            </div>

            <h2 className="text-3xl font-bold text-white">{s.heading}</h2>
            <p className="mt-2 text-base font-medium text-[#8CC6FF]/70">{s.sub}</p>

            {s.id === "tips" ? (
              /* Interactive tips menu */
              <div className="mt-6 space-y-3">
                {tipsItems.map((item, idx) => (
                  <div key={idx} className="rounded-xl bg-[#080B12]/50 ring-1 ring-[#4EA5F0]/10 overflow-hidden">
                    <button
                      onClick={() => setOpenTip(openTip === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="font-medium">{item.title}</span>
                      <span className={`text-[#4EA5F0] text-xl transition-transform ${openTip === idx ? "rotate-45" : ""}`}>
                        +
                      </span>
                    </button>
                    {openTip === idx && (
                      <div className="px-4 pb-4 pt-0 text-slate-400 text-sm leading-relaxed border-t border-[#4EA5F0]/10" style={{ whiteSpace: 'pre-line' }}>
                        <p className="pt-3">{renderBody(item.content)}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-[#080B12]/50 p-5 text-slate-300 leading-relaxed ring-1 ring-[#4EA5F0]/10" style={{ whiteSpace: 'pre-line' }}>
                {s.body ? renderBody(s.body) : null}
              </div>
            )}
          </section>
        ))}
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="mt-8 border-t border-[#1A2A40] bg-[#080B12] py-8 text-center text-sm text-slate-500">
        © 2025{" "}
        <span className="text-[#4EA5F0]">AgentBase</span>
        {" "}— Todos los derechos reservados
      </footer>
    </div>
  );
}
