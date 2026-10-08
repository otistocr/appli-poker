import type { HandName } from "@/types"

export const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"] as const

export const ALL_HANDS: HandName[] = (() => {
  const hands: HandName[] = []
  for (let i = 0; i < 13; i++) {
    for (let j = 0; j < 13; j++) {
      if (i === j) hands.push(`${RANKS[i]}${RANKS[j]}`)
      else if (j > i) hands.push(`${RANKS[i]}${RANKS[j]}s`)
      else hands.push(`${RANKS[j]}${RANKS[i]}o`)
    }
  }
  return hands
})()

export function handAt(row: number, col: number): HandName {
  if (row === col) return `${RANKS[row]}${RANKS[col]}`
  if (col > row) return `${RANKS[row]}${RANKS[col]}s`
  return `${RANKS[col]}${RANKS[row]}o`
}
