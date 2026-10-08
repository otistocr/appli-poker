"use client"

import { useMemo, useState } from "react"
import RangeGrid from "@/components/RangeGrid"
import FeltHeader from "@/components/FeltHeader"
import type { RangeChart, HandFrequency, Position, VsAction, Format } from "@/types"
import { ALL_RANGE_CHARTS, findChart } from "@/lib/ranges/manifest"

const ALL_POSITIONS: Position[] = ["UTG", "UTG+1", "UTG+2", "MP", "LJ", "HJ", "CO", "BTN", "SB", "BB"]
const OPENER_POSITIONS: Position[] = ["UTG", "UTG+1", "UTG+2", "MP", "LJ", "HJ", "CO", "BTN", "SB"]

const ACTIONS: { value: VsAction; label: string }[] = [
  { value: "RFI", label: "RFI (open)" },
  { value: "vs_open", label: "vs Open" },
  { value: "vs_3bet", label: "vs 3-bet" },
  { value: "vs_4bet", label: "vs 4-bet" },
]

// Format + Stack combos available
const FORMATS: { format: Format; stack: number; label: string }[] = [
  { format: "cash_6max", stack: 100, label: "Cash 6-max · 100bb" },
  { format: "cash_9max", stack: 100, label: "Cash 9-max · 100bb" },
  { format: "mtt", stack: 50, label: "MTT · 50bb" },
  { format: "mtt", stack: 40, label: "MTT · 40bb" },
  { format: "mtt", stack: 20, label: "MTT · 20bb" },
  { format: "mtt", stack: 12, label: "MTT · 12bb (push/fold)" },
]

type ProfileKey = "GTO" | "fish" | "nit"
const PROFILES: { value: ProfileKey; label: string; note: string }[] = [
  { value: "GTO", label: "GTO", note: "Stratégie d'équilibre (baseline inexploitable)." },
  {
    value: "fish",
    label: "vs Fish",
    note: "Range ajustée : moins de bluffs (ils fold rarement), plus de value (ils call trop large).",
  },
  {
    value: "nit",
    label: "vs Nit",
    note: "Range ajustée : plus de bluffs (ils fold trop), moins de calls marginaux (ils sur-value).",
  },
]

function applyProfile(freq: HandFrequency, profile: ProfileKey): HandFrequency {
  if (profile === "GTO") return freq
  const t = { ...freq }
  if (profile === "fish") {
    t.raise = t.raise * 0.7
    t.call = t.call * 1.3
    t.fold = t.fold * 0.85
  } else if (profile === "nit") {
    t.raise = t.raise * 1.35
    t.call = t.call * 0.85
    t.fold = t.fold * 0.9
  }
  const sum = t.raise + t.call + t.fold
  return sum > 0
    ? { raise: t.raise / sum, call: t.call / sum, fold: t.fold / sum }
    : freq
}

function transformChart(chart: RangeChart, profile: ProfileKey): RangeChart {
  if (profile === "GTO") return chart
  const hands: Record<string, HandFrequency> = {}
  for (const [h, f] of Object.entries(chart.hands)) {
    hands[h] = applyProfile(f, profile)
  }
  return { ...chart, hands }
}

export default function ChartsPage() {
  const [format, setFormat] = useState<Format>("cash_6max")
  const [stack, setStack] = useState<number>(100)
  const [position, setPosition] = useState<Position>("UTG")
  const [action, setAction] = useState<VsAction>("RFI")
  const [vsPosition, setVsPosition] = useState<Position>("BTN")
  const [profile, setProfile] = useState<ProfileKey>("GTO")

  const currentFormatLabel = FORMATS.find(
    (f) => f.format === format && f.stack === stack
  )?.label ?? "?"

  // Charts filtered by format+stack
  const availableCharts = useMemo(
    () => ALL_RANGE_CHARTS.filter((c) => c.format === format && c.stack === stack),
    [format, stack]
  )

  const needsVsPosition = useMemo(() => {
    return availableCharts.some(
      (c) => c.position === position && c.vs_action === action && c.vs_position
    )
  }, [availableCharts, position, action])

  const rawChart = useMemo<RangeChart | null>(() => {
    if (needsVsPosition) return findChart(format, stack, position, action, vsPosition) ?? null
    return findChart(format, stack, position, action) ?? null
  }, [format, stack, position, action, vsPosition, needsVsPosition])

  const chart = useMemo(
    () => (rawChart ? transformChart(rawChart, profile) : null),
    [rawChart, profile]
  )

  // Actions available for current format+stack
  const availableActions = useMemo(() => {
    const set = new Set(availableCharts.map((c) => c.vs_action))
    return ACTIONS.filter((a) => set.has(a.value))
  }, [availableCharts])

  const heroPositionsForAction = useMemo(() => {
    const set = new Set(
      availableCharts.filter((c) => c.vs_action === action).map((c) => c.position)
    )
    return ALL_POSITIONS.filter((p) => set.has(p))
  }, [availableCharts, action])

  const openerPositionsForHero = useMemo(() => {
    const set = new Set(
      availableCharts
        .filter((c) => c.vs_action === action && c.position === position && c.vs_position)
        .map((c) => c.vs_position as Position)
    )
    return OPENER_POSITIONS.filter((p) => set.has(p))
  }, [availableCharts, action, position])

  const missingReason = useMemo(() => {
    if (chart) return null
    if (action === "RFI" && position === "BB") return "La BB ne peut jamais RFI (elle est déjà dans le coup)."
    return `Range ${action} ${position}${needsVsPosition ? ` vs ${vsPosition}` : ""} pas encore disponible dans ce format. Change de format ou de position.`
  }, [chart, action, position, vsPosition, needsVsPosition])

  const handleFormatChange = (f: Format, s: number) => {
    setFormat(f)
    setStack(s)
    // reset position/action to first valid combo
    const availables = ALL_RANGE_CHARTS.filter((c) => c.format === f && c.stack === s)
    const positions = new Set(availables.map((c) => c.position))
    const actions = new Set(availables.map((c) => c.vs_action))
    if (!actions.has(action)) {
      const firstAction = ACTIONS.find((a) => actions.has(a.value))
      if (firstAction) setAction(firstAction.value)
    }
    if (!positions.has(position)) {
      const firstPos = ALL_POSITIONS.find((p) => positions.has(p))
      if (firstPos) setPosition(firstPos)
    }
  }

  const isShoveContext =
    format === "mtt" && (stack === 12 || stack === 20) && action === "RFI"

  return (
    <main className="min-h-screen">
      <FeltHeader current="Ranges" suit="♠" />
      <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 py-8">
        <header className="space-y-2">
          <div
            className="flex items-center gap-3 text-xs uppercase tracking-widest"
            style={{ color: "var(--accent)" }}
          >
            <span className="text-lg">♠</span>
            <span>Charts GTO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ranges préflop
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {currentFormatLabel} · {action} · {position}
            {needsVsPosition ? ` vs ${vsPosition}` : ""} · Profil : {profile}
          </p>
        </header>

        {/* FORMAT selector */}
        <section className="space-y-2">
          <div
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            Format
          </div>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => {
              const isCurrent = format === f.format && stack === f.stack
              return (
                <button
                  key={f.label}
                  onClick={() => handleFormatChange(f.format, f.stack)}
                  className="px-3 py-2 text-xs font-medium border transition-colors"
                  style={{
                    background: isCurrent ? "var(--accent)" : "transparent",
                    color: isCurrent ? "var(--bg-deep)" : "var(--text-secondary)",
                    borderColor: isCurrent ? "var(--accent)" : "var(--border)",
                  }}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        </section>

        {/* ACTION selector */}
        <section className="space-y-2">
          <div
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            Action
          </div>
          <div className="flex flex-wrap gap-2">
            {ACTIONS.map((a) => {
              const isCurrent = action === a.value
              const isAvailable = availableActions.some((x) => x.value === a.value)
              return (
                <button
                  key={a.value}
                  onClick={() => isAvailable && setAction(a.value)}
                  disabled={!isAvailable}
                  className="px-3 py-2 text-xs font-medium border transition-colors"
                  style={{
                    background: isCurrent ? "var(--accent)" : "transparent",
                    color: isCurrent
                      ? "var(--bg-deep)"
                      : isAvailable
                        ? "var(--text-secondary)"
                        : "var(--text-muted)",
                    borderColor: isCurrent ? "var(--accent)" : "var(--border)",
                    opacity: isAvailable ? 1 : 0.4,
                    cursor: isAvailable ? "pointer" : "not-allowed",
                  }}
                >
                  {a.label}
                </button>
              )
            })}
          </div>
        </section>

        {/* HERO POSITION */}
        <section className="space-y-2">
          <div
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            Ta position
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_POSITIONS.map((p) => {
              const enabled = heroPositionsForAction.includes(p)
              const isCurrent = position === p
              return (
                <button
                  key={p}
                  onClick={() => enabled && setPosition(p)}
                  disabled={!enabled}
                  className="px-3 py-2 text-xs font-medium border transition-colors"
                  style={{
                    background: isCurrent ? "var(--accent)" : "transparent",
                    color: isCurrent
                      ? "var(--bg-deep)"
                      : enabled
                        ? "var(--text-secondary)"
                        : "var(--text-muted)",
                    borderColor: isCurrent ? "var(--accent)" : "var(--border)",
                    opacity: enabled ? 1 : 0.35,
                    cursor: enabled ? "pointer" : "not-allowed",
                  }}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </section>

        {/* VS_POSITION */}
        {needsVsPosition && (
          <section className="space-y-2">
            <div
              className="text-xs uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Position adverse (opener)
            </div>
            <div className="flex flex-wrap gap-2">
              {OPENER_POSITIONS.map((p) => {
                const enabled = openerPositionsForHero.includes(p)
                const isCurrent = vsPosition === p
                return (
                  <button
                    key={p}
                    onClick={() => enabled && setVsPosition(p)}
                    disabled={!enabled}
                    className="px-3 py-2 text-xs font-medium border transition-colors"
                    style={{
                      background: isCurrent ? "var(--accent)" : "transparent",
                      color: isCurrent
                        ? "var(--bg-deep)"
                        : enabled
                          ? "var(--text-secondary)"
                          : "var(--text-muted)",
                      borderColor: isCurrent ? "var(--accent)" : "var(--border)",
                      opacity: enabled ? 1 : 0.35,
                      cursor: enabled ? "pointer" : "not-allowed",
                    }}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* PROFILE */}
        <section className="space-y-2">
          <div
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            Profil adverse
          </div>
          <div className="flex flex-wrap gap-2">
            {PROFILES.map((p) => {
              const isCurrent = profile === p.value
              return (
                <button
                  key={p.value}
                  onClick={() => setProfile(p.value)}
                  className="px-3 py-2 text-xs font-medium border transition-colors"
                  style={{
                    background: isCurrent ? "var(--accent)" : "transparent",
                    color: isCurrent ? "var(--bg-deep)" : "var(--text-secondary)",
                    borderColor: isCurrent ? "var(--accent)" : "var(--border)",
                  }}
                >
                  {p.label}
                </button>
              )
            })}
          </div>
          <p
            className="text-xs italic pt-1"
            style={{ color: "var(--text-muted)" }}
          >
            {PROFILES.find((p) => p.value === profile)!.note}
          </p>
        </section>

        {chart ? (
          <>
            <div className="overflow-x-auto">
              <RangeGrid chart={chart} />
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-neutral-300">
              <LegendItem color="bg-emerald-600" label={isShoveContext ? "Shove 100%" : "Raise 100%"} />
              <LegendItem color="bg-emerald-400" label={isShoveContext ? "Shove mixte" : "Raise mixte"} />
              <LegendItem color="bg-blue-500" label="Call 100%" />
              <LegendItem color="bg-blue-300" label="Call mixte" />
              <LegendItem color="bg-neutral-100" label="Fold" />
            </div>
            <div
              className="pt-2 text-xs italic"
              style={{ color: "var(--text-muted)" }}
            >
              {isShoveContext ? (
                <p>
                  Push/fold à {stack}bb : <strong>Raise</strong> = shove all-in.{" "}
                  <strong>Fold</strong> = jette la main. Pas de call — trop peu de stack pour
                  jouer postflop.
                </p>
              ) : (
                <p>
                  <strong>Raise</strong> ={" "}
                  {action === "RFI"
                    ? "open"
                    : action === "vs_open"
                      ? "3-bet"
                      : action === "vs_3bet"
                        ? "4-bet"
                        : "5-bet all-in"}
                  . <strong>Call</strong> = flat. <strong>Fold</strong> = jette la main.
                </p>
              )}
            </div>
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
            {missingReason}
          </div>
        )}
      </div>
    </main>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded ${color}`} />
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
    </div>
  )
}
