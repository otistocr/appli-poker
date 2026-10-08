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

const safeName = (p) => p.replace("+", "")
const outDir = path.resolve("lib/ranges/cash_6max_100bb")
fs.mkdirSync(outDir, { recursive: true })

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
  const chart = { format: "cash_6max", stack: 100, position, vs_action, hands }
  if (vs_position) chart.vs_position = vs_position
  return chart
}

function write(filename, chart) {
  fs.writeFileSync(path.join(outDir, filename), JSON.stringify(chart, null, 2))
  console.log(`Wrote ${filename}`)
}

/* ============================================================
   vs_open — defender vs opener
   ============================================================ */

// SB defense vs UTG/UTG+1/HJ/CO opens
const SB_VS_UTG = {
  call: [
    "TT","99","88","77","66",
    "AJs","ATs","A9s","A8s","A7s","A6s","A5s",
    "KTs","KJs","KQs","QJs","QTs","JTs","T9s","98s","87s","76s",
    "AJo","KJo","KQo","QJo",
  ],
  call_mix: { "55": 0.5, "44": 0.4, "AQo": 0.4 },
  raise: ["AA","KK","QQ","JJ","AKs","AKo","AQs"],
  raise_mix: { "A5s": 0.4, "A4s": 0.4, "A3s": 0.3, "A2s": 0.3, "K5s": 0.3 },
}

const SB_VS_UTG1 = {
  call: [
    "TT","99","88","77","66","55",
    "AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s",
    "KTs","KJs","KQs","QJs","QTs","JTs","T9s","98s","87s","76s","65s",
    "AJo","KJo","KQo","QJo","JTo",
  ],
  call_mix: { "44": 0.5, "AQo": 0.5 },
  raise: ["AA","KK","QQ","JJ","AKs","AKo","AQs"],
  raise_mix: { "A5s": 0.5, "A4s": 0.5, "A3s": 0.3, "A2s": 0.3, "K5s": 0.4 },
}

const SB_VS_HJ = {
  call: [
    "TT","99","88","77","66","55","44",
    "AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
    "KTs","KJs","KQs","K9s","QJs","QTs","Q9s","JTs","J9s","T9s","T8s","98s","87s","76s","65s","54s",
    "AJo","ATo","KJo","KQo","KTo","QJo","QTo","JTo",
  ],
  call_mix: { "33": 0.5, "AQo": 0.5 },
  raise: ["AA","KK","QQ","JJ","AKs","AKo","AQs"],
  raise_mix: { "A5s": 0.6, "A4s": 0.5, "A3s": 0.4, "A2s": 0.4, "K5s": 0.4, "76s": 0.3 },
}

const SB_VS_CO = {
  call: [
    "99","88","77","66","55","44","33","22",
    "AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
    "KTs","KJs","K9s","K8s","K7s","QJs","QTs","Q9s","Q8s","JTs","J9s","J8s","T9s","T8s","98s","97s","87s","76s","65s","54s","64s","53s",
    "AJo","ATo","A9o","KJo","KTo","QJo","QTo","JTo","J9o",
  ],
  call_mix: { "AQo": 0.5, "KQo": 0.6 },
  raise: ["AA","KK","QQ","JJ","TT","AKs","AKo","AQs","KQs"],
  raise_mix: { "AQo": 0.5, "A5s": 0.7, "A4s": 0.6, "A3s": 0.5, "A2s": 0.5, "K5s": 0.5, "76s": 0.4, "65s": 0.4 },
}

// BTN defense vs UTG/UTG+1/HJ opens (BTN vs CO already exists)
const BTN_VS_UTG = {
  call: [
    "TT","99","88","77","66","55",
    "AJs","ATs","A9s","A8s","A7s","A6s","A5s",
    "KTs","KJs","KQs","K9s","QJs","QTs","JTs","T9s","98s","87s","76s","65s",
    "AJo","ATo","KJo","KQo","QJo",
  ],
  call_mix: { "44": 0.5, "AQo": 0.5 },
  raise: ["AA","KK","QQ","JJ","AKs","AKo","AQs"],
  raise_mix: { "A5s": 0.5, "A4s": 0.5, "K5s": 0.3 },
}

const BTN_VS_UTG1 = {
  call: [
    "TT","99","88","77","66","55","44",
    "AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
    "KTs","KJs","KQs","K9s","QJs","QTs","Q9s","JTs","J9s","T9s","T8s","98s","87s","76s","65s","54s",
    "AJo","ATo","KJo","KQo","QJo","JTo",
  ],
  call_mix: { "33": 0.4, "AQo": 0.6 },
  raise: ["AA","KK","QQ","JJ","AKs","AKo","AQs"],
  raise_mix: { "A5s": 0.6, "A4s": 0.5, "A3s": 0.4, "K5s": 0.4 },
}

const BTN_VS_HJ = {
  call: [
    "TT","99","88","77","66","55","44","33","22",
    "AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
    "KTs","KJs","KQs","K9s","K8s","QJs","QTs","Q9s","Q8s","JTs","J9s","J8s","T9s","T8s","98s","87s","76s","65s","54s","64s","53s",
    "AJo","ATo","A9o","KJo","KQo","KTo","QJo","QTo","JTo",
  ],
  call_mix: { "AQo": 0.5, "K9o": 0.4 },
  raise: ["AA","KK","QQ","JJ","AKs","AKo","AQs"],
  raise_mix: { "AQo": 0.5, "A5s": 0.7, "A4s": 0.6, "A3s": 0.5, "K5s": 0.5, "76s": 0.4 },
}

// CO defense vs UTG/UTG+1/HJ (CO doesn't defend vs BTN/SB — CO opens before them)
const CO_VS_UTG = {
  call: [
    "TT","99","88","77","66","55",
    "AJs","ATs","A9s","A8s","A7s","A6s","A5s",
    "KJs","KQs","KTs","QJs","QTs","JTs","T9s","98s","87s","76s",
    "AJo","KQo","KJo",
  ],
  call_mix: { "44": 0.4, "AQo": 0.4 },
  raise: ["AA","KK","QQ","JJ","AKs","AKo","AQs"],
  raise_mix: { "A5s": 0.4, "A4s": 0.4, "K5s": 0.3 },
}

const CO_VS_UTG1 = {
  call: [
    "TT","99","88","77","66","55","44",
    "AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s",
    "KTs","KJs","KQs","K9s","QJs","QTs","JTs","T9s","98s","87s","76s","65s",
    "AJo","KJo","KQo","QJo","JTo",
  ],
  call_mix: { "33": 0.4, "AQo": 0.5 },
  raise: ["AA","KK","QQ","JJ","AKs","AKo","AQs"],
  raise_mix: { "A5s": 0.5, "A4s": 0.5, "K5s": 0.4 },
}

const CO_VS_HJ = {
  call: [
    "TT","99","88","77","66","55","44","33",
    "AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
    "KTs","KJs","KQs","K9s","QJs","QTs","Q9s","JTs","J9s","T9s","T8s","98s","87s","76s","65s","54s","64s",
    "AJo","ATo","KJo","KQo","KTo","QJo","QTo","JTo",
  ],
  call_mix: { "AQo": 0.5 },
  raise: ["AA","KK","QQ","JJ","AKs","AKo","AQs"],
  raise_mix: { "AQo": 0.5, "A5s": 0.6, "A4s": 0.5, "A3s": 0.4, "K5s": 0.4, "76s": 0.4 },
}

// HJ defense vs UTG/UTG+1
const HJ_VS_UTG = {
  call: [
    "99","88","77","66","55",
    "AJs","ATs","A9s","A8s","A7s","A6s","A5s",
    "KJs","KQs","KTs","QJs","QTs","JTs","T9s","98s","87s","76s",
    "AJo","KQo","KJo",
  ],
  call_mix: { "TT": 0.5, "AQo": 0.4 },
  raise: ["AA","KK","QQ","JJ","AKs","AKo","AQs"],
  raise_mix: { "A5s": 0.4, "A4s": 0.3, "K5s": 0.3 },
}

const HJ_VS_UTG1 = {
  call: [
    "TT","99","88","77","66","55","44",
    "AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s",
    "KJs","KQs","KTs","QJs","QTs","JTs","T9s","98s","87s","76s","65s",
    "AJo","KQo","KJo","QJo",
  ],
  call_mix: { "33": 0.4, "AQo": 0.4 },
  raise: ["AA","KK","QQ","JJ","AKs","AKo","AQs"],
  raise_mix: { "A5s": 0.5, "A4s": 0.4, "K5s": 0.3 },
}

// UTG+1 defense vs UTG
const UTG1_VS_UTG = {
  call: [
    "99","88","77","66","55",
    "AJs","ATs","A9s","A8s",
    "KJs","KQs","KTs","QJs","QTs","JTs","T9s","98s","87s",
    "AJo","KQo",
  ],
  call_mix: { "TT": 0.6, "AQo": 0.3 },
  raise: ["AA","KK","QQ","JJ","AKs","AKo","AQs"],
  raise_mix: { "A5s": 0.3, "A4s": 0.3 },
}

/* ============================================================
   vs_3bet — opener responds to 3-bet (aggregated per opener)
   Already have: UTG_vs_3bet, CO_vs_3bet, BTN_vs_3bet
   Adding: UTG+1, HJ, SB
   ============================================================ */

const UTG1_VS_3BET = {
  call: ["JJ","TT","99","AQs","AJs","KQs"],
  call_mix: { "88": 0.6, "77": 0.4, "AJo": 0.3, "KQo": 0.3 },
  raise: ["AA","KK","QQ","AKs","AKo"],
  raise_mix: { "A5s": 0.3, "A4s": 0.2 },
}

const HJ_VS_3BET = {
  call: ["JJ","TT","99","88","AQs","AJs","ATs","KQs","KJs","QJs"],
  call_mix: { "77": 0.6, "66": 0.4, "AJo": 0.4, "KQo": 0.4 },
  raise: ["AA","KK","QQ","AKs","AKo"],
  raise_mix: { "AQo": 0.3, "A5s": 0.4, "A4s": 0.3 },
}

const SB_VS_3BET = {
  call: ["JJ","TT","99","88","77","AQs","AJs","ATs","KQs","KJs","KTs","QJs","QTs","JTs"],
  call_mix: { "66": 0.6, "55": 0.4, "AJo": 0.4, "KQo": 0.5, "T9s": 0.5 },
  raise: ["AA","KK","QQ","AKs","AKo"],
  raise_mix: { "AQo": 0.4, "A5s": 0.5, "A4s": 0.4 },
}

/* ============================================================
   vs_4bet — 3-better responds to 4-bet
   Already have: BB_vs_4bet_BTN
   Adding: SB, BTN, CO, HJ (aggregate), + BB_vs_4bet_CO
   ============================================================ */

const SB_VS_4BET = {
  call: ["AKs","AKo"],
  call_mix: { "JJ": 0.5, "TT": 0.3, "AQs": 0.4 },
  raise: ["AA","KK","QQ"],
  raise_mix: { "A5s": 0.4, "AKs": 0.4 },
}

const BTN_VS_4BET = {
  call: ["AKs","AKo","AQs"],
  call_mix: { "JJ": 0.6, "TT": 0.4, "KQs": 0.3 },
  raise: ["AA","KK","QQ"],
  raise_mix: { "A5s": 0.4, "AKs": 0.3, "AKo": 0.3 },
}

const CO_VS_4BET = {
  call: ["AKs","AKo"],
  call_mix: { "JJ": 0.5, "TT": 0.3 },
  raise: ["AA","KK","QQ"],
  raise_mix: { "A5s": 0.4, "AKs": 0.4 },
}

const HJ_VS_4BET = {
  call: ["AKs","AKo"],
  call_mix: { "JJ": 0.4, "TT": 0.2 },
  raise: ["AA","KK","QQ"],
  raise_mix: { "A5s": 0.3, "AKs": 0.4 },
}

const BB_VS_4BET_CO = {
  call: ["AKs","AKo"],
  call_mix: { "JJ": 0.5, "TT": 0.3 },
  raise: ["AA","KK","QQ"],
  raise_mix: { "A5s": 0.4, "AKs": 0.3 },
}

/* ============================================================
   Generate all
   ============================================================ */

// vs_open additions
write("SB_vs_open_UTG.json", buildChart({ position: "SB", vs_action: "vs_open", vs_position: "UTG", spec: SB_VS_UTG }))
write("SB_vs_open_UTG1.json", buildChart({ position: "SB", vs_action: "vs_open", vs_position: "UTG+1", spec: SB_VS_UTG1 }))
write("SB_vs_open_HJ.json", buildChart({ position: "SB", vs_action: "vs_open", vs_position: "HJ", spec: SB_VS_HJ }))
write("SB_vs_open_CO.json", buildChart({ position: "SB", vs_action: "vs_open", vs_position: "CO", spec: SB_VS_CO }))
write("BTN_vs_open_UTG.json", buildChart({ position: "BTN", vs_action: "vs_open", vs_position: "UTG", spec: BTN_VS_UTG }))
write("BTN_vs_open_UTG1.json", buildChart({ position: "BTN", vs_action: "vs_open", vs_position: "UTG+1", spec: BTN_VS_UTG1 }))
write("BTN_vs_open_HJ.json", buildChart({ position: "BTN", vs_action: "vs_open", vs_position: "HJ", spec: BTN_VS_HJ }))
write("CO_vs_open_UTG.json", buildChart({ position: "CO", vs_action: "vs_open", vs_position: "UTG", spec: CO_VS_UTG }))
write("CO_vs_open_UTG1.json", buildChart({ position: "CO", vs_action: "vs_open", vs_position: "UTG+1", spec: CO_VS_UTG1 }))
write("CO_vs_open_HJ.json", buildChart({ position: "CO", vs_action: "vs_open", vs_position: "HJ", spec: CO_VS_HJ }))
write("HJ_vs_open_UTG.json", buildChart({ position: "HJ", vs_action: "vs_open", vs_position: "UTG", spec: HJ_VS_UTG }))
write("HJ_vs_open_UTG1.json", buildChart({ position: "HJ", vs_action: "vs_open", vs_position: "UTG+1", spec: HJ_VS_UTG1 }))
write("UTG1_vs_open_UTG.json", buildChart({ position: "UTG+1", vs_action: "vs_open", vs_position: "UTG", spec: UTG1_VS_UTG }))

// vs_3bet additions
write("UTG1_vs_3bet.json", buildChart({ position: "UTG+1", vs_action: "vs_3bet", spec: UTG1_VS_3BET }))
write("HJ_vs_3bet.json", buildChart({ position: "HJ", vs_action: "vs_3bet", spec: HJ_VS_3BET }))
write("SB_vs_3bet.json", buildChart({ position: "SB", vs_action: "vs_3bet", spec: SB_VS_3BET }))

// vs_4bet additions
write("SB_vs_4bet.json", buildChart({ position: "SB", vs_action: "vs_4bet", spec: SB_VS_4BET }))
write("BTN_vs_4bet.json", buildChart({ position: "BTN", vs_action: "vs_4bet", spec: BTN_VS_4BET }))
write("CO_vs_4bet.json", buildChart({ position: "CO", vs_action: "vs_4bet", spec: CO_VS_4BET }))
write("HJ_vs_4bet.json", buildChart({ position: "HJ", vs_action: "vs_4bet", spec: HJ_VS_4BET }))
write("BB_vs_4bet_CO.json", buildChart({ position: "BB", vs_action: "vs_4bet", vs_position: "CO", spec: BB_VS_4BET_CO }))

console.log(`\nDone. ${21} new range files.`)
