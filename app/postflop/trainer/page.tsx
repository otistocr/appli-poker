"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import FeltHeader from "@/components/FeltHeader"
import {
  classifyFlop,
  suitSymbol,
  suitColor,
  type Card,
  type Rank,
  type Suit,
} from "@/lib/postflop/classify"
import {
  recommendCBet,
  recommendTurn,
  recommendRiver,
  type CBetRole,
  type CBetRecommendation,
} from "@/lib/postflop/cbet"

const RANKS: Rank[] = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"]
const SUITS: Suit[] = ["s", "h", "d", "c"]

const ROLES: { value: CBetRole; label: string; context: string }[] = [
  { value: "opener_ip", label: "Opener IP", context: "Tu as ouvert, l'adversaire a call. En position." },
  { value: "opener_oop", label: "Opener OOP", context: "Tu as ouvert, l'adversaire a call. Hors position." },
  { value: "3bettor_ip", label: "3-better IP", context: "Tu as 3-bet en position (BTN vs early)." },
  { value: "3bettor_oop", label: "3-better OOP", context: "Tu as 3-bet hors position (BB vs BTN)." },
]

type Street = "flop" | "turn" | "river"

type PlayerAction = "check" | "bet_small" | "bet_medium" | "bet_large"

interface Feedback {
  played: PlayerAction
  correct: boolean
  points: number
  frequency: number
  sizingLabel: string
  rationale: string
}

interface Spot {
  hero: [Card, Card]
  flop: [Card, Card, Card]
  turn?: Card
  river?: Card
  role: CBetRole
}

function drawSpot(street: Street): Spot {
  const deck: Card[] = []
  for (const r of RANKS) for (const s of SUITS) deck.push({ rank: r, suit: s })
  const picked: Card[] = []
  const cardsNeeded = 2 + 3 + (street === "turn" || street === "river" ? 1 : 0) + (street === "river" ? 1 : 0)
  while (picked.length < cardsNeeded) {
    const idx = Math.floor(Math.random() * deck.length)
    picked.push(deck.splice(idx, 1)[0])
  }
  const hero: [Card, Card] = [picked[0], picked[1]]
  const flop: [Card, Card, Card] = [picked[2], picked[3], picked[4]]
  const turn = cardsNeeded > 5 ? picked[5] : undefined
  const river = cardsNeeded > 6 ? picked[6] : undefined
  const role = ROLES[Math.floor(Math.random() * ROLES.length)].value
  return { hero, flop, turn, river, role }
}

export default function PostflopTrainerPage() {
  const [street, setStreet] = useState<Street>("flop")
  const [spot, setSpot] = useState<Spot | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [hands, setHands] = useState(0)
  const [correct, setCorrect] = useState(0)

  // Initial draw
  useEffect(() => {
    setSpot(drawSpot(street))
  }, [street])

  const rec: CBetRecommendation | null = useMemo(() => {
    if (!spot) return null
    if (street === "flop") return recommendCBet(classifyFlop(spot.flop), spot.role)
    if (street === "turn" && spot.turn) return recommendTurn(spot.flop, spot.turn, spot.role)
    if (street === "river" && spot.turn && spot.river)
      return recommendRiver(spot.flop, spot.turn, spot.river, spot.role)
    return null
  }, [spot, street])

  const currentRoleContext = spot
    ? ROLES.find((r) => r.value === spot.role)?.context ?? ""
    : ""

  const nextSpot = useCallback(() => {
    setSpot(drawSpot(street))
    setFeedback(null)
  }, [street])

  const changeStreet = (s: Street) => {
    setStreet(s)
    setFeedback(null)
    setSpot(drawSpot(s))
  }

  const handleAction = useCallback(
    (action: PlayerAction) => {
      if (!rec || feedback) return

      const shouldBet = rec.frequency >= 50
      const shouldCheck = rec.frequency <= 50
      const preferredSizing: PlayerAction =
        rec.sizing === "small"
          ? "bet_small"
          : rec.sizing === "medium"
            ? "bet_medium"
            : "bet_large"

      let ok = false
      if (action === "check") ok = shouldCheck
      else ok = shouldBet && action === preferredSizing

      const partial =
        !ok &&
        shouldBet &&
        (action === "bet_small" || action === "bet_medium" || action === "bet_large")

      const points = ok ? 10 : partial ? 3 : -5

      setScore((s) => Math.max(0, s + points))
      setStreak((st) => (ok ? st + 1 : 0))
      setHands((h) => h + 1)
      setCorrect((c) => c + (ok ? 1 : 0))

      setFeedback({
        played: action,
        correct: ok,
        points,
        frequency: rec.frequency,
        sizingLabel: rec.sizingPct,
        rationale: rec.rationale,
      })
    },
    [rec, feedback]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (feedback) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault()
          nextSpot()
        }
        return
      }
      if (!rec) return
      const k = e.key.toLowerCase()
      if (k === "x" || k === "c") handleAction("check")
      else if (k === "1") handleAction("bet_small")
      else if (k === "2") handleAction("bet_medium")
      else if (k === "3") handleAction("bet_large")
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [handleAction, feedback, nextSpot, rec])

  const accuracy = hands > 0 ? Math.round((correct / hands) * 100) : 0

  const boardCards: Card[] = spot
    ? [
        ...spot.flop,
        ...(street === "turn" || street === "river" ? [spot.turn!] : []),
        ...(street === "river" ? [spot.river!] : []),
      ]
    : []

  return (
    <main className="min-h-screen">
      <FeltHeader current="Postflop" suit="♣" />
      <div className="max-w-3xl mx-auto space-y-6 px-4 sm:px-6 py-8">
        <nav className="text-xs">
          <Link
            href="/postflop"
            style={{ color: "var(--text-muted)" }}
            className="hover:opacity-80"
          >
            ← Analyseur de flop
          </Link>
        </nav>

        <header>
          <div
            className="flex items-center gap-3 text-xs uppercase tracking-widest mb-2"
            style={{ color: "var(--accent)" }}
          >
            <span className="text-lg">♣</span>
            <span>Pratique postflop</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Trainer c-bet
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
            Choisis la street à travailler. Chaque main : flop (+ turn / river) au hasard,
            décide check/bet-33%/bet-66%/overbet. Raccourcis : X ou C · 1 · 2 · 3.
          </p>
        </header>

        {/* Street selector */}
        <section className="flex gap-2">
          {(["flop", "turn", "river"] as Street[]).map((s) => {
            const isCurrent = street === s
            return (
              <button
                key={s}
                onClick={() => changeStreet(s)}
                className="px-4 py-2 text-xs uppercase font-semibold tracking-widest border transition-colors flex-1"
                style={{
                  background: isCurrent ? "var(--accent)" : "transparent",
                  color: isCurrent ? "var(--bg-deep)" : "var(--text-secondary)",
                  borderColor: isCurrent ? "var(--accent)" : "var(--border)",
                  letterSpacing: "0.2em",
                }}
              >
                {s}
              </button>
            )
          })}
        </section>

        {/* Score */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCell label="Score" value={score} accent />
          <StatCell label="Streak" value={`${streak} 🔥`} />
          <StatCell label="Précision" value={`${accuracy}%`} />
          <StatCell label="Mains" value={hands} />
        </section>

        {/* Spot */}
        {spot && rec && (
          <section
            className="border p-5 sm:p-6 space-y-5"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <div>
              <div
                className="text-[10px] uppercase tracking-widest mb-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                Contexte
              </div>
              <div className="text-sm sm:text-base leading-snug">
                <span
                  className="font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  {ROLES.find((r) => r.value === spot.role)?.label}
                </span>
                {" · "}
                <span style={{ color: "var(--text-secondary)" }}>
                  {currentRoleContext} Tu es sur la <strong>{street}</strong>.
                </span>
              </div>
            </div>

            <div>
              <div
                className="text-[10px] uppercase tracking-widest mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Tes cartes
              </div>
              <div className="flex gap-3 justify-center py-2">
                {spot.hero.map((c, i) => (
                  <FlopCard key={i} card={c} />
                ))}
              </div>
            </div>

            <div>
              <div
                className="text-[10px] uppercase tracking-widest mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Le board
              </div>
              <div className="flex gap-2 justify-center py-2 flex-wrap">
                {boardCards.map((c, i) => (
                  <FlopCard
                    key={i}
                    card={c}
                    highlight={
                      (street === "turn" && i === 3) ||
                      (street === "river" && i === 4)
                    }
                  />
                ))}
              </div>
              <p
                className="text-xs italic text-center pt-2"
                style={{ color: "var(--text-muted)" }}
              >
                Décision <strong>range-based</strong> — s&apos;applique à toute ta range dans
                ce spot, tes cartes servent d&apos;ancrage.
              </p>
            </div>

            {!feedback ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <ActionBtn label="Check" symbol="=" sub="X" onClick={() => handleAction("check")} color="var(--text-primary)" />
                <ActionBtn label="Bet 33%" symbol="↑" sub="1" onClick={() => handleAction("bet_small")} color="#7ec49b" />
                <ActionBtn label="Bet 66%" symbol="↑↑" sub="2" onClick={() => handleAction("bet_medium")} color="var(--accent)" />
                <ActionBtn label="Overbet" symbol="↑↑↑" sub="3" onClick={() => handleAction("bet_large")} color="var(--heart-red)" />
              </div>
            ) : (
              <FeedbackPanel feedback={feedback} onNext={nextSpot} />
            )}
          </section>
        )}
      </div>
    </main>
  )
}

function StatCell({
  label,
  value,
  accent,
}: {
  label: string
  value: number | string
  accent?: boolean
}) {
  return (
    <div
      className="p-3 border"
      style={{
        borderColor: accent ? "var(--accent)" : "var(--border)",
        background: accent
          ? "color-mix(in srgb, var(--accent) 6%, var(--bg-deep))"
          : "var(--surface)",
      }}
    >
      <div
        className="text-[10px] uppercase tracking-widest"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </div>
      <div
        className="text-xl sm:text-2xl font-semibold tabular-nums mt-1"
        style={{ color: accent ? "var(--accent)" : "var(--text-primary)" }}
      >
        {value}
      </div>
    </div>
  )
}

function FlopCard({ card, highlight }: { card: Card; highlight?: boolean }) {
  const isRed = suitColor(card.suit) === "red"
  return (
    <div
      className="w-16 h-24 sm:w-20 sm:h-28 rounded flex flex-col justify-between p-2 relative"
      style={{
        background: "#f0e5c8",
        color: isRed ? "#b22a1e" : "#1a1a1a",
        border: highlight ? "2px solid var(--accent)" : "1px solid rgba(212, 165, 63, 0.6)",
        boxShadow: highlight
          ? "0 0 12px rgba(212, 165, 63, 0.4)"
          : "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <div
        className="text-xl font-bold leading-none decorative"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {card.rank}
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-4xl">
        {suitSymbol(card.suit)}
      </div>
      <div className="text-xl font-bold leading-none decorative self-end rotate-180">
        {card.rank}
      </div>
    </div>
  )
}

function ActionBtn({
  label,
  symbol,
  sub,
  onClick,
  color,
}: {
  label: string
  symbol: string
  sub: string
  onClick: () => void
  color: string
}) {
  return (
    <button
      onClick={onClick}
      className="group relative min-h-16 transition active:translate-y-px flex flex-col items-center justify-center"
      style={{ background: "transparent", border: `1px solid ${color}`, color }}
    >
      <div className="flex items-center gap-2">
        <span className="opacity-80">{symbol}</span>
        <span className="text-sm sm:text-base font-medium tracking-wide uppercase">{label}</span>
      </div>
      <div
        className="absolute bottom-1 right-2 text-[9px] uppercase tracking-widest opacity-60"
        style={{ fontFamily: "SF Mono, monospace" }}
      >
        {sub}
      </div>
    </button>
  )
}

function FeedbackPanel({
  feedback,
  onNext,
}: {
  feedback: Feedback
  onNext: () => void
}) {
  const { correct, played, points, frequency, sizingLabel, rationale } = feedback
  const label =
    played === "check"
      ? "Check"
      : played === "bet_small"
        ? "Bet 33%"
        : played === "bet_medium"
          ? "Bet 66%"
          : "Overbet"

  return (
    <div
      className="p-4 space-y-3 border-l-2"
      style={{
        borderColor: correct ? "#6cb98d" : "var(--heart-red)",
        background: correct
          ? "rgba(108, 185, 141, 0.08)"
          : "rgba(212, 120, 98, 0.08)",
      }}
    >
      <div className="flex items-baseline justify-between">
        <div>
          <span
            className="text-lg font-bold"
            style={{ color: correct ? "#6cb98d" : "var(--heart-red)" }}
          >
            {correct ? "✓ Correct" : points > 0 ? "◦ Partiel" : "✗ Incorrect"}
          </span>
          <span className="ml-3 text-sm" style={{ color: "var(--text-secondary)" }}>
            Tu as joué : <strong>{label}</strong>
          </span>
        </div>
        <div
          className="text-lg font-bold tabular-nums"
          style={{ color: correct ? "#6cb98d" : "var(--heart-red)" }}
        >
          {points >= 0 ? "+" : ""}
          {points} pts
        </div>
      </div>

      <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
        <strong style={{ color: "var(--accent)" }}>Recommandation</strong> :{" "}
        {frequency}% de bet à {sizingLabel}
      </div>

      <div className="text-sm leading-relaxed">{rationale}</div>

      <button
        onClick={onNext}
        className="mt-3 px-4 py-2 text-xs uppercase tracking-widest font-semibold border transition-colors"
        style={{
          background: "var(--accent)",
          color: "var(--bg-deep)",
          borderColor: "var(--accent)",
        }}
      >
        Suivant · [espace]
      </button>
    </div>
  )
}
