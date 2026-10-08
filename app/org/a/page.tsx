"use client"

import Link from "next/link"
import { useState } from "react"

// Option A — Nav groupée en 3 catégories dans le top bar

const GROUPS = [
  {
    key: "etude",
    label: "Étudier",
    suit: "♦",
    items: [
      { href: "/academie", title: "Académie", desc: "10 chapitres théoriques" },
      { href: "/outils", title: "Outils", desc: "Pot odds, MDF, combos, equity" },
    ],
  },
  {
    key: "jouer",
    label: "Jouer",
    suit: "♠",
    items: [
      { href: "/charts", title: "Ranges", desc: "74 charts GTO préflop" },
      { href: "/postflop", title: "Postflop", desc: "Analyseur de flop, c-bet" },
      { href: "/hh", title: "Hand history", desc: "Analyse d'une main jouée" },
    ],
  },
  {
    key: "entrainer",
    label: "S'entraîner",
    suit: "♥",
    items: [
      { href: "/trainer", title: "Pratique préflop", desc: "Drill préflop, 3 modes" },
      { href: "/postflop/trainer", title: "Pratique postflop", desc: "Flop / turn / river" },
      { href: "/stats", title: "Progression", desc: "Heatmap, streak, spots" },
    ],
  },
]

export default function OrgA() {
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  return (
    <main className="min-h-screen">
      {/* Nav groupée */}
      <header
        className="border-b sticky top-0 z-40 backdrop-blur"
        style={{
          borderColor: "var(--border)",
          background: "color-mix(in srgb, var(--bg-deep) 85%, transparent)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
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
            <span className="font-semibold tracking-tight">appli poker</span>
          </Link>
          <nav className="flex items-center gap-1 relative">
            {GROUPS.map((g) => (
              <div key={g.key} className="relative">
                <button
                  onMouseEnter={() => setOpenGroup(g.key)}
                  onMouseLeave={() => setOpenGroup(null)}
                  onClick={() => setOpenGroup(openGroup === g.key ? null : g.key)}
                  className="px-4 py-2 text-xs uppercase tracking-widest flex items-center gap-2"
                  style={{ color: openGroup === g.key ? "var(--accent)" : "var(--text-secondary)" }}
                >
                  <span>{g.suit}</span>
                  <span>{g.label}</span>
                </button>
                {openGroup === g.key && (
                  <div
                    onMouseEnter={() => setOpenGroup(g.key)}
                    onMouseLeave={() => setOpenGroup(null)}
                    className="absolute top-full right-0 min-w-64 border p-2 z-50"
                    style={{ background: "var(--bg-deep)", borderColor: "var(--border)" }}
                  >
                    {g.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-3 py-2 hover:bg-[color:var(--surface-2)] transition-colors"
                      >
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {item.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div
          className="text-xs uppercase tracking-widest mb-5"
          style={{ color: "var(--accent)", letterSpacing: "0.3em" }}
        >
          Cash 6-max · 100bb · GTO
        </div>
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05] mb-6 text-balance">
          Bosse ton{" "}
          <span style={{ color: "var(--accent)" }}>préflop</span>
          <br />
          comme un pro.
        </h1>
        <p className="text-lg leading-relaxed max-w-xl mb-10" style={{ color: "var(--text-secondary)" }}>
          Ranges GTO, drill quotidien, cours structurés. Aucun compte, aucune installation.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link href="/trainer" className="chip-btn">
            Démarrer une session
          </Link>
          <Link href="/charts" className="chip-btn chip-btn-ghost">
            Voir les ranges
          </Link>
        </div>
      </section>

      {/* Groups as 3 columns */}
      <section
        className="max-w-6xl mx-auto px-6 pb-16 grid md:grid-cols-3 gap-6 border-t pt-14"
        style={{ borderColor: "var(--border)" }}
      >
        {GROUPS.map((g) => (
          <div key={g.key}>
            <div
              className="flex items-center gap-3 text-xs uppercase tracking-widest mb-4"
              style={{ color: "var(--accent)", letterSpacing: "0.25em" }}
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
                  <div className="text-lg font-medium group-hover:text-[color:var(--accent)] transition-colors">
                    {item.title}
                  </div>
                  <div className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {item.desc}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div
        className="border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
          <span>Option A — Nav groupée</span>
          <Link href="/org" className="hover:text-[color:var(--accent)]">autres options</Link>
        </div>
      </div>
    </main>
  )
}
