"use client"

import Link from "next/link"

const GROUPS = [
  {
    label: "Étudier",
    suit: "♦",
    items: [
      { href: "/academie", title: "Académie", desc: "10 chapitres" },
      { href: "/outils", title: "Outils", desc: "5 calculateurs" },
    ],
  },
  {
    label: "Jouer",
    suit: "♠",
    items: [
      { href: "/charts", title: "Ranges", desc: "74 charts préflop" },
      { href: "/postflop", title: "Postflop", desc: "Analyseur de flop" },
      { href: "/hh", title: "Hand history", desc: "Analyse d'une main" },
    ],
  },
  {
    label: "S'entraîner",
    suit: "♥",
    items: [
      { href: "/trainer", title: "Pratique préflop", desc: "Drill adaptatif" },
      { href: "/postflop/trainer", title: "Pratique postflop", desc: "Flop / turn / river" },
      { href: "/stats", title: "Progression", desc: "Heatmap & spots" },
    ],
  },
]

export default function OrgMix() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar — from B, groups from A */}
      <aside
        className="w-56 shrink-0 border-r flex flex-col"
        style={{ borderColor: "var(--border)", background: "var(--bg-deep)" }}
      >
        {/* Workspace header */}
        <div
          className="p-4 border-b flex items-center gap-3"
          style={{ borderColor: "var(--border)" }}
        >
          <Link href="/" className="flex items-center gap-3">
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
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                Cash 6-max · 100bb
              </div>
            </div>
          </Link>
        </div>

        {/* Nav — 3 groups from A */}
        <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
          {GROUPS.map((g) => (
            <div key={g.label}>
              <div
                className="flex items-center gap-2 px-2 mb-2 text-[10px] uppercase tracking-widest"
                style={{ color: "var(--accent)", letterSpacing: "0.25em" }}
              >
                <span className="text-sm">{g.suit}</span>
                <span>{g.label}</span>
              </div>
              <div className="space-y-0.5">
                {g.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-2 py-1.5 rounded text-sm hover:bg-[color:var(--surface)] transition-colors group"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <div className="group-hover:text-[color:var(--text-primary)] transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {item.desc}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div
          className="p-3 border-t text-xs flex items-center justify-between"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
              style={{ background: "var(--surface-2)" }}
            >
              N
            </div>
            <span>neo</span>
          </div>
          <div>v1.0</div>
        </div>
      </aside>

      {/* Main workspace */}
      <main className="flex-1 min-w-0">
        {/* Slim top bar */}
        <header
          className="border-b h-12 px-6 flex items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            Home
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Silver · 1 842 pts
            </span>
            <button
              className="text-[10px] px-2 py-1 border rounded"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              ⌘K
            </button>
          </div>
        </header>

        {/* Content — focused home from B, denser like A */}
        <div className="max-w-5xl px-8 sm:px-12 py-12 sm:py-16">
          {/* Hero focused */}
          <div
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: "var(--accent)", letterSpacing: "0.3em" }}
          >
            Bon retour · streak 8 · précision 74%
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1] mb-3">
            Reprends là où tu t&apos;es arrêté.
          </h1>
          <p
            className="text-lg mb-10 max-w-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            20 mains recommandées basées sur tes derniers spots faibles. Une session courte
            suffit à maintenir ton niveau.
          </p>

          <div className="flex flex-wrap gap-3 mb-16">
            <Link href="/trainer" className="chip-btn">
              Commencer les 20 mains
            </Link>
            <Link href="/postflop/trainer" className="chip-btn chip-btn-ghost">
              Pratique postflop
            </Link>
          </div>

          {/* En marche — from C's idea, kept tight */}
          <section className="mb-16">
            <div
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
            >
              En marche
            </div>
            <div className="space-y-4">
              <RunningItem
                href="/academie/ranges"
                title="Penser en ranges"
                detail="Chapitre 3 · section 4/6"
                progress={62}
              />
              <RunningItem
                href="/trainer"
                title="Drill BB vs open"
                detail="18 mains sur cette range hier · 62% précision"
                progress={62}
                warn
              />
            </div>
          </section>

          {/* Quick access to 3 category rows */}
          <section>
            <div
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
            >
              Toutes tes sections
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {GROUPS.map((g) => (
                <div key={g.label}>
                  <div
                    className="flex items-center gap-2 text-xs uppercase tracking-widest mb-3"
                    style={{
                      color: "var(--accent)",
                      letterSpacing: "0.25em",
                    }}
                  >
                    <span className="text-base">{g.suit}</span>
                    <span>{g.label}</span>
                  </div>
                  <div className="space-y-3">
                    {g.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block group"
                      >
                        <div className="text-base font-medium group-hover:text-[color:var(--accent)] transition-colors">
                          {item.title}
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {item.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <div
        className="fixed bottom-3 left-3 text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        <Link href="/org" className="hover:text-[color:var(--accent)]">
          ← autres options
        </Link>
      </div>
    </div>
  )
}

function RunningItem({
  href,
  title,
  detail,
  progress,
  warn,
}: {
  href: string
  title: string
  detail: string
  progress: number
  warn?: boolean
}) {
  return (
    <Link
      href={href}
      className="block group py-3 border-t hover:pl-2 transition-all"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-baseline justify-between mb-1">
        <div className="text-base font-medium">{title}</div>
        <div
          className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: "var(--accent)" }}
        >
          Reprendre →
        </div>
      </div>
      <div
        className="text-sm mb-2"
        style={{ color: "var(--text-secondary)" }}
      >
        {detail}
      </div>
      <div className="h-0.5" style={{ background: "var(--surface-2)" }}>
        <div
          className="h-full"
          style={{
            background: warn ? "var(--heart-red)" : "var(--accent)",
            width: `${progress}%`,
          }}
        />
      </div>
    </Link>
  )
}
