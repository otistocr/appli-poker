"use client"

import Link from "next/link"

// Dark felt table poker : deep green, gold accents, playing card motifs, chip-inspired buttons

const FELT = "#0d3b2e"
const FELT_DEEP = "#08281f"
const GOLD = "#d4a53f"
const GOLD_SOFT = "rgba(212, 165, 63, 0.15)"
const CREAM = "#ecdcb2"
const RULE = "rgba(212, 165, 63, 0.25)"

const HAND_MINI = [
  ["A", "♠", "K", "♠"],
  ["Q", "♥", "Q", "♦"],
]

export default function FeltVariant() {
  return (
    <div
      style={{
        background: `radial-gradient(ellipse at top, ${FELT} 0%, ${FELT_DEEP} 100%)`,
        color: CREAM,
        fontFamily: "-apple-system, 'Inter', 'Helvetica Neue', sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* Top bar */}
      <header
        className="border-b sticky top-0 z-40 backdrop-blur"
        style={{ borderColor: RULE, background: `${FELT_DEEP}cc` }}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Chip logo */}
            <div className="relative">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                style={{
                  background: GOLD,
                  borderColor: CREAM,
                  color: FELT_DEEP,
                }}
              >
                <span className="font-black text-sm">♠</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-bold tracking-wide" style={{ color: CREAM }}>
                appli poker
              </div>
              <div className="text-[10px]" style={{ color: GOLD }}>
                Cash 6-max · 100bb
              </div>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-xs uppercase tracking-widest">
            <Link href="/charts" style={{ color: CREAM }}>Ranges</Link>
            <Link href="/trainer" style={{ color: CREAM }}>Drill</Link>
            <Link href="/academie" style={{ color: CREAM }}>Cours</Link>
            <Link href="/hh" style={{ color: CREAM }}>Hand history</Link>
          </nav>
          <Link
            href="/v"
            className="text-xs"
            style={{ color: GOLD, opacity: 0.7 }}
          >
            autres variantes
          </Link>
        </div>
      </header>

      {/* Hero — cards in hand + welcome */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-[1fr_240px] gap-12 items-center">
        <div>
          <div
            className="text-xs uppercase mb-4"
            style={{ color: GOLD, letterSpacing: "0.3em" }}
          >
            ♠ ♥ ♦ ♣  ·  Bienvenue à la table
          </div>
          <h1
            className="text-4xl sm:text-6xl font-bold leading-[1.05] mb-5 tracking-tight text-balance"
            style={{ color: CREAM }}
          >
            Ta place à la table
            <br />
            <span style={{ color: GOLD }}>t&apos;attend.</span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-lg" style={{ color: "#c5b58c" }}>
            Ranges GTO, drill quotidien, cours structurés, analyse de tes mains. Tout ce
            qu&apos;il faut pour bosser ton préflop, sans compte, sans installation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ChipButton href="/trainer" primary>
              ♠ Débuter une session
            </ChipButton>
            <ChipButton href="/charts">Consulter les ranges</ChipButton>
          </div>
        </div>
        {/* Playing cards fan */}
        <div className="relative flex items-center justify-center h-56">
          <PlayingCard rank="A" suit="♠" rot={-16} tx={-30} />
          <PlayingCard rank="K" suit="♠" rot={-4} tx={-10} elevated />
        </div>
      </section>

      {/* Stats bar */}
      <section
        className="border-y"
        style={{ borderColor: RULE, background: FELT_DEEP }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <StatCol label="Ranges" value="18" />
          <StatCol label="Cours" value="10" />
          <StatCol label="Modes drill" value="3" />
          <StatCol label="Sessions" value="Local" />
        </div>
      </section>

      {/* Modules — card layout with chip motif */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div
          className="text-xs uppercase mb-6"
          style={{ color: GOLD, letterSpacing: "0.3em" }}
        >
          — Autour de la table —
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TableCard
            href="/charts"
            suit="♠"
            title="Charts GTO"
            meta="18 ranges préflop"
            desc="RFI, vs open, vs 3-bet, vs 4-bet. Filtre par action, position, profil adverse."
          />
          <TableCard
            href="/trainer"
            suit="♥"
            title="Drill"
            meta="3 modes"
            desc="Aléatoire, ciblé par position, ou rejeu des erreurs. Feedback immédiat."
          />
          <TableCard
            href="/academie"
            suit="♦"
            title="Académie"
            meta="10 chapitres"
            desc="Des maths du préflop au mental game. 7 heures de lecture rigoureuse."
          />
          <TableCard
            href="/hh"
            suit="♣"
            title="Hand history"
            meta="PokerStars / Winamax"
            desc="Colle une main, on analyse la décision vs la range GTO."
          />
          <TableCard
            href="/stats"
            suit="♠"
            title="Progression"
            meta="Heatmap 13×13"
            desc="Score, streak, top/pire spots. Local, jamais partagé."
          />
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t"
        style={{ borderColor: RULE }}
      >
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap justify-between text-xs" style={{ color: "#9d8e6a" }}>
          <div>♠ appli poker — table locale, aucun compte</div>
          <div>v1.0</div>
        </div>
      </footer>
    </div>
  )
}

function ChipButton({
  href,
  children,
  primary,
}: {
  href: string
  children: React.ReactNode
  primary?: boolean
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-transform hover:scale-105"
      style={
        primary
          ? {
              background: GOLD,
              color: FELT_DEEP,
              border: `2px solid ${CREAM}`,
              boxShadow: `0 4px 0 ${FELT_DEEP}`,
            }
          : {
              background: "transparent",
              color: CREAM,
              border: `2px solid ${CREAM}`,
            }
      }
    >
      {children}
    </Link>
  )
}

function StatCol({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="text-3xl font-bold tabular-nums"
        style={{ color: GOLD, fontFamily: "'Georgia', serif" }}
      >
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-widest mt-1" style={{ color: "#9d8e6a" }}>
        {label}
      </div>
    </div>
  )
}

function PlayingCard({
  rank,
  suit,
  rot,
  tx,
  elevated,
}: {
  rank: string
  suit: string
  rot: number
  tx: number
  elevated?: boolean
}) {
  const isRed = suit === "♥" || suit === "♦"
  return (
    <div
      className="absolute w-32 h-44 rounded-lg shadow-2xl"
      style={{
        background: CREAM,
        color: isRed ? "#b22a1e" : "#0d0d0d",
        transform: `translateX(${tx}px) rotate(${rot}deg) ${elevated ? "translateY(-8px)" : ""}`,
        border: `1px solid ${GOLD}80`,
      }}
    >
      <div className="p-3">
        <div className="text-3xl font-bold leading-none" style={{ fontFamily: "'Georgia', serif" }}>
          {rank}
        </div>
        <div className="text-2xl leading-none">{suit}</div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-90">
        {suit}
      </div>
      <div className="absolute bottom-3 right-3 rotate-180">
        <div className="text-3xl font-bold leading-none" style={{ fontFamily: "'Georgia', serif" }}>
          {rank}
        </div>
        <div className="text-2xl leading-none">{suit}</div>
      </div>
    </div>
  )
}

function TableCard({
  href,
  suit,
  title,
  meta,
  desc,
}: {
  href: string
  suit: string
  title: string
  meta: string
  desc: string
}) {
  const isRed = suit === "♥" || suit === "♦"
  return (
    <Link
      href={href}
      className="group block p-5 rounded-lg border transition-all hover:scale-[1.02]"
      style={{
        background: FELT_DEEP,
        borderColor: RULE,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="text-3xl leading-none"
          style={{ color: isRed ? "#c73a2c" : GOLD }}
        >
          {suit}
        </div>
        <div className="text-[10px] uppercase tracking-widest" style={{ color: "#9d8e6a" }}>
          {meta}
        </div>
      </div>
      <div className="text-xl font-bold mb-2" style={{ color: CREAM }}>
        {title}
      </div>
      <div className="text-sm leading-relaxed" style={{ color: "#b8a97e" }}>
        {desc}
      </div>
      <div
        className="mt-4 text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: GOLD }}
      >
        Entrer →
      </div>
    </Link>
  )
}
