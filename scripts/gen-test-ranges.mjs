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
 * Ranges MVP simplifiées (approximations, PAS du vrai GTO — à remplacer plus tard)
 * On définit des tiers de mains (raise 100%, raise mixte, fold) par position.
 * Ce qui n'est pas listé = fold 100%.
 */

const RFI_RANGES = {
  "UTG+1": {
    raise_pure: [
      "AA","KK","QQ","JJ","TT","99","88","77",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s",
      "KQs","KJs","KTs","QJs","QTs","JTs","T9s","98s","87s",
      "AKo","AQo","AJo","ATo",
    ],
    raise_mix: {
      "76s": 0.6, "66": 0.9, "55": 0.5, "KQo": 0.7,
    },
  },
  UTG: {
    raise_pure: [
      "AA","KK","QQ","JJ","TT","99","88","77",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s",
      "KQs","KJs","KTs","QJs","QTs","JTs","T9s","98s",
      "AKo","AQo","AJo",
    ],
    raise_mix: {
      "76s": 0.5, "ATo": 0.5, "KQo": 0.5, "66": 0.7,
    },
  },
  HJ: {
    raise_pure: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","QJs","QTs","Q9s","JTs","J9s","T9s","T8s","98s","87s",
      "AKo","AQo","AJo","ATo","KQo",
    ],
    raise_mix: {
      "76s": 0.7, "65s": 0.5, "KJo": 0.5, "44": 0.8,
    },
  },
  CO: {
    raise_pure: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","QJs","QTs","Q9s","JTs","J9s","T9s","T8s","98s","87s","76s","65s","54s",
      "AKo","AQo","AJo","ATo","A9o","KQo","KJo","QJo",
    ],
    raise_mix: {
      "K7s": 0.6, "Q8s": 0.5, "J8s": 0.5, "T7s": 0.5, "97s": 0.5, "86s": 0.5,
      "KTo": 0.6, "QTo": 0.6, "JTo": 0.7,
    },
  },
  BTN: {
    raise_pure: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s",
      "QJs","QTs","Q9s","Q8s","Q7s","Q6s","Q5s",
      "JTs","J9s","J8s","J7s","T9s","T8s","T7s",
      "98s","97s","87s","86s","76s","75s","65s","64s","54s","53s",
      "AKo","AQo","AJo","ATo","A9o","A8o","A7o","A6o","A5o","A4o","A3o","A2o",
      "KQo","KJo","KTo","K9o","QJo","QTo","Q9o","JTo","J9o","T9o","98o",
    ],
    raise_mix: {
      "Q4s": 0.7, "Q3s": 0.5, "J6s": 0.5, "T6s": 0.5,
      "K8o": 0.6, "K7o": 0.4, "Q8o": 0.5, "J8o": 0.4,
    },
  },
  SB: {
    raise_pure: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s",
      "QJs","QTs","Q9s","Q8s","Q7s","Q6s","Q5s",
      "JTs","J9s","J8s","J7s","T9s","T8s","T7s",
      "98s","97s","87s","86s","76s","65s","54s",
      "AKo","AQo","AJo","ATo","A9o","A8o","A7o","A6o","A5o",
      "KQo","KJo","KTo","K9o","QJo","QTo","JTo",
    ],
    raise_mix: {
      "K8o": 0.5, "Q9o": 0.6, "J9o": 0.6, "T9o": 0.7,
      "75s": 0.6, "64s": 0.5,
    },
  },
}

function buildChart({ position, raise_pure, raise_mix }) {
  const hands = {}
  for (const h of allHands()) {
    if (raise_pure.includes(h)) {
      hands[h] = { raise: 1, call: 0, fold: 0 }
    } else if (raise_mix[h] !== undefined) {
      const r = raise_mix[h]
      hands[h] = { raise: r, call: 0, fold: 1 - r }
    } else {
      hands[h] = { raise: 0, call: 0, fold: 1 }
    }
  }
  return {
    format: "cash_6max",
    stack: 100,
    position,
    vs_action: "RFI",
    hands,
  }
}

const outDir = path.resolve("lib/ranges/cash_6max_100bb")
fs.mkdirSync(outDir, { recursive: true })

function safeName(position) {
  return position.replace("+", "")
}

for (const [position, spec] of Object.entries(RFI_RANGES)) {
  const chart = buildChart({ position, ...spec })
  const file = path.join(outDir, `${safeName(position)}_RFI.json`)
  fs.writeFileSync(file, JSON.stringify(chart, null, 2))
  console.log(`Wrote ${file}`)
}
