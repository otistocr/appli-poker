"use client"

import Link from "next/link"
import { useState } from "react"

// Option C — Workspace focused, home comme espace de travail actif

const ALL_SECTIONS = [
  { href: "/charts", suit: "♠", title: "Ranges", desc: "74 charts préflop" },
  { href: "/trainer", suit: "♥", title: "Pratique préflop", desc: "3 modes de drill" },
  { href: "/postflop", suit: "♣", title: "Postflop", desc: "Analyseur + trainer" },
  { href: "/academie", suit: "♦", title: "Académie", desc: "10 chapitres" },
  { href: "/outils", suit: "♦", title: "Outils", desc: "5 calculateurs" },
  { href: "/hh", suit: "♣", title: "Hand history", desc: "Parser + comparaison" },
  { href: "/stats", suit: "♠", title: "Progression", desc: "Heatmap + spots" },
]

export default function OrgC() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main className="min-h-screen relative">
      {/* Ultra minimal top */}
      <header className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
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
          </div>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          className="flex items-center gap-2 text-xs uppercase tracking-widest px-3 py-1.5 border hover:bg-[color:var(--surface)]"
          style={{
            color: "var(--text-secondary)",
            borderColor: "var(--border)",
            letterSpacing: "0.2em",
          }}
        >
          <span>Toutes les sections</span>
          <span>+</span>
        </button>
      </header>

      {/* Workspace focused on today's session */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-16">
        <div
          className="text-xs uppercase tracking-widest mb-3"
          style={{ color: "var(--accent)", letterSpacing: "0.3em" }}
        >
          Vendredi 12 juillet · Silver · 1 842 pts
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1] mb-3">
          Ta session du jour t&apos;attend.
        </h1>
        <p className="text-lg max-w-xl mb-10" style={{ color: "var(--text-secondary)" }}>
          20 mains recommandées basées sur tes derniers spots faibles (BB vs UTG, CO vs 3-bet).
        </p>

        {/* Primary action + secondary */}
        <div className="flex flex-wrap gap-4 mb-16">
          <Link href="/trainer" className="chip-btn">
            Commencer les 20 mains
          </Link>
          <Link href="/postflop/trainer" className="chip-btn chip-btn-ghost">
            Ou plutôt postflop
          </Link>
        </div>

        {/* Ta progression du jour */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          <MetricBlock label="Streak" value="8" sub="best 22" />
          <MetricBlock label="Précision (7j)" value="74%" sub="+2 vs sem dernière" />
          <MetricBlock label="Mains cette semaine" value="342" sub="objectif 500" />
        </div>

        {/* En marche */}
        <div>
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
              detail="Chapitre 3 · reprise à la section 4/6"
              progress={62}
            />
            <RunningItem
              href="/trainer"
              title="Drill BB vs open"
              detail="8 mains sur cette range hier"
              progress={40}
            />
          </div>
        </div>
      </div>

      {/* Overlay menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="max-w-2xl w-full p-8"
            style={{ background: "var(--bg-deep)", border: `1px solid var(--border)` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-baseline justify-between mb-6">
              <div className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Toutes les sections
              </div>
              <button onClick={() => setMenuOpen(false)} style={{ color: "var(--text-muted)" }}>
                ✕
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {ALL_SECTIONS.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="flex items-center gap-3 p-3 hover:bg-[color:var(--surface)] transition-colors"
                >
                  <div className="text-xl" style={{ color: "var(--accent)" }}>{s.suit}</div>
                  <div>
                    <div className="text-sm font-medium">{s.title}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        className="fixed bottom-3 left-3 text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        <Link href="/org" className="hover:text-[color:var(--accent)]">← autres options</Link>
      </div>
    </main>
  )
}

function MetricBlock({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <div
        className="text-[10px] uppercase tracking-widest mb-1"
        style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
      >
        {label}
      </div>
      <div className="text-3xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</div>
    </div>
  )
}

function RunningItem({
  href,
  title,
  detail,
  progress,
}: {
  href: string
  title: string
  detail: string
  progress: number
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
      <div className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>{detail}</div>
      <div className="h-0.5" style={{ background: "var(--surface-2)" }}>
        <div className="h-full" style={{ background: "var(--accent)", width: `${progress}%` }} />
      </div>
    </Link>
  )
}
