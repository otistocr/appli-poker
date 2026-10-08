"use client"

import Link from "next/link"

// Option B — Sidebar gauche persistante (Linear/Notion vibe)

const SECTIONS = [
  { label: "Étudier", items: [
    { href: "/academie", icon: "♦", title: "Académie" },
    { href: "/outils", icon: "♦", title: "Outils" },
  ]},
  { label: "Jouer", items: [
    { href: "/charts", icon: "♠", title: "Ranges" },
    { href: "/postflop", icon: "♣", title: "Postflop" },
    { href: "/hh", icon: "♣", title: "Hand history" },
  ]},
  { label: "S'entraîner", items: [
    { href: "/trainer", icon: "♥", title: "Pratique préflop" },
    { href: "/postflop/trainer", icon: "♥", title: "Pratique postflop" },
    { href: "/stats", icon: "♠", title: "Progression" },
  ]},
]

export default function OrgB() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className="w-60 shrink-0 border-r flex flex-col"
        style={{ borderColor: "var(--border)", background: "var(--bg-deep)" }}
      >
        {/* Workspace header */}
        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-black"
            style={{
              background: "var(--accent)",
              borderColor: "var(--text-primary)",
              color: "var(--bg-deep)",
            }}
          >
            ♠
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">appli poker</div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Cash 6-max · 100bb</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
          {SECTIONS.map((sec) => (
            <div key={sec.label}>
              <div
                className="text-[10px] uppercase tracking-widest px-2 mb-2"
                style={{ color: "var(--text-muted)", letterSpacing: "0.2em" }}
              >
                {sec.label}
              </div>
              <div className="space-y-0.5">
                {sec.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-2 py-1.5 rounded text-sm hover:bg-[color:var(--surface)] transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span
                      className="text-base w-4 text-center"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.icon}
                    </span>
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
          <Link href="/org" className="hover:text-[color:var(--accent)]">← autres options</Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header
          className="border-b h-12 px-6 flex items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Home</div>
          <button
            className="text-xs px-2 py-1 border"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            ⌘K
          </button>
        </header>

        {/* Content */}
        <div className="p-8 sm:p-12 max-w-5xl">
          <div
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: "var(--accent)", letterSpacing: "0.3em" }}
          >
            Bonjour, neo
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight mb-3">
            Prêt à travailler ton préflop ?
          </h1>
          <p className="text-lg mb-10 max-w-xl" style={{ color: "var(--text-secondary)" }}>
            Reprends une session, ouvre les charts, ou continue un chapitre.
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <Link href="/trainer" className="chip-btn">Démarrer une session</Link>
            <Link href="/academie" className="chip-btn chip-btn-ghost">Reprendre un chapitre</Link>
          </div>

          {/* Quick access grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            <QuickCard href="/postflop/trainer" title="Continue le drill postflop" meta="~10 min" />
            <QuickCard href="/charts" title="Consulte une range" meta="Référence rapide" />
            <QuickCard href="/hh" title="Analyse une main" meta="PokerStars / Winamax" />
            <QuickCard href="/stats" title="Vois ta progression" meta="Heatmap + spots" />
          </div>
        </div>
      </main>
    </div>
  )
}

function QuickCard({ href, title, meta }: { href: string; title: string; meta: string }) {
  return (
    <Link
      href={href}
      className="block p-4 border hover:border-[color:var(--accent)] transition-colors"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div className="font-medium">{title}</div>
      <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{meta}</div>
    </Link>
  )
}
