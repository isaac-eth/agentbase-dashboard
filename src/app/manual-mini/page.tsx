"use client";

const sections = [
  {
    id: "introduccion",
    navLabel: "Intro",
    heading: "Bienvenido a tu Agente",
    sub: "Tu asistente personal Plan Mini",
    body: "Este es tu agente de inteligencia artificial, diseñado para ayudarte con tareas del día a día.\n\n• Disponible cuando lo necesites\n• Respuestas rápidas\n• Ayuda personalizada",
  },
  {
    id: "onboarding",
    navLabel: "Onboarding",
    heading: "Empieza en 3 Pasos",
    sub: "Configura tu agente",
    body: "1. [b]Escríbele por WhatsApp[/b]\n2. [b]Preséntate[/b] — dile tu nombre y en qué te puede ayudar\n3. [b]Empieza a chatear[/b] — pregúntale lo que necesites",
  },
  {
    id: "uso",
    navLabel: "Uso",
    heading: "Cómo Comunicarte",
    sub: "Tips para mejores resultados",
    body: "• [b]Un mensaje a la vez[/b] — tu agente responde cada mensaje como una tarea\n• [b]Sé claro[/b] — mientras más contexto, mejor respuesta\n• [b]Itera[/b] — si no es lo que buscabas, ajusta tu pregunta\n• [b]Frases cortas[/b] — funcionan mejor para tareas rápidas",
  },
  {
    id: "tips",
    navLabel: "Tips",
    heading: "Tips & Trucos",
    sub: "Aprovecha al máximo",
    body: "• Para tareas repetitivas, tu agente puede aprender flujos de trabajo\n• Puedes pedirle que guarde información importante\n• Está disponible 24/7 para consultas rápidas",
  },
];

function renderBody(text: string) {
  const parts = text.split(/(\[b\]|\[\/b\])/);
  const elements: React.ReactNode[] = [];
  let isBold = false;
  let key = 0;

  for (const part of parts) {
    if (part === '[b]') {
      isBold = true;
    } else if (part === '[/b]') {
      isBold = false;
    } else if (part) {
      elements.push(
        isBold ? (
          <span key={key++} style={{ fontWeight: "bold", color: "#D84C8A" }}>
            {part}
          </span>
        ) : (
          <span key={key++}>{part}</span>
        )
      );
    }
  }

  return elements;
}

export default function ManualMiniPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "#000000",
        color: "#ffffff",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <header
        className="relative overflow-hidden py-24 px-6 text-center"
        style={{ background: "#000000" }}
      >
        {/* Glow effect */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[500px] rounded-full opacity-20 blur-3xl"
          style={{ background: "#D84C8A" }}
        />

        <div className="relative mx-auto max-w-4xl">
          <span
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wider"
            style={{
              background: "rgba(216, 76, 138, 0.15)",
              color: "#D84C8A",
              border: "1px solid rgba(216, 76, 138, 0.3)"
            }}
          >
            Plan Mini
          </span>
          <h1
            className="mt-4 text-5xl font-black tracking-tight sm:text-6xl"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #f8c8dc 30%, #D84C8A 50%, #f8c8dc 70%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "brightness(1.15) saturate(1.2)"
            }}
          >
            AI Assistant User Manual - Mini
          </h1>
          <p className="mt-6 text-xl" style={{ color: "#b0b0b0" }}>
            Tu agente personal, listo para ayudarte<br />
            cuando lo necesites.
          </p>
        </div>
      </header>

      {/* ── STICKY NAV ───────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(13, 13, 13, 0.95)",
          borderColor: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)"
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 py-3">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              style={{ color: "#b0b0b0" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1a1a1a";
                e.currentTarget.style.color = "#D84C8A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#b0b0b0";
              }}
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
            className="scroll-mt-16 rounded-2xl p-8 shadow-xl"
            style={{
              background: "#1a1a1a",
              border: "1px solid rgba(255, 255, 255, 0.08)"
            }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
                style={{
                  background: "linear-gradient(135deg, #D84C8A 0%, #F3E8EE 50%, #D84C8A 100%)"
                }}
              >
                {i + 1}
              </span>
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#D84C8A" }}
              >
                {s.navLabel}
              </span>
            </div>

            <h2 className="text-3xl font-bold" style={{ color: "#ffffff" }}>
              {s.heading}
            </h2>
            <p className="mt-2 text-base font-medium" style={{ color: "#b0b0b0" }}>
              {s.sub}
            </p>

            <div
              className="mt-6 rounded-xl p-5 leading-relaxed"
              style={{
                background: "#0d0d0d",
                color: "#b0b0b0",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                whiteSpace: "pre-line"
              }}
            >
              {s.body ? renderBody(s.body) : null}
            </div>
          </section>
        ))}
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer
        className="mt-8 border-t py-8 text-center text-sm"
        style={{
          borderColor: "rgba(255, 255, 255, 0.08)",
          background: "#000000",
          color: "#71717a"
        }}
      >
        © 2026 AI Assistant — Plan Mini
      </footer>
    </div>
  );
}
