"use client"

import { useState } from "react"
import {
  parseHand,
  heroPostflopRole,
  type ParsedHand,
  type ParsedStreet,
} from "@/lib/parser/pokerstars"
import { findChartLegacy as findChart } from "@/lib/ranges/manifest"
import { correctActions, primaryAction } from "@/lib/drill"
import { classifyFlop, suitSymbol, suitColor, type Card } from "@/lib/postflop/classify"
import { recommendCBet } from "@/lib/postflop/cbet"
import HandDisplay from "@/components/HandDisplay"
import FeltHeader from "@/components/FeltHeader"
import type { Action } from "@/types"

const SAMPLE_HAND = `PokerStars Hand #248765432101: Hold'em No Limit ($0.05/$0.10 USD) - 2024/01/15 20:15:00 ET
Table 'Verona II' 6-max Seat #3 is the button
Seat 1: Player1 ($9.85 in chips)
Seat 2: Player2 ($10.00 in chips)
Seat 3: Player3 ($15.42 in chips)
Seat 4: Hero ($12.30 in chips)
Seat 5: Player5 ($20.15 in chips)
Seat 6: Player6 ($8.50 in chips)
Player1: posts small blind $0.05
Player2: posts big blind $0.10
*** HOLE CARDS ***
Dealt to Hero [Ah Kh]
Player3: folds
Player4: raises $0.20 to $0.30
Player5: folds
Player6: folds
Player1: folds
Player2: calls $0.20
*** FLOP *** [Ks 8d 3c]
Player2: checks
Player4: bets $0.35
Player2: folds`

export default function HandHistoryPage() {
  const [text, setText] = useState("")
  const [parsed, setParsed] = useState<ParsedHand | null>(null)

  const analyze = () => {
    if (!text.trim()) return
    setParsed(parseHand(text))
  }

  return (
    <main className="min-h-screen">
      <FeltHeader current="Hand history" suit="♣" />
      <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 py-8">
        <header>
          <div
            className="flex items-center gap-3 text-xs uppercase tracking-widest mb-2"
            style={{ color: "var(--accent)" }}
          >
            <span className="text-lg">♣</span>
            <span>Analyse d&apos;une main</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Hand History</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Colle une main PokerStars ou Winamax. Analyse préflop (comparaison à la range GTO)
            + postflop (texture du board + recommandation c-bet).
          </p>
        </header>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              className="text-xs uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Texte de la main
            </label>
            <button
              onClick={() => setText(SAMPLE_HAND)}
              className="text-xs hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Charger un exemple
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Colle ici le texte brut d'une main (format PokerStars ou Winamax)..."
            className="w-full h-64 p-3 border font-mono text-xs focus:outline-none"
            style={{ borderColor: "var(--border)" }}
          />
          <div className="flex gap-2">
            <button
              onClick={analyze}
              disabled={!text.trim()}
              className="px-4 py-2 font-semibold text-xs uppercase tracking-widest transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "var(--accent)",
                color: "var(--bg-deep)",
                letterSpacing: "0.15em",
              }}
            >
              Analyser
            </button>
            <button
              onClick={() => {
                setText("")
                setParsed(null)
              }}
              className="px-4 py-2 text-xs uppercase tracking-widest border"
              style={{
                color: "var(--text-secondary)",
                borderColor: "var(--border)",
              }}
            >
              Effacer
            </button>
          </div>
        </section>

        {parsed && <AnalysisPanel parsed={parsed} />}
      </div>
    </main>
  )
}

function AnalysisPanel({ parsed }: { parsed: ParsedHand }) {
  return (
    <section className="space-y-6">
      {parsed.errors.length > 0 && (
        <div
          className="p-3 border-l-2 text-sm"
          style={{
            borderColor: "var(--heart-red)",
            color: "var(--text-secondary)",
            background: "rgba(212, 120, 98, 0.05)",
          }}
        >
          <div className="font-semibold mb-1" style={{ color: "var(--heart-red)" }}>
            Erreurs de parsing :
          </div>
          <ul className="list-disc pl-5 space-y-0.5">
            {parsed.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Meta */}
      <div
        className="p-4 border space-y-2 text-sm"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div>
          <Muted>Format :</Muted> {parsed.format}
        </div>
        {parsed.stakes && (
          <div>
            <Muted>Enjeux :</Muted> {parsed.stakes}
          </div>
        )}
        <div>
          <Muted>Table :</Muted> {parsed.table} ({parsed.max_players}-max)
        </div>
        <div>
          <Muted>Héros :</Muted> <strong>{parsed.hero}</strong> — position :{" "}
          <strong style={{ color: "var(--accent)" }}>
            {parsed.hero_position ?? "?"}
          </strong>
        </div>
        {parsed.hero_cards && (
          <div className="pt-2">
            <div
              className="text-xs uppercase tracking-widest mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Cartes
            </div>
            <HandDisplay hand={parsed.hero_cards} />
          </div>
        )}
      </div>

      {/* Preflop */}
      <PreflopAnalysis parsed={parsed} />

      {/* Postflop */}
      {parsed.flop && <FlopAnalysis parsed={parsed} street={parsed.flop} label="Flop" />}
      {parsed.turn && <FlopAnalysis parsed={parsed} street={parsed.turn} label="Turn" />}
      {parsed.river && <FlopAnalysis parsed={parsed} street={parsed.river} label="River" />}
    </section>
  )
}

function PreflopAnalysis({ parsed }: { parsed: ParsedHand }) {
  const chart =
    parsed.hero_position && parsed.vs_action
      ? findChart(
          parsed.hero_position,
          parsed.vs_action,
          parsed.vs_position ?? undefined
        )
      : null

  const heroAction: Action | null = parsed.hero_action
    ? mapActionToStandard(parsed.hero_action.action)
    : null

  const freq = chart && parsed.hero_cards ? chart.hands[parsed.hero_cards] : null
  const gtoPrimary = freq ? primaryAction(freq) : null
  const gtoValidActions = freq ? correctActions(freq) : []
  const isCorrect = heroAction && gtoValidActions.includes(heroAction)

  return (
    <div className="space-y-3">
      <StreetHeader label="Préflop" suit="♠" />

      <div
        className="p-4 border text-sm"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div>
          <Muted>Situation :</Muted>{" "}
          <strong style={{ color: "var(--accent)" }}>{parsed.vs_action ?? "?"}</strong>
          {parsed.vs_position && (
            <>
              {" "}
              (opener : <strong>{parsed.vs_position}</strong>)
            </>
          )}
        </div>
        {parsed.preflop_actions.length > 0 && (
          <details className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
            <summary className="cursor-pointer hover:opacity-80">
              Actions préflop ({parsed.preflop_actions.length})
            </summary>
            <ul className="mt-2 space-y-0.5 pl-4">
              {parsed.preflop_actions.map((a, i) => (
                <li key={i}>
                  <span
                    style={{
                      color: a.player === parsed.hero ? "var(--accent)" : undefined,
                      fontWeight: a.player === parsed.hero ? 700 : 400,
                    }}
                  >
                    {a.player}
                  </span>
                  {a.position ? ` (${a.position})` : ""} : {a.action}
                  {a.amount ? ` ${a.amount}` : ""}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      {chart && freq && heroAction && gtoPrimary && (
        <ComparisonPanel
          correct={!!isCorrect}
          heroLabel={labelAction(heroAction)}
          gtoLabel={labelAction(gtoPrimary)}
          heroColor={colorForAction(heroAction)}
          gtoColor={colorForAction(gtoPrimary)}
          info={`Fréquences GTO : ${formatFreq(freq)}`}
        />
      )}

      {!chart && parsed.hero_position && parsed.vs_action && (
        <div
          className="text-sm p-3 border-l-2"
          style={{
            borderColor: "var(--accent)",
            color: "var(--text-secondary)",
            background: "var(--accent-soft)",
          }}
        >
          Range {parsed.vs_action} pour {parsed.hero_position}
          {parsed.vs_position ? ` vs ${parsed.vs_position}` : ""} pas encore disponible.
          Consulte les charts pour trouver un équivalent.
        </div>
      )}
    </div>
  )
}

function FlopAnalysis({
  parsed,
  street,
  label,
}: {
  parsed: ParsedHand
  street: ParsedStreet
  label: "Flop" | "Turn" | "River"
}) {
  const role = heroPostflopRole(parsed)
  const heroAct = street.actions.find((a) => a.player === parsed.hero)

  // Compute texture using the flop cards (turn/river use flop only for c-bet estimation)
  const flopCards = parsed.flop?.cards ?? []
  const canClassify = flopCards.length === 3
  const texture = canClassify ? classifyFlop(flopCards) : null
  const rec = texture && role && label === "Flop" ? recommendCBet(texture, role) : null

  // Classify hero action
  const heroBet = heroAct && (heroAct.action === "bet" || heroAct.action === "raise")
  const heroCheck = heroAct && heroAct.action === "check"

  return (
    <div className="space-y-3">
      <StreetHeader label={label} suit="♣" />

      {/* Board */}
      <div
        className="p-4 border"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div
          className="text-[10px] uppercase tracking-widest mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Board
        </div>
        <div className="flex gap-2 mb-4">
          {(label === "Flop"
            ? street.cards
            : [
                ...(parsed.flop?.cards ?? []),
                ...(label === "Turn" || label === "River" ? parsed.turn?.cards ?? [] : []),
                ...(label === "River" ? parsed.river?.cards ?? [] : []),
              ]
          ).map((c, i) => (
            <BoardCard key={i} card={c} highlight={label !== "Flop" && i >= 3} />
          ))}
        </div>

        {label === "Flop" && texture && (
          <div className="flex flex-wrap gap-2 text-xs">
            <TextureTag
              value={humanize(texture.overall)}
              color={
                texture.overall === "wet"
                  ? "var(--heart-red)"
                  : texture.overall === "semi_wet"
                    ? "var(--accent)"
                    : "#6cb98d"
              }
            />
            <TextureTag value={humanize(texture.highness)} />
            <TextureTag value={humanize(texture.pairing)} />
            <TextureTag value={humanize(texture.suitedness)} />
            <TextureTag value={humanize(texture.connectedness)} />
          </div>
        )}

        {street.actions.length > 0 && (
          <details
            className="text-xs mt-4"
            style={{ color: "var(--text-muted)" }}
          >
            <summary className="cursor-pointer hover:opacity-80">
              Actions {label.toLowerCase()} ({street.actions.length})
            </summary>
            <ul className="mt-2 space-y-0.5 pl-4">
              {street.actions.map((a, i) => (
                <li key={i}>
                  <span
                    style={{
                      color: a.player === parsed.hero ? "var(--accent)" : undefined,
                      fontWeight: a.player === parsed.hero ? 700 : 400,
                    }}
                  >
                    {a.player}
                  </span>
                  {a.position ? ` (${a.position})` : ""} : {a.action}
                  {a.amount ? ` ${a.amount}` : ""}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      {/* C-bet analysis for flop */}
      {label === "Flop" && rec && heroAct && (
        <ComparisonPanel
          correct={
            heroBet
              ? rec.frequency >= 50
              : heroCheck
                ? rec.frequency <= 50
                : false
          }
          heroLabel={heroBet ? `Bet ${heroAct.amount ?? ""}` : heroCheck ? "Check" : heroAct.action}
          gtoLabel={rec.frequency >= 50 ? `Bet (${rec.frequency}%)` : `Check (${100 - rec.frequency}% du temps)`}
          heroColor={heroBet ? "text-emerald-400" : heroCheck ? "text-blue-400" : "text-red-400"}
          gtoColor={rec.frequency >= 50 ? "text-emerald-400" : "text-blue-400"}
          info={`${rec.frequency}% c-bet à ${rec.sizingPct} — ${rec.rationale}`}
        />
      )}

      {label === "Flop" && !heroAct && (
        <div
          className="text-sm p-3 border-l-2"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-muted)",
            background: "var(--surface)",
          }}
        >
          Le héros n&apos;a pas agi au flop (fold préflop ou autre).
        </div>
      )}
    </div>
  )
}

/* ============================================================
   UI bits
   ============================================================ */

function StreetHeader({ label, suit }: { label: string; suit: string }) {
  return (
    <div
      className="flex items-center gap-3 text-xs uppercase tracking-widest"
      style={{ color: "var(--accent)", letterSpacing: "0.25em" }}
    >
      <span className="text-lg">{suit}</span>
      <span>{label}</span>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  )
}

function BoardCard({ card, highlight }: { card: Card; highlight?: boolean }) {
  const isRed = suitColor(card.suit) === "red"
  return (
    <div
      className="w-14 h-20 rounded flex flex-col justify-between p-2 relative"
      style={{
        background: "#f0e5c8",
        color: isRed ? "#b22a1e" : "#1a1a1a",
        border: highlight ? "2px solid var(--accent)" : "1px solid rgba(212, 165, 63, 0.6)",
      }}
    >
      <div
        className="text-lg font-bold leading-none decorative"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {card.rank}
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-3xl">
        {suitSymbol(card.suit)}
      </div>
    </div>
  )
}

function TextureTag({ value, color }: { value: string; color?: string }) {
  return (
    <div
      className="px-2 py-1 text-[10px] uppercase tracking-widest border"
      style={{
        borderColor: color ?? "var(--border)",
        color: color ?? "var(--text-secondary)",
        letterSpacing: "0.2em",
      }}
    >
      {value}
    </div>
  )
}

function ComparisonPanel({
  correct,
  heroLabel,
  gtoLabel,
  heroColor,
  gtoColor,
  info,
}: {
  correct: boolean
  heroLabel: string
  gtoLabel: string
  heroColor: string
  gtoColor: string
  info: string
}) {
  return (
    <div
      className="p-4 border-l-2 space-y-3"
      style={{
        borderColor: correct ? "#6cb98d" : "var(--heart-red)",
        background: correct
          ? "rgba(108, 185, 141, 0.08)"
          : "rgba(212, 120, 98, 0.08)",
      }}
    >
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div
            className="text-[10px] uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            Toi
          </div>
          <div className={`font-bold text-lg ${heroColor}`}>{heroLabel}</div>
        </div>
        <div>
          <div
            className="text-[10px] uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            GTO
          </div>
          <div className={`font-bold text-lg ${gtoColor}`}>{gtoLabel}</div>
        </div>
      </div>
      <div
        className="text-sm pt-2 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        {info}
      </div>
      <div
        className="text-sm font-semibold"
        style={{ color: correct ? "#6cb98d" : "var(--heart-red)" }}
      >
        {correct
          ? "✓ Ta décision colle à la recommandation."
          : "✗ Ta décision s'écarte de la recommandation."}
      </div>
    </div>
  )
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "var(--text-muted)" }}>{children}</span>
}

function humanize(str: string): string {
  return str.replace(/_/g, "-")
}

function mapActionToStandard(a: string): Action | null {
  if (a === "fold") return "fold"
  if (a === "call") return "call"
  if (a === "raise") return "raise"
  if (a === "bet") return "raise"
  return null
}

function labelAction(a: Action): string {
  return { raise: "Raise", call: "Call", fold: "Fold" }[a]
}

function colorForAction(a: Action): string {
  return { raise: "text-emerald-400", call: "text-blue-400", fold: "text-red-400" }[a]
}

function formatFreq(freq: { raise: number; call: number; fold: number }): string {
  const parts: string[] = []
  if (freq.raise > 0) parts.push(`R ${Math.round(freq.raise * 100)}%`)
  if (freq.call > 0) parts.push(`C ${Math.round(freq.call * 100)}%`)
  if (freq.fold > 0) parts.push(`F ${Math.round(freq.fold * 100)}%`)
  return parts.join(" · ")
}
