import fs from "node:fs"
import path from "node:path"

const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"]

function allHands() {
  const hands = []
  for (let i = 0; i < 13; i++) {
    for (let j = 0; j < 13; j++) {
      if (i === j) hands.push(`${RANKS[i]}${RANKS[j]}`)
      else if (j > i) hands.push(`${RANKS[i]}${RANKS[j]}s`)
      else hands.push(`${RANKS[j]}${RANKS[i]}o`)
    }
  }
  return hands
}

/**
 * Dans vs_open, "raise" = 3-bet ; "call" = flat/cold call ; "fold" = fold.
 * Dans vs_3bet, "raise" = 4-bet ; "call" = flat ; "fold" = fold.
 * Dans vs_4bet, "raise" = 5-bet all-in ; "call" = flat ; "fold" = fold.
 *
 * Les ranges ci-dessous sont des approximations pour MVP,
 * inspirées de GTOWizard / PokerCoaching, PAS de vrais solveurs.
 */

// ============================================================
// BB défense — vs OPEN de chaque position
// ============================================================
const BB_VS_OPEN = {
  UTG: {
    call: [
      "TT","99","88","77","66","55","44","33","22",
      "AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KTs","KJs","KQs","QTs","QJs","JTs","T9s","98s","87s","76s","65s","54s",
      "AJo","ATo","KQo","KJo","QJo",
    ],
    call_mix: { "AQo": 0.6, "JTo": 0.5 },
    raise: ["AA","KK","QQ","JJ","AKs","AKo","AQs"],
    raise_mix: { "AQo": 0.3, "A5s": 0.4, "A4s": 0.4 },
  },
  "UTG+1": {
    call: [
      "TT","99","88","77","66","55","44","33","22",
      "AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KTs","KJs","KQs","QTs","QJs","JTs","T9s","98s","87s","76s","65s","54s","64s",
      "AJo","ATo","KQo","KJo","QJo","JTo",
    ],
    call_mix: { "AQo": 0.6 },
    raise: ["AA","KK","QQ","JJ","AKs","AKo","AQs"],
    raise_mix: { "AQo": 0.3, "A5s": 0.5, "A4s": 0.4 },
  },
  HJ: {
    call: [
      "TT","99","88","77","66","55","44","33","22",
      "AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KTs","KJs","KQs","K9s","QTs","QJs","Q9s","JTs","J9s","T9s","T8s","98s","87s","76s","65s","54s","64s",
      "AJo","ATo","A9o","KQo","KJo","KTo","QJo","QTo","JTo",
    ],
    call_mix: { "AQo": 0.5, "K9o": 0.4, "J9o": 0.4 },
    raise: ["AA","KK","QQ","JJ","AKs","AKo"],
    raise_mix: { "AQo": 0.5, "A5s": 0.6, "A4s": 0.5, "A3s": 0.4, "A2s": 0.4 },
  },
  CO: {
    call: [
      "TT","99","88","77","66","55","44","33","22",
      "AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KTs","KJs","KQs","K9s","K8s","QTs","QJs","Q9s","Q8s","JTs","J9s","J8s","T9s","T8s","98s","97s","87s","76s","65s","54s","64s","53s","43s",
      "AJo","ATo","A9o","A8o","KQo","KJo","KTo","K9o","QJo","QTo","JTo","J9o","T9o",
    ],
    call_mix: { "AQo": 0.5, "Q9o": 0.4 },
    raise: ["AA","KK","QQ","JJ","TT","AKs","AKo"],
    raise_mix: { "AQo": 0.5, "AJs": 0.4, "A5s": 0.7, "A4s": 0.6, "A3s": 0.5, "A2s": 0.5, "K5s": 0.4 },
  },
  BTN: {
    call: [
      "99","88","77","66","55","44","33","22",
      "AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KTs","KJs","KQs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s",
      "QTs","QJs","Q9s","Q8s","Q7s","Q6s","Q5s",
      "JTs","J9s","J8s","J7s","T9s","T8s","T7s",
      "98s","97s","87s","86s","76s","75s","65s","64s","54s","53s","43s",
      "AJo","ATo","A9o","A8o","A7o","A6o","A5o","A4o","A3o","A2o",
      "KQo","KJo","KTo","K9o","K8o","QJo","QTo","Q9o","JTo","J9o","T9o","98o",
    ],
    call_mix: { "AQo": 0.4, "K7o": 0.4, "87o": 0.5 },
    raise: ["AA","KK","QQ","JJ","TT","AKs","AKo","AQs"],
    raise_mix: { "AQo": 0.6, "A5s": 0.7, "A4s": 0.6, "K5s": 0.5, "K4s": 0.4, "97s": 0.4, "76s": 0.4 },
  },
  SB: {
    call: [
      "88","77","66","55","44","33","22",
      "ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s",
      "Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s",
      "J9s","J8s","J7s","J6s","T8s","T7s","T6s","98s","97s","96s","87s","86s","85s","76s","75s","65s","64s","54s","53s","43s","32s",
      "ATo","A9o","A8o","A7o","A6o","A5o","A4o","A3o","A2o",
      "K9o","K8o","K7o","K6o","Q9o","Q8o","J9o","J8o","T9o","T8o","98o","87o","76o",
    ],
    call_mix: { "KJo": 0.5, "KTo": 0.6, "QTo": 0.6, "JTo": 0.7 },
    raise: ["AA","KK","QQ","JJ","TT","99","AKs","AKo","AQs","AJs","KQs","KJs"],
    raise_mix: { "AQo": 0.7, "AJo": 0.5, "A5s": 0.6, "K5s": 0.4, "T9s": 0.4 },
  },
}

// ============================================================
// SB défense — vs OPEN de BTN
// ============================================================
const SB_VS_OPEN_BTN = {
  call: [
    "TT","99","88","77","66","55","44","33","22",
    "AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
    "KTs","KJs","K9s","K8s","K7s",
    "QTs","QJs","Q9s","Q8s",
    "JTs","J9s","J8s","T9s","T8s","98s","87s","76s","65s","54s",
    "AJo","ATo","KJo","KTo","QJo","QTo","JTo",
  ],
  call_mix: { "KQo": 0.5 },
  raise: ["AA","KK","QQ","JJ","AKs","AKo","AQs","AQo","KQs"],
  raise_mix: { "AJo": 0.5, "A5s": 0.7, "A4s": 0.6, "A3s": 0.5, "A2s": 0.5, "K5s": 0.4, "76s": 0.4 },
}

// ============================================================
// BTN défense — vs OPEN de CO
// ============================================================
const BTN_VS_OPEN_CO = {
  call: [
    "TT","99","88","77","66","55","44","33","22",
    "AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
    "KTs","KJs","K9s","K8s","QTs","QJs","Q9s","JTs","J9s","T9s","T8s","98s","87s","76s","65s","54s",
    "AJo","ATo","KJo","KQo","QJo","JTo",
  ],
  call_mix: { "AQo": 0.5, "KTo": 0.6 },
  raise: ["AA","KK","QQ","JJ","AKs","AKo","AQs"],
  raise_mix: { "AQo": 0.5, "A5s": 0.7, "A4s": 0.5, "K5s": 0.4, "76s": 0.4, "65s": 0.4 },
}

// ============================================================
// vs 3-bet — l'openeur répond au 3-bet
// ============================================================
const UTG_VS_3BET = {
  call: ["JJ","TT","99","AQs","AJs","KQs"],
  call_mix: { "88": 0.6, "77": 0.4, "AJo": 0.3 },
  raise: ["AA","KK","QQ","AKs","AKo"], // 4-bet value
  raise_mix: { "A5s": 0.3, "A4s": 0.2 }, // 4-bet bluff blockers
}

const CO_VS_3BET = {
  call: ["JJ","TT","99","88","AQs","AJs","ATs","KQs","KJs","QJs"],
  call_mix: { "77": 0.6, "AJo": 0.4, "KQo": 0.4 },
  raise: ["AA","KK","QQ","AKs","AKo"],
  raise_mix: { "AQo": 0.3, "A5s": 0.4, "A4s": 0.3 },
}

const BTN_VS_3BET = {
  call: ["JJ","TT","99","88","77","AQs","AJs","ATs","A9s","A8s","KQs","KJs","KTs","QJs","QTs","JTs","T9s","98s","87s","76s"],
  call_mix: { "66": 0.7, "55": 0.5, "AJo": 0.4, "KQo": 0.5 },
  raise: ["AA","KK","QQ","AKs","AKo"],
  raise_mix: { "AQo": 0.4, "A5s": 0.5, "A4s": 0.4, "A3s": 0.3 },
}

// ============================================================
// vs 4-bet — le 3-betteur répond au 4-bet
// ============================================================
const BB_VS_4BET_BTN = {
  call: ["AKs","AKo"],
  call_mix: { "JJ": 0.5, "TT": 0.3 },
  raise: ["AA","KK","QQ"], // 5-bet all-in value
  raise_mix: { "A5s": 0.4, "AKs": 0.3 },
}

// ============================================================
// Builder
// ============================================================
function buildChart({ position, vs_action, vs_position, spec }) {
  const hands = {}
  for (const h of allHands()) {
    if (spec.raise?.includes(h)) hands[h] = { raise: 1, call: 0, fold: 0 }
    else if (spec.raise_mix?.[h] !== undefined) {
      const r = spec.raise_mix[h]
      if (spec.call?.includes(h)) hands[h] = { raise: r, call: 1 - r, fold: 0 }
      else hands[h] = { raise: r, call: 0, fold: 1 - r }
    } else if (spec.call?.includes(h)) hands[h] = { raise: 0, call: 1, fold: 0 }
    else if (spec.call_mix?.[h] !== undefined) {
      const c = spec.call_mix[h]
      hands[h] = { raise: 0, call: c, fold: 1 - c }
    } else hands[h] = { raise: 0, call: 0, fold: 1 }
  }
  return {
    format: "cash_6max",
    stack: 100,
    position,
    vs_action,
    vs_position,
    hands,
  }
}

const safeName = (p) => p.replace("+", "")
const outDir = path.resolve("lib/ranges/cash_6max_100bb")
fs.mkdirSync(outDir, { recursive: true })

// BB vs open
for (const [opener, spec] of Object.entries(BB_VS_OPEN)) {
  const chart = buildChart({ position: "BB", vs_action: "vs_open", vs_position: opener, spec })
  const file = path.join(outDir, `BB_vs_open_${safeName(opener)}.json`)
  fs.writeFileSync(file, JSON.stringify(chart, null, 2))
  console.log(`Wrote ${file}`)
}

// SB vs BTN
{
  const chart = buildChart({
    position: "SB",
    vs_action: "vs_open",
    vs_position: "BTN",
    spec: SB_VS_OPEN_BTN,
  })
  fs.writeFileSync(path.join(outDir, "SB_vs_open_BTN.json"), JSON.stringify(chart, null, 2))
  console.log("Wrote SB_vs_open_BTN.json")
}

// BTN vs CO
{
  const chart = buildChart({
    position: "BTN",
    vs_action: "vs_open",
    vs_position: "CO",
    spec: BTN_VS_OPEN_CO,
  })
  fs.writeFileSync(path.join(outDir, "BTN_vs_open_CO.json"), JSON.stringify(chart, null, 2))
  console.log("Wrote BTN_vs_open_CO.json")
}

// vs_3bet
{
  fs.writeFileSync(
    path.join(outDir, "UTG_vs_3bet.json"),
    JSON.stringify(buildChart({ position: "UTG", vs_action: "vs_3bet", spec: UTG_VS_3BET }), null, 2)
  )
  fs.writeFileSync(
    path.join(outDir, "CO_vs_3bet.json"),
    JSON.stringify(buildChart({ position: "CO", vs_action: "vs_3bet", spec: CO_VS_3BET }), null, 2)
  )
  fs.writeFileSync(
    path.join(outDir, "BTN_vs_3bet.json"),
    JSON.stringify(buildChart({ position: "BTN", vs_action: "vs_3bet", spec: BTN_VS_3BET }), null, 2)
  )
  console.log("Wrote vs_3bet ranges: UTG, CO, BTN")
}

// vs_4bet
{
  fs.writeFileSync(
    path.join(outDir, "BB_vs_4bet_BTN.json"),
    JSON.stringify(
      buildChart({
        position: "BB",
        vs_action: "vs_4bet",
        vs_position: "BTN",
        spec: BB_VS_4BET_BTN,
      }),
      null,
      2
    )
  )
  console.log("Wrote BB_vs_4bet_BTN.json")
}
