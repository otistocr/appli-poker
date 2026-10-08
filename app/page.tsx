"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { emptyStats, loadStats, type UserStats } from "@/lib/storage"
import { getLevel, progressToNext } from "@/lib/level"

export default function Home() {
  const [stats, setStats] = useState<UserStats>(emptyStats())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setStats(loadStats())
    setLoaded(true)
  }, [])

  const isReturning = loaded && stats.total_hands > 0
  const level = getLevel(stats.score)
  const accuracy =
    stats.total_hands > 0
      ? Math.round((stats.correct / stats.total_hands) * 100)
      : 0
  const progress = progressToNext(stats.score)

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <header
        className="border-b sticky top-0 z-40 backdrop-blur"
        style={{
          borderColor: "var(--border)",
          background: "color-mix(in srgb, var(--bg-deep) 85%, transparent)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
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
            <span className="font-semibold tracking-tight">appli poker</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest">
            <Link href="/charts" style={{ color: "var(--text-secondary)" }}>Ranges</Link>
            <Link href="/postflop" style={{ color: "var(--text-secondary)" }}>Postflop</Link>
            <Link href="/academie" style={{ color: "var(--text-secondary)" }}>Académie</Link>
            <Link href="/trainer" style={{ color: "var(--text-secondary)" }}>Pratique</Link>
            <Link href="/hh" style={{ color: "var(--text-secondary)" }}>HH</Link>
            <Link href="/stats" style={{ color: "var(--text-secondary)" }}>Stats</Link>
          </nav>
        </div>
      </header>

      {/* HERO — un seul message, une seule action */}
      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-10">
        <div
          className="text-xs uppercase tracking-widest mb-5"
          style={{ color: "var(--accent)", letterSpacing: "0.3em" }}
        >
          Cash 6-max · 100bb
        </div>
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05] mb-6 text-balance max-w-4xl">
          Bosse ton{" "}
          <span style={{ color: "var(--accent)" }}>préflop</span>
          <br />
          comme un pro.
        </h1>
        <p
          className="text-lg leading-relaxed max-w-xl"
          style={{ color: "var(--text-secondary)" }}
        >
          Ranges GTO, drill quotidien, cours structurés. Aucun compte, aucune installation,
          tout est local.
        </p>
      </section>

      {/* MAIN AREA — 2 columns */}
      <section className="max-w-6xl mx-auto px-6 pb-16 grid lg:grid-cols-[1.5fr_1fr] gap-12">
        {/* LEFT — context : progression or getting started */}
        <div>
          {isReturning ? (
            <ProgressionBlock
              level={level.name}
              score={stats.score}
              progress={progress}
              streak={stats.streak}
              bestStreak={stats.best_streak}
              accuracy={accuracy}
              hands={stats.total_hands}
            />
          ) : (
            <GettingStarted />
          )}
        </div>

        {/* RIGHT — sections list */}
        <div>
          <div
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
          >
            Naviguer
          </div>
          <div
            className="border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <NavRow href="/charts" suit="♠" title="Ranges" meta="74 charts GTO préflop" />
            <NavRow href="/postflop" suit="♣" title="Postflop" meta="Analyseur de flop, c-bet" />
            <NavRow href="/academie" suit="♦" title="Académie" meta="10 chapitres à lire" />
            <NavRow href="/trainer" suit="♥" title="Pratique" meta="Drill adaptatif, 3 modes" />
            <NavRow href="/outils" suit="♦" title="Outils" meta="Pot odds, MDF, combos, equity" />
            <NavRow href="/hh" suit="♣" title="Hand history" meta="PokerStars, Winamax" />
            <NavRow href="/stats" suit="♠" title="Progression" meta="Heatmap et spots" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap justify-between text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <div>♠ appli poker · table locale, aucun compte</div>
          <div>v1.0</div>
        </div>
      </footer>
    </main>
  )
}

/* ============================================================
   Progression block — pour joueur qui revient
   ============================================================ */
function ProgressionBlock({
  level,
  score,
  progress,
  streak,
  bestStreak,
  accuracy,
  hands,
}: {
  level: string
  score: number
  progress: number
  streak: number
  bestStreak: number
  accuracy: number
  hands: number
}) {
  return (
    <div>
      <div
        className="text-xs uppercase tracking-widest mb-4"
        style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
      >
        Ton avancée
      </div>

      {/* Big level card */}
      <div
        className="border p-6 mb-4"
        style={{
          borderColor: "var(--accent)",
          background: "color-mix(in srgb, var(--accent) 6%, var(--bg-deep))",
        }}
      >
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div
              className="text-[10px] uppercase tracking-widest"
              style={{ color: "var(--accent)", letterSpacing: "0.25em" }}
            >
              Niveau actuel
            </div>
            <div
              className="text-3xl font-semibold mt-1"
              style={{ color: "var(--text-primary)" }}
            >
              {level}
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-[10px] uppercase tracking-widest"
              style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
            >
              Score
            </div>
            <div className="text-2xl font-semibold tabular-nums mt-1">{score}</div>
          </div>
        </div>
        <div
          className="h-1 mt-4"
          style={{ background: "var(--surface-2)" }}
        >
          <div
            className="h-full"
            style={{ background: "var(--accent)", width: `${progress}%` }}
          />
        </div>
        <div
          className="text-[10px] uppercase tracking-widest mt-2"
          style={{ color: "var(--text-muted)" }}
        >
          {progress}% vers le niveau suivant
        </div>
      </div>

      {/* Mini metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <MiniStat label="Streak" value={streak} sub={`best ${bestStreak}`} />
        <MiniStat label="Précision" value={`${accuracy}%`} />
        <MiniStat label="Mains" value={hands} />
      </div>

      {/* Primary CTA */}
      <Link href="/trainer" className="chip-btn w-full justify-center">
        Reprendre le drill
      </Link>

      <div className="mt-6 flex items-center gap-4">
        <Link
          href="/stats"
          className="text-xs uppercase tracking-widest hover:opacity-80"
          style={{ color: "var(--text-secondary)", letterSpacing: "0.2em" }}
        >
          Ta heatmap →
        </Link>
        <Link
          href="/academie"
          className="text-xs uppercase tracking-widest hover:opacity-80"
          style={{ color: "var(--text-secondary)", letterSpacing: "0.2em" }}
        >
          Un cours →
        </Link>
      </div>
    </div>
  )
}

function MiniStat({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div>
      <div
        className="text-[10px] uppercase tracking-widest"
        style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
      >
        {label}
      </div>
      <div className="text-xl font-semibold tabular-nums mt-1">{value}</div>
      {sub && (
        <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
          {sub}
        </div>
      )}
    </div>
  )
}

/* ============================================================
   Getting started — pour première visite
   ============================================================ */
function GettingStarted() {
  const steps = [
    {
      n: "01",
      title: "Consulte les ranges",
      desc: "Ouvre les charts GTO pour te familiariser avec les fréquences par position.",
      href: "/charts",
      cta: "Ouvrir les charts",
    },
    {
      n: "02",
      title: "Lis un chapitre",
      desc: "Commence par « Les mathématiques du poker » pour poser les bases.",
      href: "/academie/mathematiques",
      cta: "Lire le chapitre",
    },
    {
      n: "03",
      title: "Lance ton premier drill",
      desc: "Une session courte de 10 mains suffit à sentir la différence.",
      href: "/trainer",
      cta: "Démarrer le drill",
    },
  ]

  return (
    <div>
      <div
        className="text-xs uppercase tracking-widest mb-4"
        style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
      >
        Comment démarrer
      </div>

      <div className="space-y-4">
        {steps.map((s, i) => (
          <Link
            key={s.n}
            href={s.href}
            className="group flex gap-5 py-5 border-b hover:pl-2 transition-all"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="text-3xl font-semibold tabular-nums shrink-0 decorative"
              style={{ color: i === 0 ? "var(--accent)" : "var(--text-muted)" }}
            >
              {s.n}
            </div>
            <div className="flex-1">
              <div className="text-lg font-medium tracking-tight mb-1">{s.title}</div>
              <div
                className="text-sm leading-relaxed mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {s.desc}
              </div>
              <div
                className="text-[10px] uppercase tracking-widest"
                style={{ color: "var(--accent)", letterSpacing: "0.25em" }}
              >
                {s.cta} →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

/* ============================================================
   Nav row — sidebar right
   ============================================================ */
function NavRow({
  href,
  suit,
  title,
  meta,
}: {
  href: string
  suit: string
  title: string
  meta: string
}) {
  const isRed = suit === "♥" || suit === "♦"
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 py-4 border-b hover:pl-2 transition-all"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="text-xl w-6 shrink-0"
        style={{ color: isRed ? "var(--heart-red)" : "var(--accent)" }}
      >
        {suit}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-base font-medium tracking-tight">{title}</div>
        <div
          className="text-xs mt-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          {meta}
        </div>
      </div>
      <div
        className="opacity-0 group-hover:opacity-100 transition-opacity text-sm"
        style={{ color: "var(--accent)" }}
      >
        →
      </div>
    </Link>
  )
}
