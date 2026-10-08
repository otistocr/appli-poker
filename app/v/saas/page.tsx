"use client"

import Link from "next/link"

const NAV = [
  { href: "/charts", icon: "▤", label: "Charts", count: 18 },
  { href: "/trainer", icon: "◎", label: "Trainer", count: null },
  { href: "/academie", icon: "◈", label: "Académie", count: 10 },
  { href: "/hh", icon: "≡", label: "Hand history", count: null },
  { href: "/stats", icon: "△", label: "Statistiques", count: null },
]

export default function SaaSVariant() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text-primary)] flex">
      {/* Sidebar */}
      <aside
        className="w-56 shrink-0 border-r flex flex-col"
        style={{ borderColor: "var(--border)" }}
      >
        {/* Workspace header */}
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[color:var(--accent)] flex items-center justify-center text-white text-xs font-bold">
              AP
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">appli poker</div>
              <div className="text-[10px] text-[color:var(--text-muted)]">Cash 6-max</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2">
          <div className="text-[10px] uppercase tracking-widest text-[color:var(--text-muted)] px-2 py-1.5">
            Modules
          </div>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded text-sm text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--text-primary)]"
            >
              <span className="text-[color:var(--text-muted)] text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.count && (
                <span className="text-[10px] tabular-nums text-[color:var(--text-muted)]">
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 text-xs text-[color:var(--text-muted)]">
            <div className="w-6 h-6 rounded-full bg-[color:var(--surface-2)] flex items-center justify-center text-[10px]">
              N
            </div>
            <span>neo</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header
          className="border-b h-14 px-6 flex items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[color:var(--text-muted)]">Home</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[color:var(--text-muted)]">
            <button className="px-2.5 py-1 rounded border bg-[color:var(--surface)]" style={{ borderColor: "var(--border)" }}>
              ⌘K
            </button>
            <Link href="/v" className="hover:text-[color:var(--accent)]">
              ← autres variantes
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Bienvenue</h1>
            <p className="text-sm text-[color:var(--text-secondary)] mt-1">
              Ton environnement de training preflop. Progression sauvegardée localement.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card title="Ranges GTO" value="18" sub="dispo" />
            <Card title="Cours" value="10" sub="publiés" />
            <Card title="Modes drill" value="3" sub="Aléatoire · Ciblé · Erreurs" />
          </div>

          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-widest text-[color:var(--text-muted)] mb-3">
              Démarrages rapides
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Quick href="/trainer" title="Commencer une session de drill" hint="~15 min" />
              <Quick href="/charts" title="Ouvrir les charts GTO" hint="Consultation" />
              <Quick href="/academie" title="Reprendre l'Académie" hint="10 cours" />
              <Quick href="/hh" title="Analyser une main" hint="PokerStars / Winamax" />
            </div>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-[color:var(--text-muted)] mb-3">
              Ressources
            </h2>
            <div className="rounded border p-4 bg-[color:var(--surface)]" style={{ borderColor: "var(--border)" }}>
              <div className="text-sm">Cours conseillé aujourd&apos;hui</div>
              <div className="mt-1 text-lg font-medium">Penser en ranges</div>
              <div className="text-xs text-[color:var(--text-muted)] mt-1">
                40 min · Intermédiaire
              </div>
              <Link
                href="/academie/ranges"
                className="mt-3 inline-block text-xs text-[color:var(--accent)]"
              >
                Ouvrir →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Card({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div
      className="rounded border p-4 bg-[color:var(--surface)]"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="text-xs text-[color:var(--text-muted)]">{title}</div>
      <div className="text-3xl font-semibold tabular-nums mt-1">{value}</div>
      <div className="text-[11px] text-[color:var(--text-muted)] mt-1">{sub}</div>
    </div>
  )
}

function Quick({ href, title, hint }: { href: string; title: string; hint: string }) {
  return (
    <Link
      href={href}
      className="block rounded border p-3 bg-[color:var(--surface)] hover:border-[color:var(--accent)] transition-colors"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="text-sm">{title}</div>
      <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{hint}</div>
    </Link>
  )
}
