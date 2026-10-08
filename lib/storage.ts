"use client"

import type { HandName } from "@/types"

export interface SpotStats {
  correct: number
  total: number
}

export interface DailyStats {
  hands: number
  correct: number
  points: number
}

export interface UserStats {
  total_hands: number
  correct: number
  score: number
  streak: number
  best_streak: number
  hand_accuracy: Record<HandName, SpotStats>
  spot_accuracy: Record<string, SpotStats>
  // per (spot_id + hand), for the "errors" mode
  errors: string[] // list of "spot_id__hand" that were missed
  last_played: string | null // ISO date
  daily: Record<string, DailyStats> // date "YYYY-MM-DD" → stats
}

const STORAGE_KEY = "appli_poker_stats_v1"
const ANCIENNE_CLE = "preflop_wizard_stats_v1" // ancien nom du projet : les stats déjà enregistrées sont reprises

export function emptyStats(): UserStats {
  return {
    total_hands: 0,
    correct: 0,
    score: 0,
    streak: 0,
    best_streak: 0,
    hand_accuracy: {},
    spot_accuracy: {},
    errors: [],
    last_played: null,
    daily: {},
  }
}

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function loadStats(): UserStats {
  if (typeof window === "undefined") return emptyStats()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(ANCIENNE_CLE)
    if (!raw) return emptyStats()
    const parsed = JSON.parse(raw) as UserStats
    return { ...emptyStats(), ...parsed }
  } catch {
    return emptyStats()
  }
}

export function saveStats(stats: UserStats): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // ignore
  }
}

export function resetStats(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
}

export interface RecordResult {
  correct: boolean
  spot_id: string
  hand: HandName
  points: number
}

/**
 * Met à jour les stats après une main jouée.
 */
export function recordResult(
  stats: UserStats,
  spot_id: string,
  hand: HandName,
  correct: boolean
): { stats: UserStats; points: number } {
  const streakMultiplier = 1 + Math.min(stats.streak, 10) * 0.1 // max 2x à streak 10
  const rawPoints = correct ? 10 : -5
  const points = correct ? Math.round(rawPoints * streakMultiplier) : rawPoints

  const nextStreak = correct ? stats.streak + 1 : 0
  const nextHandAcc = { ...stats.hand_accuracy }
  const handKey = hand
  nextHandAcc[handKey] = {
    correct: (nextHandAcc[handKey]?.correct ?? 0) + (correct ? 1 : 0),
    total: (nextHandAcc[handKey]?.total ?? 0) + 1,
  }
  const nextSpotAcc = { ...stats.spot_accuracy }
  nextSpotAcc[spot_id] = {
    correct: (nextSpotAcc[spot_id]?.correct ?? 0) + (correct ? 1 : 0),
    total: (nextSpotAcc[spot_id]?.total ?? 0) + 1,
  }
  const errorKey = `${spot_id}__${hand}`
  let nextErrors = stats.errors
  if (correct) {
    nextErrors = stats.errors.filter((e) => e !== errorKey)
  } else if (!stats.errors.includes(errorKey)) {
    nextErrors = [...stats.errors, errorKey]
  }

  const day = todayKey()
  const nextDaily = { ...stats.daily }
  const cur = nextDaily[day] ?? { hands: 0, correct: 0, points: 0 }
  nextDaily[day] = {
    hands: cur.hands + 1,
    correct: cur.correct + (correct ? 1 : 0),
    points: cur.points + points,
  }

  const updated: UserStats = {
    ...stats,
    total_hands: stats.total_hands + 1,
    correct: stats.correct + (correct ? 1 : 0),
    score: Math.max(0, stats.score + points),
    streak: nextStreak,
    best_streak: Math.max(stats.best_streak, nextStreak),
    hand_accuracy: nextHandAcc,
    spot_accuracy: nextSpotAcc,
    errors: nextErrors,
    last_played: new Date().toISOString(),
    daily: nextDaily,
  }
  return { stats: updated, points }
}

/**
 * Calcule les weights adaptatifs par spot pour drawSpot.
 * Spots avec accuracy < 70% → 3x plus fréquents.
 * Spots avec accuracy > 90% → 0,5x.
 * Autres → 1x.
 */
export function adaptiveSpotWeights(stats: UserStats): Record<string, number> {
  const weights: Record<string, number> = {}
  for (const [spot, acc] of Object.entries(stats.spot_accuracy)) {
    if (acc.total < 5) {
      weights[spot] = 1
      continue
    }
    const ratio = acc.correct / acc.total
    if (ratio < 0.7) weights[spot] = 3
    else if (ratio > 0.9) weights[spot] = 0.5
    else weights[spot] = 1
  }
  return weights
}
