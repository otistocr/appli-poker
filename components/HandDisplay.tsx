import type { HandName } from "@/types"

/**
 * Affiche visuellement 2 cartes correspondant à une main "AKs", "AKo", "77", etc.
 * Ce sont des exemples visuels — les couleurs sont attribuées de manière représentative.
 */
interface Props {
  hand: HandName
}

const SUIT_SPADE = "♠"
const SUIT_HEART = "♥"
const SUIT_DIAMOND = "♦"

function pickSuits(hand: HandName): [string, string, boolean] {
  // hand est de la forme "AA", "AKs", "AKo"
  if (hand.length === 2) {
    // paire — 2 suits différentes
    return [SUIT_SPADE, SUIT_HEART, false]
  }
  const suited = hand[2] === "s"
  if (suited) return [SUIT_SPADE, SUIT_SPADE, true]
  return [SUIT_SPADE, SUIT_HEART, false]
}

function suitColor(suit: string): string {
  return suit === SUIT_HEART || suit === SUIT_DIAMOND
    ? "text-red-500"
    : "text-neutral-900"
}

export default function HandDisplay({ hand }: Props) {
  const r1 = hand[0]
  const r2 = hand[1]
  const [s1, s2, suited] = pickSuits(hand)

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Card rank={r1} suit={s1} />
      <Card rank={r2} suit={s2} />
      <div className="ml-2 sm:ml-4 flex flex-col">
        <div className="text-lg sm:text-2xl font-bold text-neutral-100">{hand}</div>
        <div className="text-xs text-neutral-400">
          {hand.length === 2
            ? "Paire"
            : suited
              ? "Suited (assorties)"
              : "Offsuit (dépareillées)"}
        </div>
      </div>
    </div>
  )
}

function Card({ rank, suit }: { rank: string; suit: string }) {
  const color = suitColor(suit)
  return (
    <div className="relative w-16 h-24 sm:w-20 sm:h-28 bg-white rounded-lg shadow-lg flex flex-col justify-between p-2 select-none">
      <div className={`text-lg sm:text-xl font-bold ${color}`}>{rank}</div>
      <div className={`text-3xl sm:text-4xl text-center ${color}`}>{suit}</div>
      <div className={`text-lg sm:text-xl font-bold ${color} self-end rotate-180`}>
        {rank}
      </div>
    </div>
  )
}
