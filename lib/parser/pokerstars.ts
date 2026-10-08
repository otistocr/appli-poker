import type { Position, VsAction, HandName } from "@/types"
import { normalizeHoleCards } from "./normalize"
import type { Card } from "@/lib/postflop/classify"

export interface ParsedAction {
  player: string
  seat: number
  position: Position | null
  action: "fold" | "call" | "raise" | "check" | "bet"
  amount?: number
}

export interface ParsedStreet {
  cards: Card[] // flop = 3, turn = 1, river = 1
  actions: ParsedAction[]
  pot_before?: number // pot at start of the street (if detectable)
}

export interface ParsedHand {
  format: "PokerStars" | "Winamax"
  hand_id: string
  game: string
  stakes: string
  table: string
  max_players: number
  button_seat: number
  seats: { seat: number; player: string; stack: number }[]
  hero: string
  hero_seat: number | null
  hero_position: Position | null
  hero_cards_raw: string | null
  hero_cards: HandName | null
  preflop_actions: ParsedAction[]
  hero_action: ParsedAction | null
  vs_action: VsAction | null
  vs_position: Position | null
  flop: ParsedStreet | null
  turn: ParsedStreet | null
  river: ParsedStreet | null
  errors: string[]
}

const POSITIONS_6MAX_BY_OFFSET: Position[] = ["BTN", "SB", "BB", "UTG", "HJ", "CO"]

function assignPositions6max(
  seats: { seat: number; player: string }[],
  buttonSeat: number
): Record<string, Position> {
  const result: Record<string, Position> = {}
  const orderedSeats = [...seats].sort((a, b) => a.seat - b.seat)
  const btnIdx = orderedSeats.findIndex((s) => s.seat === buttonSeat)
  if (btnIdx === -1 || orderedSeats.length !== 6) return result
  for (let i = 0; i < orderedSeats.length; i++) {
    const offset = (i - btnIdx + orderedSeats.length) % orderedSeats.length
    result[orderedSeats[i].player] = POSITIONS_6MAX_BY_OFFSET[offset]
  }
  return result
}

function assignPositions5max(seats: { seat: number; player: string }[], buttonSeat: number) {
  const result: Record<string, Position> = {}
  const positions: Position[] = ["BTN", "SB", "BB", "UTG", "CO"]
  const orderedSeats = [...seats].sort((a, b) => a.seat - b.seat)
  const btnIdx = orderedSeats.findIndex((s) => s.seat === buttonSeat)
  if (btnIdx === -1 || orderedSeats.length !== 5) return result
  for (let i = 0; i < orderedSeats.length; i++) {
    const offset = (i - btnIdx + orderedSeats.length) % orderedSeats.length
    result[orderedSeats[i].player] = positions[offset]
  }
  return result
}

function parseCards(s: string): Card[] {
  return (
    s.match(/([2-9TJQKA])([shdc])/gi)?.map((c) => ({
      rank: c[0].toUpperCase() as Card["rank"],
      suit: c[1].toLowerCase() as Card["suit"],
    })) ?? []
  )
}

function tryParseAction(
  line: string,
  positions: Record<string, Position>,
  seats: { seat: number; player: string }[]
): ParsedAction | null {
  const foldM = line.match(/^(\S+):\s*folds/)
  if (foldM) {
    const p = foldM[1]
    return {
      player: p,
      seat: seats.find((s) => s.player === p)?.seat ?? 0,
      position: positions[p] ?? null,
      action: "fold",
    }
  }
  const callM = line.match(/^(\S+):\s*calls\s+\$?([\d,.]+)/)
  if (callM) {
    return {
      player: callM[1],
      seat: seats.find((s) => s.player === callM[1])?.seat ?? 0,
      position: positions[callM[1]] ?? null,
      action: "call",
      amount: parseFloat(callM[2].replace(",", "")),
    }
  }
  const raiseM = line.match(/^(\S+):\s*raises\s+\$?([\d,.]+)\s+to\s+\$?([\d,.]+)/)
  if (raiseM) {
    return {
      player: raiseM[1],
      seat: seats.find((s) => s.player === raiseM[1])?.seat ?? 0,
      position: positions[raiseM[1]] ?? null,
      action: "raise",
      amount: parseFloat(raiseM[3].replace(",", "")),
    }
  }
  const betM = line.match(/^(\S+):\s*bets\s+\$?([\d,.]+)/)
  if (betM) {
    return {
      player: betM[1],
      seat: seats.find((s) => s.player === betM[1])?.seat ?? 0,
      position: positions[betM[1]] ?? null,
      action: "bet",
      amount: parseFloat(betM[2].replace(",", "")),
    }
  }
  const checkM = line.match(/^(\S+):\s*checks/)
  if (checkM) {
    return {
      player: checkM[1],
      seat: seats.find((s) => s.player === checkM[1])?.seat ?? 0,
      position: positions[checkM[1]] ?? null,
      action: "check",
    }
  }
  return null
}

export function parseHand(text: string): ParsedHand {
  const errors: string[] = []
  const lines = text.split("\n").map((l) => l.trim())

  const isWinamax = /^Winamax Poker/.test(lines[0] ?? "")
  const format: "PokerStars" | "Winamax" = isWinamax ? "Winamax" : "PokerStars"

  const parsed: ParsedHand = {
    format,
    hand_id: "",
    game: "",
    stakes: "",
    table: "",
    max_players: 6,
    button_seat: 0,
    seats: [],
    hero: "Hero",
    hero_seat: null,
    hero_position: null,
    hero_cards_raw: null,
    hero_cards: null,
    preflop_actions: [],
    hero_action: null,
    vs_action: null,
    vs_position: null,
    flop: null,
    turn: null,
    river: null,
    errors,
  }

  // Header
  const headerRe = isWinamax
    ? /HandId:\s*#?(\S+)/
    : /Hand #(\d+):\s*(.+?)\s*\(([^)]+)\)/
  for (const line of lines) {
    const m = line.match(headerRe)
    if (m) {
      parsed.hand_id = m[1] ?? ""
      if (!isWinamax) {
        parsed.game = m[2] ?? ""
        parsed.stakes = m[3] ?? ""
      }
      break
    }
  }

  // Table + button
  for (const line of lines) {
    const tableMatch = line.match(
      /Table\s+'([^']+)'\s+(\d+)-max\s+Seat\s+#(\d+)\s+is\s+the\s+button/
    )
    if (tableMatch) {
      parsed.table = tableMatch[1]
      parsed.max_players = parseInt(tableMatch[2], 10)
      parsed.button_seat = parseInt(tableMatch[3], 10)
      break
    }
    const wnxTable = line.match(/Table:\s+'([^']+)'\s+(\d+)-max/)
    if (wnxTable) {
      parsed.table = wnxTable[1]
      parsed.max_players = parseInt(wnxTable[2], 10)
    }
    const wnxBtn = line.match(/Seat\s+#(\d+)\s+is\s+the\s+button/)
    if (wnxBtn) parsed.button_seat = parseInt(wnxBtn[1], 10)
  }

  // Seats
  for (const line of lines) {
    const m = line.match(/^Seat\s+(\d+):\s+(\S+)\s+\(\$?([\d,.]+)/)
    if (m) {
      parsed.seats.push({
        seat: parseInt(m[1], 10),
        player: m[2],
        stack: parseFloat(m[3].replace(",", "")),
      })
    }
  }

  // Dealt to hero
  for (const line of lines) {
    const m = line.match(/^Dealt to\s+(\S+)\s+\[([^\]]+)\]/)
    if (m) {
      parsed.hero = m[1]
      parsed.hero_cards_raw = m[2]
      parsed.hero_cards = normalizeHoleCards(m[2])
      break
    }
  }
  if (!parsed.hero_cards) errors.push("Impossible de déterminer les cartes du héros.")

  const heroSeat = parsed.seats.find((s) => s.player === parsed.hero)
  parsed.hero_seat = heroSeat?.seat ?? null

  // Positions
  let positions: Record<string, Position> = {}
  if (parsed.seats.length === 6) positions = assignPositions6max(parsed.seats, parsed.button_seat)
  else if (parsed.seats.length === 5) positions = assignPositions5max(parsed.seats, parsed.button_seat)
  else errors.push(`Nombre de sièges non supporté : ${parsed.seats.length} (attendu 5 ou 6).`)

  parsed.hero_position = positions[parsed.hero] ?? null

  // Walk through streets
  type Street = "preflop" | "flop" | "turn" | "river" | null
  let street: Street = null

  for (const line of lines) {
    // Street headers
    if (/\*\*\*\s*HOLE CARDS\s*\*\*\*/i.test(line)) {
      street = "preflop"
      continue
    }
    const flopM = line.match(/\*\*\*\s*FLOP\s*\*\*\*\s*\[([^\]]+)\]/i)
    if (flopM) {
      street = "flop"
      parsed.flop = { cards: parseCards(flopM[1]), actions: [] }
      continue
    }
    const turnM = line.match(/\*\*\*\s*TURN\s*\*\*\*\s*\[[^\]]+\]\s*\[([^\]]+)\]/i)
    if (turnM) {
      street = "turn"
      parsed.turn = { cards: parseCards(turnM[1]), actions: [] }
      continue
    }
    const riverM = line.match(/\*\*\*\s*RIVER\s*\*\*\*\s*\[[^\]]+\]\s*\[([^\]]+)\]/i)
    if (riverM) {
      street = "river"
      parsed.river = { cards: parseCards(riverM[1]), actions: [] }
      continue
    }
    if (/\*\*\*\s*(SHOW DOWN|SUMMARY)\s*\*\*\*/i.test(line)) {
      street = null
      continue
    }
    if (street === null) continue

    const action = tryParseAction(line, positions, parsed.seats)
    if (!action) continue

    if (street === "preflop") parsed.preflop_actions.push(action)
    else if (street === "flop" && parsed.flop) parsed.flop.actions.push(action)
    else if (street === "turn" && parsed.turn) parsed.turn.actions.push(action)
    else if (street === "river" && parsed.river) parsed.river.actions.push(action)
  }

  // Hero preflop action
  parsed.hero_action =
    parsed.preflop_actions.find((a) => a.player === parsed.hero) ?? null

  // Determine vs_action for preflop
  const actionsBeforeHero: ParsedAction[] = []
  for (const a of parsed.preflop_actions) {
    if (a.player === parsed.hero) break
    actionsBeforeHero.push(a)
  }

  const raisesBefore = actionsBeforeHero.filter((a) => a.action === "raise")
  if (raisesBefore.length === 0) parsed.vs_action = "RFI"
  else if (raisesBefore.length === 1) {
    parsed.vs_action = "vs_open"
    parsed.vs_position = raisesBefore[0].position
  } else if (raisesBefore.length === 2) {
    parsed.vs_action = "vs_3bet"
    parsed.vs_position = raisesBefore[1].position
  } else {
    parsed.vs_action = "vs_4bet"
    parsed.vs_position = raisesBefore[raisesBefore.length - 1].position
  }

  if (!parsed.hero_position && parsed.seats.length > 0) {
    errors.push("Impossible de déterminer la position du héros (sièges non standards).")
  }

  return parsed
}

/**
 * Détermine le rôle postflop du héros (opener_ip/opener_oop/3bettor_ip/3bettor_oop).
 * Basé sur le préflop.
 */
export function heroPostflopRole(
  parsed: ParsedHand
): "opener_ip" | "opener_oop" | "3bettor_ip" | "3bettor_oop" | null {
  if (!parsed.hero_position || !parsed.vs_action) return null

  // Hero has raised at some point preflop?
  const heroRaises = parsed.preflop_actions.filter(
    (a) => a.player === parsed.hero && a.action === "raise"
  ).length

  // Determine IP status : hero is IP if his position is later than opponent's postflop
  // For 6-max, BTN > CO > HJ > UTG+1 > UTG > SB > BB (postflop order)
  const POSTFLOP_ORDER: Position[] = ["BB", "SB", "UTG", "UTG+1", "HJ", "CO", "BTN"]
  const heroIdx = POSTFLOP_ORDER.indexOf(parsed.hero_position)

  // Find opponents in flop actions
  const flopActors = new Set(parsed.flop?.actions.map((a) => a.player) ?? [])
  flopActors.delete(parsed.hero)
  const opponentPositions = Array.from(flopActors)
    .map((p) => parsed.preflop_actions.find((a) => a.player === p)?.position)
    .filter((p): p is Position => !!p)

  const isIP =
    opponentPositions.length === 0
      ? true
      : opponentPositions.every((op) => heroIdx > POSTFLOP_ORDER.indexOf(op))

  // Classify role
  if (heroRaises >= 2) return isIP ? "3bettor_ip" : "3bettor_oop"
  if (heroRaises === 1 && parsed.vs_action === "RFI") return isIP ? "opener_ip" : "opener_oop"
  return isIP ? "opener_ip" : "opener_oop"
}
