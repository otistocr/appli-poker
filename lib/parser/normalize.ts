import type { HandName } from "@/types"

const RANK_ORDER: Record<string, number> = {
  A: 0, K: 1, Q: 2, J: 3, T: 4, "9": 5, "8": 6, "7": 7, "6": 8, "5": 9, "4": 10, "3": 11, "2": 12,
}

/**
 * Convertit "AhKh" ou "Ah Kh" en HandName standard ("AKs", "AKo", "AA").
 * Accepte les formats: AhKh, Ah Kh, ah kh, A♠K♥, [Ah Kh].
 */
export function normalizeHoleCards(input: string): HandName | null {
  const cleaned = input
    .replace(/[\[\]]/g, "")
    .replace(/[♠♥♦♣]/g, (m) => ({ "♠": "s", "♥": "h", "♦": "d", "♣": "c" })[m] ?? m)
    .trim()

  const cards = cleaned.match(/([2-9TJQKA])[shdc]/gi)
  if (!cards || cards.length !== 2) return null

  const rank1 = cards[0][0].toUpperCase()
  const rank2 = cards[1][0].toUpperCase()
  const suit1 = cards[0][1].toLowerCase()
  const suit2 = cards[1][1].toLowerCase()

  if (RANK_ORDER[rank1] === undefined || RANK_ORDER[rank2] === undefined) return null

  // Pair
  if (rank1 === rank2) return `${rank1}${rank2}`
  // Order by rank strength (A>K>...>2)
  const [high, low] =
    RANK_ORDER[rank1] < RANK_ORDER[rank2] ? [rank1, rank2] : [rank2, rank1]
  const suited = suit1 === suit2
  return `${high}${low}${suited ? "s" : "o"}`
}
