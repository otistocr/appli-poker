export type HandName = string

export type Action = "raise" | "call" | "fold"

export type Format = "cash_6max" | "cash_9max" | "mtt"

export type Position = "UTG" | "UTG+1" | "UTG+2" | "MP" | "LJ" | "HJ" | "CO" | "BTN" | "SB" | "BB"

export type VsAction = "RFI" | "vs_open" | "vs_3bet" | "vs_4bet"

export interface HandFrequency {
  raise: number
  call: number
  fold: number
}

export interface RangeChart {
  format: Format
  stack: number
  position: Position
  vs_action: VsAction
  vs_position?: Position
  hands: Record<HandName, HandFrequency>
}

export interface DrillSpot {
  chart: RangeChart
  hand: HandName
  correct_actions: Action[]
  primary_action: Action
}

export interface Session {
  date: string
  hands_played: number
  correct: number
  duration_seconds: number
}

export interface UserStats {
  total_hands: number
  correct: number
  streak: number
  best_streak: number
  xp: number
  hand_accuracy: Record<HandName, { correct: number; total: number }>
  spot_accuracy: Record<string, { correct: number; total: number }>
  sessions: Session[]
}
