import type { RangeChart, HandName, Action, HandFrequency, Position, VsAction } from "@/types"
import { ALL_HANDS } from "@/data/hands"
import { ALL_RANGE_CHARTS } from "@/lib/ranges/manifest"

export const ALL_CHARTS: RangeChart[] = ALL_RANGE_CHARTS

export interface DrillSpot {
  chart: RangeChart
  hand: HandName
  frequency: HandFrequency
  correct_actions: Action[]
  primary_action: Action
  spot_id: string
}

export function spotId(chart: RangeChart): string {
  const vsPos = chart.vs_position ? `_vs_${chart.vs_position}` : ""
  return `${chart.format}_${chart.stack}_${chart.position}_${chart.vs_action}${vsPos}`
}

export function handSpotKey(chart: RangeChart, hand: HandName): string {
  return `${spotId(chart)}__${hand}`
}

/**
 * Retourne les actions "correctes" pour une main (fréquence > 0).
 * Pour les cases mixtes, toutes les actions présentes sont considérées correctes.
 */
export function correctActions(freq: HandFrequency): Action[] {
  const actions: Action[] = []
  if (freq.raise > 0) actions.push("raise")
  if (freq.call > 0) actions.push("call")
  if (freq.fold > 0) actions.push("fold")
  return actions
}

/**
 * Action "primaire" = celle avec la plus haute fréquence.
 */
export function primaryAction(freq: HandFrequency): Action {
  const entries: [Action, number][] = [
    ["raise", freq.raise],
    ["call", freq.call],
    ["fold", freq.fold],
  ]
  entries.sort((a, b) => b[1] - a[1])
  return entries[0][0]
}

/**
 * Vérifie qu'une action jouée est "correcte".
 * Une action est correcte si sa fréquence dans la range est > 0.
 * Pour les cases mixtes, les 2 actions sont donc correctes toutes les deux.
 */
export function isActionCorrect(freq: HandFrequency, action: Action): boolean {
  return freq[action] > 0
}

/**
 * Tire une main avec un biais vers les mains "intéressantes" (mixtes ou non-fold),
 * pour éviter de spammer trop de folds évidents.
 */
function drawInterestingHand(chart: RangeChart): HandName {
  const buckets = { mixed: [] as HandName[], nonFold: [] as HandName[], fold: [] as HandName[] }
  for (const hand of ALL_HANDS) {
    const f = chart.hands[hand]
    if (!f) continue
    const activeActions = (f.raise > 0 ? 1 : 0) + (f.call > 0 ? 1 : 0) + (f.fold > 0 ? 1 : 0)
    if (activeActions > 1) buckets.mixed.push(hand)
    else if (f.fold >= 1) buckets.fold.push(hand)
    else buckets.nonFold.push(hand)
  }
  // 50% mixed, 30% nonFold, 20% fold
  const r = Math.random()
  const bucket =
    r < 0.5 && buckets.mixed.length > 0
      ? buckets.mixed
      : r < 0.8 && buckets.nonFold.length > 0
        ? buckets.nonFold
        : buckets.fold.length > 0
          ? buckets.fold
          : buckets.mixed.concat(buckets.nonFold)
  return bucket[Math.floor(Math.random() * bucket.length)]
}

export interface DrawOptions {
  filterPosition?: Position | null
  filterAction?: VsAction | null
  // Adaptive weights: map of spot_id → weight multiplier (weak spots > 1)
  spotWeights?: Record<string, number>
}

/**
 * Tire un chart pondéré. Sans pondération, uniforme.
 */
function drawChart(charts: RangeChart[], weights?: Record<string, number>): RangeChart {
  if (!weights) return charts[Math.floor(Math.random() * charts.length)]
  const weighted = charts.map((c) => ({ chart: c, w: weights[spotId(c)] ?? 1 }))
  const total = weighted.reduce((s, x) => s + x.w, 0)
  let r = Math.random() * total
  for (const { chart, w } of weighted) {
    r -= w
    if (r <= 0) return chart
  }
  return weighted[weighted.length - 1].chart
}

/**
 * Tire un spot complet (chart + main).
 */
export function drawSpot(opts: DrawOptions = {}): DrillSpot {
  let candidates = ALL_CHARTS
  if (opts.filterPosition) {
    candidates = candidates.filter((c) => c.position === opts.filterPosition)
  }
  if (opts.filterAction) {
    candidates = candidates.filter((c) => c.vs_action === opts.filterAction)
  }
  if (candidates.length === 0) candidates = ALL_CHARTS

  const chart = drawChart(candidates, opts.spotWeights)
  const hand = drawInterestingHand(chart)
  const frequency = chart.hands[hand] ?? { raise: 0, call: 0, fold: 1 }
  return {
    chart,
    hand,
    frequency,
    correct_actions: correctActions(frequency),
    primary_action: primaryAction(frequency),
    spot_id: spotId(chart),
  }
}
