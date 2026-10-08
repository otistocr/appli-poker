import type { BoardTexture, Card } from "./classify"
import { classifyFlop } from "./classify"

const RANK_VALUE: Record<string, number> = {
  A: 14, K: 13, Q: 12, J: 11, T: 10, "9": 9, "8": 8, "7": 7, "6": 6, "5": 5, "4": 4, "3": 3, "2": 2,
}

export type CBetRole = "opener_ip" | "opener_oop" | "3bettor_ip" | "3bettor_oop"

export type Sizing = "small" | "medium" | "large" | "polar"

export interface CBetRecommendation {
  frequency: number // 0-100, percentage of range to c-bet
  sizing: Sizing
  sizingPct: string // display "25%", "33%", "66%", "100%+"
  rangeAdvantage: "us" | "them" | "neutral"
  rationale: string
  bluffCandidates: string
}

const SIZING_TO_PCT: Record<Sizing, string> = {
  small: "25-33% pot",
  medium: "50% pot",
  large: "66-75% pot",
  polar: "100%+ pot (overbet)",
}

/**
 * Recommendation heuristics based on board texture + player role.
 * Grossly simplified but educationally sound.
 */
export function recommendCBet(
  texture: BoardTexture,
  role: CBetRole = "opener_ip"
): CBetRecommendation {
  const isOOP = role === "opener_oop" || role === "3bettor_oop"

  // Base recommendation on overall dry/semi-wet/wet
  let freq = 60
  let sizing: Sizing = "medium"
  let rangeAdvantage: "us" | "them" | "neutral" = "neutral"
  let rationale = ""
  let bluffCandidates = "Toutes tes mains sans equity showdown."

  // Dry boards — favor the pre-flop aggressor big time
  if (texture.overall === "dry") {
    if (texture.highness === "high") {
      freq = isOOP ? 70 : 90
      sizing = "small"
      rangeAdvantage = "us"
      rationale =
        "Board sec avec carte haute (A/K/Q). Ta range préflop domine (paires, top pair). C-bet quasi range à petit sizing."
      bluffCandidates =
        "Toute ta range peut bet. Priorise blockers de flush et bottom connectors avec backdoor."
    } else if (texture.highness === "mid") {
      freq = isOOP ? 60 : 75
      sizing = "small"
      rangeAdvantage = "us"
      rationale =
        "Board sec J/T/9-high. Encore favorable au raiseur, mais le défenseur a plus de sets et paires moyennes."
    } else {
      freq = isOOP ? 40 : 60
      sizing = "medium"
      rangeAdvantage = "neutral"
      rationale =
        "Board bas et sec. Le défenseur (BB notamment) a plus de paires basses et sets. C-bet plus sélectif."
    }
  }
  // Semi-wet boards
  else if (texture.overall === "semi_wet") {
    if (texture.highness === "high") {
      freq = isOOP ? 55 : 70
      sizing = "medium"
      rangeAdvantage = "us"
      rationale =
        "Board high avec un peu de connectivité ou couleur. Toujours favorable à ta range, mais moins qu'un board sec."
      bluffCandidates =
        "Mains avec backdoor flush/straight draws idéales pour semi-bluff."
    } else {
      freq = isOOP ? 45 : 55
      sizing = "medium"
      rangeAdvantage = "neutral"
      rationale =
        "Board médium semi-connecté. Ranges à peu près équivalentes. Prends des sizings moyens."
    }
  }
  // Wet boards — favor the defender
  else {
    freq = isOOP ? 30 : 45
    sizing = "large"
    rangeAdvantage = "them"
    rationale =
      "Board wet (connecté, coloré, ou les deux). Le défenseur a plus de tirages et de mains connectées. C-bet à basse fréquence avec sizing polarisé."
    bluffCandidates =
      "Uniquement mains avec fort draw (flush draw + gutshot, open-ended). Le reste check-back."
    // Overrides for very wet boards
    if (texture.suitedness === "monotone") {
      freq = 20
      sizing = "polar"
      rationale =
        "Board monotone — 3 cartes de la même couleur. Ton adversaire complète des flushes. C-bet uniquement avec nut flush ou set + overpair."
      bluffCandidates =
        "Mains avec l'As de la couleur du board comme blocker."
    }
  }

  // Adjustments for pairing
  if (texture.pairing === "paired") {
    freq = Math.min(freq + 15, 95)
    sizing = "small"
    rationale +=
      " ⨯ Le board est apparié : personne ne touche vraiment, la MDF chute. C-bet plus large à petit sizing pour prendre le pot."
  } else if (texture.pairing === "trips") {
    freq = 50
    sizing = "small"
    rationale =
      "Board trips — presque personne n'a la carte. Fréquence de c-bet moyenne à petit sizing, souvent check-back."
  }

  // Overrides for 3-bet pot roles (smaller SPR)
  if (role === "3bettor_ip" || role === "3bettor_oop") {
    freq = Math.min(freq + 10, 95)
    rationale +=
      " ⨯ En pot 3-bet, ton SPR est plus petit, ta range est concentrée sur les grosses paires. C-bet plus fréquent."
  }

  return {
    frequency: Math.round(freq),
    sizing,
    sizingPct: SIZING_TO_PCT[sizing],
    rangeAdvantage,
    rationale,
    bluffCandidates,
  }
}

/* ============================================================
   Turn barrel recommendation
   ============================================================ */

interface TurnCardImpact {
  favorsAggressor: boolean
  scaresAggressor: boolean
  completesFlushDraw: boolean
  completesStraightDraw: boolean
  isBlank: boolean
  description: string
}

function categorizeTurnCard(flop: Card[], turn: Card): TurnCardImpact {
  const flopSuits = flop.map((c) => c.suit)
  const flopValues = flop.map((c) => RANK_VALUE[c.rank])
  const turnValue = RANK_VALUE[turn.rank]
  const maxFlopValue = Math.max(...flopValues)

  const flushDrawExists = new Set(flopSuits).size < 3
  const completesFlushDraw = flushDrawExists && flopSuits.includes(turn.suit)

  const straightPossibleGap = Math.max(...flopValues) - Math.min(...flopValues) <= 4
  const completesStraightDraw =
    straightPossibleGap &&
    turnValue >= Math.min(...flopValues) - 2 &&
    turnValue <= Math.max(...flopValues) + 2

  const isOvercard = turnValue > maxFlopValue
  const isBroadway = turnValue >= 11 // J or higher

  const favorsAggressor = isOvercard && isBroadway
  const scaresAggressor =
    completesFlushDraw || completesStraightDraw || (isOvercard && !isBroadway)
  const isBlank = !isOvercard && !completesFlushDraw && !completesStraightDraw

  let description = ""
  if (isBlank) description = "Turn blank — texture inchangée, tu barrels."
  else if (favorsAggressor)
    description = "Turn overcard broadway — améliore ta range, barrel fort."
  else if (completesFlushDraw)
    description = "Turn complète une couleur — attention, ta range fait moins de sets nuts."
  else if (completesStraightDraw)
    description =
      "Turn complète une straight potentielle — ralentis avec les mains marginales."
  else description = "Turn moyen — texture légèrement modifiée."

  return {
    favorsAggressor,
    scaresAggressor,
    completesFlushDraw,
    completesStraightDraw,
    isBlank,
    description,
  }
}

export function recommendTurn(
  flop: Card[],
  turn: Card,
  role: CBetRole = "opener_ip"
): CBetRecommendation {
  const flopTexture = classifyFlop(flop)
  const flopRec = recommendCBet(flopTexture, role)
  const impact = categorizeTurnCard(flop, turn)
  const isOOP = role === "opener_oop" || role === "3bettor_oop"

  // Base freq starts from flop recommendation
  let freq = flopRec.frequency
  let sizing: Sizing = "medium"

  // Adjust based on turn impact
  if (impact.isBlank) {
    freq = Math.max(50, freq - 5)
    sizing = "medium"
  } else if (impact.favorsAggressor) {
    freq = Math.min(80, freq + 15)
    sizing = "large"
  } else if (impact.scaresAggressor) {
    freq = Math.max(25, freq - 20)
    sizing = impact.completesFlushDraw || impact.completesStraightDraw ? "polar" : "medium"
  }

  if (isOOP) freq -= 5

  const rangeAdvantage = impact.favorsAggressor
    ? "us"
    : impact.scaresAggressor
      ? "them"
      : flopRec.rangeAdvantage

  const rationale = `${impact.description} Le sizing recommandé est ${SIZING_TO_PCT[sizing]}. C'est un double-barrel qui pressure les mains marginales que l'adversaire a call au flop.`

  return {
    frequency: Math.round(Math.max(15, Math.min(95, freq))),
    sizing,
    sizingPct: SIZING_TO_PCT[sizing],
    rangeAdvantage,
    rationale,
    bluffCandidates:
      "Mains avec fold equity mais peu d'equity showdown (busted draws, overcards à ta range).",
  }
}

/* ============================================================
   River recommendation
   ============================================================ */

export function recommendRiver(
  flop: Card[],
  turn: Card,
  river: Card,
  role: CBetRole = "opener_ip"
): CBetRecommendation {
  // River strategy is highly polarized: value bets or bluffs, rarely mid.
  // Simplified heuristic based on how "scary" the final board is.

  const board = [...flop, turn, river]
  const suits = board.map((c) => c.suit)
  const values = board.map((c) => RANK_VALUE[c.rank])
  const uniqueSuits = new Set(suits).size

  const flushOnBoard = uniqueSuits < 3 && suits.filter((s) => suits[0] === s).length >= 3
  const uniqueValues = new Set(values).size
  const boardPaired = uniqueValues < 5
  const isConnected = Math.max(...values) - Math.min(...values) <= 5

  let freq = 55
  let sizing: Sizing = "large"

  if (flushOnBoard) {
    freq = 30
    sizing = "polar"
  } else if (boardPaired) {
    freq = 45
    sizing = "medium"
  } else if (isConnected) {
    freq = 40
    sizing = "large"
  } else {
    freq = 55
    sizing = "large"
  }

  if (role === "opener_oop" || role === "3bettor_oop") freq -= 5
  if (role.startsWith("3bettor")) freq += 5

  const rationale = `Décision river polarisée : tu bet uniquement value ou bluff, jamais medium. ${
    flushOnBoard
      ? "Board avec couleur possible — bet seulement nut flush ou bluff sélectif."
      : boardPaired
        ? "Board apparié — full houses possibles, tue les bluffs de l'adversaire, mais aussi les tiens."
        : "Board unpaired — value tes tops, bluff tes busted draws avec blockers."
  }`

  return {
    frequency: Math.round(Math.max(15, Math.min(90, freq))),
    sizing,
    sizingPct: SIZING_TO_PCT[sizing],
    rangeAdvantage: "neutral",
    rationale,
    bluffCandidates:
      "Uniquement mains avec zéro equity showdown ET blockers pertinents (as de la couleur si flush possible, cartes qui bloquent les nuts).",
  }
}
