/**
 * Board texture classifier.
 * Takes 3 flop cards, returns a multi-dimensional texture analysis.
 */

export type Rank = "A" | "K" | "Q" | "J" | "T" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2"
export type Suit = "s" | "h" | "d" | "c"

export interface Card {
  rank: Rank
  suit: Suit
}

const RANK_VALUE: Record<Rank, number> = {
  A: 14, K: 13, Q: 12, J: 11, T: 10, "9": 9, "8": 8, "7": 7, "6": 6, "5": 5, "4": 4, "3": 3, "2": 2,
}

export type Highness = "high" | "mid" | "low"
export type Pairing = "unpaired" | "paired" | "trips"
export type Suitedness = "rainbow" | "two_tone" | "monotone"
export type Connectedness = "disconnected" | "one_gap" | "connected"
export type Overall = "dry" | "semi_wet" | "wet"

export interface BoardTexture {
  highness: Highness
  pairing: Pairing
  suitedness: Suitedness
  connectedness: Connectedness
  overall: Overall
  straightDrawsPossible: number // number of possible 4-out+ straight draws
  hasBroadway: boolean // A, K, Q, J on board
}

function sortedByRank(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => RANK_VALUE[b.rank] - RANK_VALUE[a.rank])
}

export function classifyFlop(flop: Card[]): BoardTexture {
  if (flop.length !== 3) throw new Error("Flop must have exactly 3 cards")

  const sorted = sortedByRank(flop)
  const values = sorted.map((c) => RANK_VALUE[c.rank])
  const suits = sorted.map((c) => c.suit)
  const ranks = sorted.map((c) => c.rank)

  // Highness — based on the highest card
  const topValue = values[0]
  const highness: Highness =
    topValue >= 12 ? "high" : topValue >= 9 ? "mid" : "low"

  // Pairing
  const uniqueRanks = new Set(ranks).size
  const pairing: Pairing =
    uniqueRanks === 1 ? "trips" : uniqueRanks === 2 ? "paired" : "unpaired"

  // Suitedness
  const uniqueSuits = new Set(suits).size
  const suitedness: Suitedness =
    uniqueSuits === 1 ? "monotone" : uniqueSuits === 2 ? "two_tone" : "rainbow"

  // Connectedness — measure gap between adjacent cards
  const [v1, v2, v3] = values
  const gaps = [v1 - v2, v2 - v3]
  // handle A-low straights (A can be low with 2,3,4,5)
  const maxGap = Math.max(...gaps)
  const totalGap = v1 - v3
  const connectedness: Connectedness =
    totalGap <= 4 && pairing === "unpaired"
      ? maxGap <= 1
        ? "connected"
        : "one_gap"
      : "disconnected"

  // Count possible straight draws (rough heuristic)
  let straightDrawsPossible = 0
  if (pairing !== "trips") {
    if (totalGap === 2) straightDrawsPossible = 4 // very connected
    else if (totalGap === 3) straightDrawsPossible = 3
    else if (totalGap === 4) straightDrawsPossible = 2
    else if (totalGap === 5) straightDrawsPossible = 1
  }

  const hasBroadway = ranks.some((r) => ["A", "K", "Q", "J"].includes(r))

  // Overall — heuristic aggregation
  let wetness = 0
  if (suitedness === "monotone") wetness += 3
  else if (suitedness === "two_tone") wetness += 1
  if (connectedness === "connected") wetness += 3
  else if (connectedness === "one_gap") wetness += 1
  if (straightDrawsPossible >= 3) wetness += 1
  if (pairing === "paired") wetness -= 1
  if (pairing === "trips") wetness -= 2

  const overall: Overall = wetness >= 3 ? "wet" : wetness >= 1 ? "semi_wet" : "dry"

  return {
    highness,
    pairing,
    suitedness,
    connectedness,
    overall,
    straightDrawsPossible,
    hasBroadway,
  }
}

/* ============================================================
   Helpers to work with card notation strings
   ============================================================ */

export function parseCard(s: string): Card | null {
  if (s.length !== 2) return null
  const rank = s[0].toUpperCase() as Rank
  const suit = s[1].toLowerCase() as Suit
  if (!(rank in RANK_VALUE)) return null
  if (!["s", "h", "d", "c"].includes(suit)) return null
  return { rank, suit }
}

export function cardToString(c: Card): string {
  return `${c.rank}${c.suit}`
}

export function suitSymbol(suit: Suit): string {
  return { s: "♠", h: "♥", d: "♦", c: "♣" }[suit]
}

export function suitColor(suit: Suit): "red" | "black" {
  return suit === "h" || suit === "d" ? "red" : "black"
}
