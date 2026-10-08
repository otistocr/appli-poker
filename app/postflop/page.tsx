"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import FeltHeader from "@/components/FeltHeader"
import {
  classifyFlop,
  suitSymbol,
  suitColor,
  type Card,
  type Rank,
  type Suit,
} from "@/lib/postflop/classify"
import { recommendCBet, type CBetRole } from "@/lib/postflop/cbet"

const RANKS: Rank[] = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"]
const SUITS: Suit[] = ["s", "h", "d", "c"]

const ROLES: { value: CBetRole; label: string }[] = [
  { value: "opener_ip", label: "Opener IP" },
  { value: "opener_oop", label: "Opener OOP" },
  { value: "3bettor_ip", label: "3-better IP" },
  { value: "3bettor_oop", label: "3-better OOP" },
]

const SUGGESTED_FLOPS: { label: string; cards: [Card, Card, Card] }[] = [
  {
    label: "A♠ 7♦ 2♣ — dry high",
    cards: [
      { rank: "A", suit: "s" }, { rank: "7", suit: "d" }, { rank: "2", suit: "c" },
    ],
  },
  {
    label: "K♠ 8♥ 3♦ — dry high",
    cards: [
      { rank: "K", suit: "s" }, { rank: "8", suit: "h" }, { rank: "3", suit: "d" },
    ],
  },
  {
    label: "9♠ 8♥ 7♦ — wet connected",
    cards: [
      { rank: "9", suit: "s" }, { rank: "8", suit: "h" }, { rank: "7", suit: "d" },
    ],
  },
  {
    label: "T♥ 9♥ 6♥ — monotone",
    cards: [
      { rank: "T", suit: "h" }, { rank: "9", suit: "h" }, { rank: "6", suit: "h" },
    ],
  },
  {
    label: "K♠ K♥ 4♦ — paired",
    cards: [
      { rank: "K", suit: "s" }, { rank: "K", suit: "h" }, { rank: "4", suit: "d" },
    ],
  },
  {
    label: "8♥ 8♦ 8♠ — trips",
    cards: [
      { rank: "8", suit: "h" }, { rank: "8", suit: "d" }, { rank: "8", suit: "s" },
    ],
  },
]

export default function PostflopPage() {
  const [cards, setCards] = useState<(Card | null)[]>([null, null, null])
  const [role, setRole] = useState<CBetRole>("opener_ip")

  const canAnalyze = cards.every((c) => c !== null)
  const texture = useMemo(() => {
    if (!canAnalyze) return null
    try {
      return classifyFlop(cards as Card[])
    } catch {
      return null
    }
  }, [cards, canAnalyze])

  const rec = useMemo(() => (texture ? recommendCBet(texture, role) : null), [texture, role])

  const setCard = (idx: number, card: Card | null) => {
    const next = [...cards]
    next[idx] = card
    setCards(next)
  }

  const applyPreset = (preset: (typeof SUGGESTED_FLOPS)[number]) => {
    setCards([...preset.cards])
  }

  const clearAll = () => setCards([null, null, null])

  const randomFlop = () => {
    const deck: Card[] = []
    for (const r of RANKS) for (const s of SUITS) deck.push({ rank: r, suit: s })
    const picked: Card[] = []
    while (picked.length < 3) {
      const idx = Math.floor(Math.random() * deck.length)
      picked.push(deck.splice(idx, 1)[0])
    }
    setCards(picked)
  }

  return (
    <main className="min-h-screen">
      <FeltHeader current="Postflop" suit="♣" />
      <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6 py-8">
        <header className="space-y-2">
          <div
            className="flex items-center gap-3 text-xs uppercase tracking-widest"
            style={{ color: "var(--accent)" }}
          >
            <span className="text-lg">♣</span>
            <span>Postflop</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Analyseur de flop
          </h1>
          <p
            className="text-sm max-w-xl leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Choisis 3 cartes de flop, l&apos;app classifie la texture (dry/wet, paired,
            monotone, connectivity) et donne la fréquence et le sizing de c-bet recommandés.
            Basé sur des heuristiques du solveur, pas de la GTO exacte.
          </p>
          <div className="pt-3">
            <Link
              href="/postflop/trainer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold px-4 py-2 border"
              style={{
                background: "var(--accent)",
                color: "var(--bg-deep)",
                borderColor: "var(--accent)",
                letterSpacing: "0.2em",
              }}
            >
              ♣ Trainer c-bet →
            </Link>
          </div>
        </header>

        {/* Suggested flops */}
        <section className="space-y-2">
          <div
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            Exemples rapides
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_FLOPS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 text-xs border transition-colors"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={randomFlop}
              className="px-3 py-1.5 text-xs border transition-colors font-medium"
              style={{
                borderColor: "var(--accent)",
                background: "var(--accent)",
                color: "var(--bg-deep)",
              }}
            >
              ♦ Flop aléatoire
            </button>
            <button
              onClick={clearAll}
              className="px-3 py-1.5 text-xs border transition-colors"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              Effacer
            </button>
          </div>
        </section>

        {/* Card pickers */}
        <section className="space-y-3">
          <div
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            Ton flop
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[0, 1, 2].map((idx) => (
              <CardPicker
                key={idx}
                card={cards[idx]}
                onChange={(c) => setCard(idx, c)}
                disabledPairs={cards.filter((_, i) => i !== idx).filter(Boolean) as Card[]}
              />
            ))}
          </div>
        </section>

        {/* Role selector */}
        <section className="space-y-2">
          <div
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            Ton rôle préflop
          </div>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => {
              const isCurrent = role === r.value
              return (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className="px-3 py-2 text-xs font-medium border transition-colors"
                  style={{
                    background: isCurrent ? "var(--accent)" : "transparent",
                    color: isCurrent ? "var(--bg-deep)" : "var(--text-secondary)",
                    borderColor: isCurrent ? "var(--accent)" : "var(--border)",
                  }}
                >
                  {r.label}
                </button>
              )
            })}
          </div>
        </section>

        {/* Analysis */}
        {texture && rec ? (
          <>
            <section className="space-y-4">
              <div
                className="text-xs uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Classification
              </div>
              <div className="flex flex-wrap gap-2">
                <Tag label="Highness" value={humanize(texture.highness)} />
                <Tag label="Pairing" value={humanize(texture.pairing)} />
                <Tag label="Suits" value={humanize(texture.suitedness)} />
                <Tag label="Connectivity" value={humanize(texture.connectedness)} />
                <Tag
                  label="Overall"
                  value={humanize(texture.overall)}
                  strong
                  color={
                    texture.overall === "wet"
                      ? "var(--heart-red)"
                      : texture.overall === "semi_wet"
                        ? "var(--accent)"
                        : "#6cb98d"
                  }
                />
              </div>
            </section>

            <section
              className="border p-6 space-y-5"
              style={{
                borderColor: "var(--accent)",
                background: "color-mix(in srgb, var(--accent) 6%, var(--bg-deep))",
              }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div
                    className="text-xs uppercase tracking-widest mb-2"
                    style={{ color: "var(--accent)" }}
                  >
                    Recommandation c-bet
                  </div>
                  <div className="flex items-baseline gap-6">
                    <div>
                      <div
                        className="text-4xl sm:text-5xl font-semibold tabular-nums"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {rec.frequency}%
                      </div>
                      <div
                        className="text-[10px] uppercase tracking-widest"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Fréquence
                      </div>
                    </div>
                    <div>
                      <div
                        className="text-lg font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {rec.sizingPct}
                      </div>
                      <div
                        className="text-[10px] uppercase tracking-widest"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Sizing
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div
                    className="text-[10px] uppercase tracking-widest mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Range advantage
                  </div>
                  <div
                    className="text-sm font-medium"
                    style={{
                      color:
                        rec.rangeAdvantage === "us"
                          ? "#6cb98d"
                          : rec.rangeAdvantage === "them"
                            ? "var(--heart-red)"
                            : "var(--accent)",
                    }}
                  >
                    {rec.rangeAdvantage === "us"
                      ? "Toi"
                      : rec.rangeAdvantage === "them"
                        ? "Adverse"
                        : "Neutre"}
                  </div>
                </div>
              </div>

              <div
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              >
                {rec.rationale}
              </div>

              <div
                className="pt-4 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="text-[10px] uppercase tracking-widest mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Candidats bluff
                </div>
                <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {rec.bluffCandidates}
                </div>
              </div>
            </section>
          </>
        ) : (
          <div
            className="p-6 border text-sm"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--text-secondary)",
            }}
          >
            Sélectionne 3 cartes distinctes pour analyser le flop.
          </div>
        )}
      </div>
    </main>
  )
}

function humanize(str: string): string {
  return str.replace(/_/g, "-")
}

function Tag({
  label,
  value,
  strong,
  color,
}: {
  label: string
  value: string
  strong?: boolean
  color?: string
}) {
  return (
    <div
      className="px-3 py-2 border text-xs"
      style={{
        borderColor: color ?? "var(--border)",
        color: color ?? "var(--text-secondary)",
        fontWeight: strong ? 700 : 500,
      }}
    >
      <span style={{ color: "var(--text-muted)", marginRight: 6 }}>{label}</span>
      <span style={{ textTransform: "capitalize" }}>{value}</span>
    </div>
  )
}

function CardPicker({
  card,
  onChange,
  disabledPairs,
}: {
  card: Card | null
  onChange: (c: Card | null) => void
  disabledPairs: Card[]
}) {
  const isDisabled = (r: Rank, s: Suit) =>
    disabledPairs.some((c) => c.rank === r && c.suit === s)

  // Drive picker state from the card prop (single source of truth)
  const selectedRank = card?.rank ?? null
  const selectedSuit = card?.suit ?? null

  const commit = (r: Rank | null, s: Suit | null) => {
    if (r && s) onChange({ rank: r, suit: s })
    else onChange(null)
  }

  return (
    <div
      className="border p-3 space-y-2"
      style={{
        borderColor: card ? "var(--accent)" : "var(--border)",
        background: "var(--surface)",
      }}
    >
      {/* Card preview */}
      <div
        className="w-full aspect-[3/4] flex flex-col items-center justify-center relative"
        style={{
          background: card ? "#f0e5c8" : "transparent",
          border: card ? "none" : `1px dashed var(--border)`,
          color: card ? (suitColor(card.suit) === "red" ? "#b22a1e" : "#1a1a1a") : "var(--text-muted)",
        }}
      >
        {card ? (
          <>
            <div
              className="text-5xl font-bold decorative leading-none"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {card.rank}
            </div>
            <div className="text-6xl leading-none mt-1">{suitSymbol(card.suit)}</div>
          </>
        ) : (
          <div className="text-xs uppercase tracking-widest">Vide</div>
        )}
      </div>

      {/* Rank picker */}
      <div
        className="grid gap-0.5"
        style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}
      >
        {RANKS.map((r) => (
          <button
            key={r}
            onClick={() => {
              const newR = selectedRank === r ? null : r
              commit(newR, selectedSuit)
            }}
            className="text-[10px] font-bold py-1 border"
            style={{
              background: selectedRank === r ? "var(--accent)" : "transparent",
              color: selectedRank === r ? "var(--bg-deep)" : "var(--text-secondary)",
              borderColor: selectedRank === r ? "var(--accent)" : "var(--border)",
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Suit picker */}
      <div className="grid grid-cols-4 gap-0.5">
        {SUITS.map((s) => {
          const disabled = selectedRank ? isDisabled(selectedRank, s) : false
          const isCurrent = selectedSuit === s
          return (
            <button
              key={s}
              onClick={() => {
                if (disabled) return
                const newS = selectedSuit === s ? null : s
                commit(selectedRank, newS)
              }}
              disabled={disabled}
              className="text-lg py-1.5 border"
              style={{
                background: isCurrent ? "var(--accent)" : "transparent",
                color: isCurrent
                  ? "var(--bg-deep)"
                  : suitColor(s) === "red"
                    ? "var(--heart-red)"
                    : "var(--text-primary)",
                borderColor: isCurrent ? "var(--accent)" : "var(--border)",
                opacity: disabled ? 0.3 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
              }}
            >
              {suitSymbol(s)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
