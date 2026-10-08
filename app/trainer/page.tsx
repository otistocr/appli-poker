"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import type { Action, Position } from "@/types"
import {
  ALL_CHARTS,
  drawSpot,
  isActionCorrect,
  primaryAction,
  spotId,
  type DrillSpot,
} from "@/lib/drill"
import { ALL_HANDS } from "@/data/hands"
import {
  adaptiveSpotWeights,
  emptyStats,
  loadStats,
  recordResult,
  resetStats,
  saveStats,
  type UserStats,
} from "@/lib/storage"
import HandDisplay from "@/components/HandDisplay"
import ActionButtons from "@/components/ActionButtons"
import ScoreBar from "@/components/ScoreBar"
import FeltHeader from "@/components/FeltHeader"

type Mode = "random" | "targeted" | "errors"

const POSITIONS: Position[] = ["UTG", "UTG+1", "HJ", "CO", "BTN", "SB"]

interface Feedback {
  correct: boolean
  points: number
  answered: Action
  spot: DrillSpot
}

export default function TrainerPage() {
  const [stats, setStats] = useState<UserStats>(emptyStats())
  const [mode, setMode] = useState<Mode>("random")
  const [filterPosition, setFilterPosition] = useState<Position | null>(null)
  const [current, setCurrent] = useState<DrillSpot | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load stats + first spot on mount (client-only)
  useEffect(() => {
    const loaded = loadStats()
    setStats(loaded)
    setCurrent(drawSpotForMode(loaded, "random", null))
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const drawNext = useCallback(
    (currentStats: UserStats) => {
      const next = drawSpotForMode(currentStats, mode, filterPosition)
      setCurrent(next)
      setFeedback(null)
    },
    [mode, filterPosition]
  )

  const handleAction = useCallback(
    (action: Action) => {
      if (!current || feedback) return
      const isCorrect = isActionCorrect(current.frequency, action)
      const { stats: updated, points } = recordResult(
        stats,
        current.spot_id,
        current.hand,
        isCorrect
      )
      setStats(updated)
      saveStats(updated)
      setFeedback({ correct: isCorrect, points, answered: action, spot: current })

      timerRef.current = setTimeout(() => drawNext(updated), 1800)
    },
    [current, feedback, stats, drawNext]
  )

  // Keyboard shortcuts F/C/R
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (feedback) return
      const k = e.key.toLowerCase()
      if (k === "f") handleAction("fold")
      else if (k === "c") handleAction("call")
      else if (k === "r") handleAction("raise")
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [handleAction, feedback])

  const changeMode = (m: Mode, pos: Position | null = null) => {
    setMode(m)
    setFilterPosition(pos)
    if (timerRef.current) clearTimeout(timerRef.current)
    const next = drawSpotForMode(stats, m, pos)
    setCurrent(next)
    setFeedback(null)
  }

  const hasErrors = stats.errors.length > 0

  return (
    <main className="min-h-screen">
      <FeltHeader current="Pratique" suit="♥" />
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-6 py-8">
        <div className="flex items-center justify-end text-sm">
          <button
            onClick={() => {
              if (confirm("Réinitialiser toutes les stats ?")) {
                resetStats()
                const fresh = emptyStats()
                setStats(fresh)
                setCurrent(drawSpotForMode(fresh, mode, filterPosition))
              }
            }}
            className="text-xs hover:text-red-400"
            style={{ color: "var(--text-muted)" }}
          >
            Reset stats
          </button>
        </div>

        <header>
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
            <span className="text-lg">♥</span>
            <span>Session de pratique</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Pratique</h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
            Réponds Fold / Call / Raise. Raccourcis clavier : F / C / R.
          </p>
        </header>

        <ScoreBar stats={stats} />

        <section className="flex flex-wrap gap-2">
          <ModeButton active={mode === "random"} onClick={() => changeMode("random")}>
            Aléatoire
          </ModeButton>
          <ModeButton active={mode === "targeted"} onClick={() => changeMode("targeted", "BTN")}>
            Ciblé
          </ModeButton>
          <ModeButton
            active={mode === "errors"}
            onClick={() => changeMode("errors")}
            disabled={!hasErrors}
          >
            Erreurs {hasErrors && `(${stats.errors.length})`}
          </ModeButton>
        </section>

        {mode === "targeted" && (
          <section className="flex flex-wrap gap-2 -mt-2">
            {POSITIONS.map((p) => (
              <button
                key={p}
                onClick={() => changeMode("targeted", p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  filterPosition === p
                    ? "bg-amber-500 text-neutral-950"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                {p}
              </button>
            ))}
          </section>
        )}

        {current && (
          <section className="space-y-4">
            <div className="p-4 sm:p-6 bg-neutral-900 border border-neutral-800 rounded-xl space-y-4">
              <div className="text-xs uppercase tracking-widest text-neutral-500">
                Contexte
              </div>
              <div className="text-base sm:text-lg text-neutral-100 font-medium">
                Cash 6-max, {current.chart.stack}bb. Tu es{" "}
                <span className="text-amber-400 font-bold">{current.chart.position}</span>.
              </div>
              <div className="text-sm text-neutral-300">
                {actionDescription(current.chart)}
              </div>
              <div className="pt-2 border-t border-neutral-800">
                <div className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
                  Ta main
                </div>
                <HandDisplay hand={current.hand} />
              </div>
            </div>

            {!feedback && <ActionButtons onAction={handleAction} />}
            {feedback && <FeedbackPanel feedback={feedback} />}
          </section>
        )}

        <details className="text-xs text-neutral-500 pt-2">
          <summary className="cursor-pointer hover:text-neutral-300">
            Stats détaillées
          </summary>
          <div className="mt-3 space-y-2">
            <div>Best streak : {stats.best_streak}</div>
            <div>Correct : {stats.correct} / {stats.total_hands}</div>
            <div>Erreurs actives à rejouer : {stats.errors.length}</div>
            <div>Dernière session : {stats.last_played ?? "—"}</div>
          </div>
        </details>
      </div>
    </main>
  )
}

function ModeButton({
  children,
  active,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
        active
          ? "bg-amber-500 text-neutral-950"
          : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  )
}

function FeedbackPanel({ feedback }: { feedback: Feedback }) {
  const { correct, points, spot, answered } = feedback
  const primary = primaryAction(spot.frequency)
  const freqLabel = formatFrequency(spot.frequency)
  return (
    <div
      className={`p-4 rounded-xl border-2 space-y-2 ${
        correct
          ? "border-emerald-500 bg-emerald-950/30"
          : "border-red-500 bg-red-950/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`text-lg font-bold ${
            correct ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {correct ? "✓ Correct" : "✗ Incorrect"}
        </div>
        <div
          className={`text-base font-bold ${
            correct ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {points >= 0 ? "+" : ""}
          {points} pts
        </div>
      </div>
      <div className="text-sm text-neutral-300">
        Tu as joué <strong>{labelAction(answered)}</strong>. Action GTO principale :{" "}
        <strong className={colorForAction(primary)}>{labelAction(primary)}</strong>.
      </div>
      <div className="text-sm text-neutral-400 font-mono">{freqLabel}</div>
    </div>
  )
}

function actionDescription(chart: { vs_action: string; vs_position?: string }): string {
  switch (chart.vs_action) {
    case "RFI":
      return "Personne n'a encore misé. À toi de décider : ouvrir ou fold."
    case "vs_open":
      return `${chart.vs_position ?? "?"} a open. Tu défends ta position : call, 3-bet, ou fold ?`
    case "vs_3bet":
      return "Tu as ouvert, un adversaire 3-bet. Tu réponds : call, 4-bet, ou fold ?"
    case "vs_4bet":
      return `Tu as 3-bet, ${chart.vs_position ?? "l'adversaire"} 4-bet. Tu réponds : call, 5-bet all-in, ou fold ?`
    default:
      return ""
  }
}

function formatFrequency(freq: { raise: number; call: number; fold: number }): string {
  const parts: string[] = []
  if (freq.raise > 0) parts.push(`R ${Math.round(freq.raise * 100)}%`)
  if (freq.call > 0) parts.push(`C ${Math.round(freq.call * 100)}%`)
  if (freq.fold > 0) parts.push(`F ${Math.round(freq.fold * 100)}%`)
  return parts.join(" · ")
}

function labelAction(a: Action): string {
  return { raise: "Raise", call: "Call", fold: "Fold" }[a]
}

function colorForAction(a: Action): string {
  return { raise: "text-emerald-400", call: "text-blue-400", fold: "text-red-400" }[a]
}

/**
 * Sélectionne un spot selon le mode courant.
 */
function drawSpotForMode(
  stats: UserStats,
  mode: Mode,
  filterPosition: Position | null
): DrillSpot {
  if (mode === "errors" && stats.errors.length > 0) {
    // Rejoue les mains ratées : pick random error key, reconstruct spot
    const key = stats.errors[Math.floor(Math.random() * stats.errors.length)]
    const [spot_id, hand] = key.split("__")
    const chart = ALL_CHARTS.find((c) => spotId(c) === spot_id)
    if (chart && ALL_HANDS.includes(hand)) {
      const frequency = chart.hands[hand] ?? { raise: 0, call: 0, fold: 1 }
      return {
        chart,
        hand,
        frequency,
        correct_actions: [], // recompute if needed
        primary_action: primaryAction(frequency),
        spot_id,
      }
    }
  }
  if (mode === "targeted") {
    return drawSpot({ filterPosition, spotWeights: adaptiveSpotWeights(stats) })
  }
  // random with adaptive weights
  return drawSpot({ spotWeights: adaptiveSpotWeights(stats) })
}
