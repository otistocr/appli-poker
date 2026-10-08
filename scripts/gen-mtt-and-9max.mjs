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

function buildChart({ format, stack, position, vs_action, vs_position, spec }) {
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
  const chart = { format, stack, position, vs_action, hands }
  if (vs_position) chart.vs_position = vs_position
  return chart
}

/* ============================================================
   MTT 12bb — Push/fold Nash (raise = shove all-in)
   ============================================================ */

const MTT_12BB_SHOVE = {
  UTG: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77",
      "AKs","AKo","AQs","AQo","AJs","AJo","ATs",
      "KQs","KJs","KQo",
    ],
    raise_mix: { "66": 0.6, "55": 0.4, "KTs": 0.6 },
  },
  "UTG+1": {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66",
      "AKs","AKo","AQs","AQo","AJs","AJo","ATs","A9s",
      "KQs","KJs","KTs","KQo","KJo",
      "QJs","QTs","JTs",
    ],
    raise_mix: { "55": 0.5, "44": 0.3 },
  },
  HJ: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55",
      "AKs","AKo","AQs","AQo","AJs","AJo","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","KQo","KJo","KTo",
      "QJs","QTs","Q9s","JTs","J9s","T9s","98s","87s",
    ],
    raise_mix: { "44": 0.5, "ATo": 0.7 },
  },
  CO: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33",
      "AKs","AKo","AQs","AQo","AJs","AJo","ATs","ATo","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","KQo","KJo","KTo","K9o",
      "QJs","QTs","Q9s","Q8s","QJo","QTo",
      "JTs","J9s","J8s","JTo",
      "T9s","T8s","98s","97s","87s","76s",
    ],
    raise_mix: { "22": 0.5, "A9o": 0.7, "K8o": 0.5, "Q9o": 0.5 },
  },
  BTN: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22",
      "AKs","AKo","AQs","AQo","AJs","AJo","ATs","ATo","A9s","A9o","A8s","A8o","A7s","A6s","A5s","A5o","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s",
      "KQo","KJo","KTo","K9o","K8o","K7o",
      "QJs","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s",
      "QJo","QTo","Q9o","Q8o",
      "JTs","J9s","J8s","J7s","J6s","JTo","J9o","J8o",
      "T9s","T8s","T7s","T6s","T9o","T8o",
      "98s","97s","96s","98o","87s","86s","76s","65s","54s",
    ],
    raise_mix: { "A7o": 0.6, "A6o": 0.5, "A4o": 0.5, "A3o": 0.4, "A2o": 0.4, "K6o": 0.4, "Q7o": 0.4, "J7o": 0.4 },
  },
  SB: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22",
      "AKs","AKo","AQs","AQo","AJs","AJo","ATs","ATo","A9s","A9o","A8s","A8o","A7s","A7o","A6s","A6o","A5s","A5o","A4s","A4o","A3s","A3o","A2s","A2o",
      "KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s",
      "KQo","KJo","KTo","K9o","K8o","K7o","K6o","K5o",
      "QJs","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s",
      "QJo","QTo","Q9o","Q8o","Q7o",
      "JTs","J9s","J8s","J7s","J6s","J5s","J4s","JTo","J9o","J8o",
      "T9s","T8s","T7s","T6s","T9o","T8o","T7o",
      "98s","97s","96s","95s","98o","97o","87s","86s","85s","87o","76s","75s","65s","54s","64s","53s",
    ],
    raise_mix: { "K4o": 0.5, "Q6o": 0.5, "J7o": 0.5, "T6o": 0.4 },
  },
}

const MTT_12BB_BB_CALL = {
  vs_SB: {
    call: [
      "22","33","44","55","66","77","88","99","TT","JJ","QQ","KK","AA",
      "A2s","A3s","A4s","A5s","A6s","A7s","A8s","A9s","ATs","AJs","AQs","AKs",
      "A2o","A3o","A4o","A5o","A6o","A7o","A8o","A9o","ATo","AJo","AQo","AKo",
      "K2s","K3s","K4s","K5s","K6s","K7s","K8s","K9s","KTs","KJs","KQs",
      "K6o","K7o","K8o","K9o","KTo","KJo","KQo",
      "Q7s","Q8s","Q9s","QTs","QJs","Q8o","Q9o","QTo","QJo",
      "J7s","J8s","J9s","JTs","J8o","J9o","JTo",
      "T7s","T8s","T9s","T8o","T9o","98s","97s","87s","76s","65s",
    ],
    call_mix: { "Q6o": 0.5, "J7o": 0.4, "T7o": 0.4 },
    raise: [], // BB juste call vs SB shove
    raise_mix: {},
  },
  vs_BTN: {
    call: [
      "22","33","44","55","66","77","88","99","TT","JJ","QQ","KK","AA",
      "A2s","A3s","A4s","A5s","A6s","A7s","A8s","A9s","ATs","AJs","AQs","AKs",
      "A2o","A3o","A4o","A5o","A6o","A7o","A8o","A9o","ATo","AJo","AQo","AKo",
      "K2s","K3s","K4s","K5s","K6s","K7s","K8s","K9s","KTs","KJs","KQs",
      "K7o","K8o","K9o","KTo","KJo","KQo",
      "Q8s","Q9s","QTs","QJs","Q9o","QTo","QJo",
      "J8s","J9s","JTs","J9o","JTo",
      "T8s","T9s","T9o","98s","87s","76s","65s",
    ],
    call_mix: { "K6o": 0.4, "Q7o": 0.3 },
    raise: [],
    raise_mix: {},
  },
}

/* ============================================================
   MTT 20bb — tighter shoves + some opens
   ============================================================ */

const MTT_20BB_SHOVE = {
  UTG: {
    raise: ["AA","KK","QQ","JJ","TT","AKs","AKo","AQs"],
    raise_mix: { "99": 0.5, "AQo": 0.4 },
  },
  "UTG+1": {
    raise: ["AA","KK","QQ","JJ","TT","99","AKs","AKo","AQs","AJs"],
    raise_mix: { "88": 0.6, "AQo": 0.6, "KQs": 0.5 },
  },
  HJ: {
    raise: ["AA","KK","QQ","JJ","TT","99","88","AKs","AKo","AQs","AJs","ATs","KQs","KJs","AQo"],
    raise_mix: { "77": 0.6, "66": 0.3, "AJo": 0.6, "KQo": 0.5 },
  },
  CO: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66",
      "AKs","AKo","AQs","AQo","AJs","AJo","ATs",
      "KQs","KJs","KTs","K9s","QJs","QTs","JTs",
    ],
    raise_mix: { "55": 0.5, "ATo": 0.6, "KQo": 0.7, "T9s": 0.6 },
  },
  BTN: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22",
      "AKs","AKo","AQs","AQo","AJs","AJo","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","KQo","KJo","KTo","K9o",
      "QJs","QTs","Q9s","QJo","QTo","JTs","J9s","JTo","T9s","98s","87s","76s",
    ],
    raise_mix: { "ATo": 0.8, "A9o": 0.6, "A8o": 0.5, "K8o": 0.4, "Q9o": 0.4 },
  },
  SB: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22",
      "AKs","AKo","AQs","AQo","AJs","AJo","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "ATo","A9o","A8o","A7o","A6o","A5o",
      "KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s",
      "KQo","KJo","KTo","K9o","K8o","K7o",
      "QJs","QTs","Q9s","Q8s","Q7s","QJo","QTo","Q9o",
      "JTs","J9s","J8s","JTo","J9o","T9s","T8s","98s","87s","76s","65s",
    ],
    raise_mix: { "A4o": 0.6, "A3o": 0.5, "A2o": 0.4, "K6o": 0.4 },
  },
}

/* ============================================================
   MTT 40bb — Open ranges (a bit tighter than cash 100bb)
   ============================================================ */

const MTT_40BB_OPEN = {
  UTG: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s",
      "KQs","KJs","KTs","QJs","QTs","JTs","T9s","98s","87s",
      "AKo","AQo","AJo",
    ],
    raise_mix: { "66": 0.6, "55": 0.3, "ATo": 0.4, "KQo": 0.5 },
  },
  "UTG+1": {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","QJs","QTs","JTs","T9s","98s","87s","76s",
      "AKo","AQo","AJo","ATo","KQo",
    ],
    raise_mix: { "55": 0.5, "44": 0.3 },
  },
  HJ: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","QJs","QTs","Q9s","JTs","J9s","T9s","T8s","98s","87s","76s","65s",
      "AKo","AQo","AJo","ATo","KQo","KJo",
    ],
    raise_mix: { "44": 0.5, "QJo": 0.5 },
  },
  CO: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","K7s","QJs","QTs","Q9s","Q8s","JTs","J9s","J8s","T9s","T8s","98s","87s","76s","65s","54s",
      "AKo","AQo","AJo","ATo","A9o","KQo","KJo","KTo","QJo","QTo","JTo",
    ],
    raise_mix: { "K6s": 0.7, "K5s": 0.5, "K9o": 0.5 },
  },
  BTN: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s",
      "QJs","QTs","Q9s","Q8s","Q7s","Q6s","JTs","J9s","J8s","J7s","T9s","T8s","T7s",
      "98s","97s","87s","76s","65s","54s","43s",
      "AKo","AQo","AJo","ATo","A9o","A8o","A7o","A6o","A5o","A4o","A3o","A2o",
      "KQo","KJo","KTo","K9o","K8o","K7o","QJo","QTo","Q9o","Q8o","JTo","J9o","T9o","98o",
    ],
    raise_mix: { "Q5s": 0.6, "K6o": 0.5, "J8o": 0.5, "T8o": 0.5 },
  },
  SB: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s",
      "QJs","QTs","Q9s","Q8s","Q7s","Q6s","Q5s",
      "JTs","J9s","J8s","J7s","T9s","T8s","T7s",
      "98s","97s","87s","76s","65s","54s",
      "AKo","AQo","AJo","ATo","A9o","A8o","A7o","A6o","A5o",
      "KQo","KJo","KTo","K9o","QJo","QTo","JTo",
    ],
    raise_mix: { "K8o": 0.5, "Q9o": 0.5, "J9o": 0.5, "T9o": 0.6 },
  },
}

/* ============================================================
   MTT 50bb — slightly wider than 40bb, closer to cash 100bb
   ============================================================ */

const MTT_50BB_OPEN = {
  UTG: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s",
      "KQs","KJs","KTs","QJs","QTs","JTs","T9s","98s","87s","76s",
      "AKo","AQo","AJo","ATo",
    ],
    raise_mix: { "66": 0.7, "55": 0.4, "KQo": 0.6, "A3s": 0.6 },
  },
  "UTG+1": {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","QJs","QTs","JTs","T9s","98s","87s","76s","65s",
      "AKo","AQo","AJo","ATo","KQo",
    ],
    raise_mix: { "55": 0.7, "44": 0.5, "KJo": 0.5 },
  },
  HJ: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","QJs","QTs","Q9s","JTs","J9s","T9s","T8s","98s","87s","76s","65s","54s",
      "AKo","AQo","AJo","ATo","A9o","KQo","KJo","QJo",
    ],
    raise_mix: { "33": 0.4, "KTo": 0.5, "QTo": 0.5 },
  },
  CO: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","K7s","K6s","QJs","QTs","Q9s","Q8s","JTs","J9s","J8s","T9s","T8s","98s","97s","87s","76s","65s","54s",
      "AKo","AQo","AJo","ATo","A9o","A8o","KQo","KJo","KTo","K9o","QJo","QTo","JTo",
    ],
    raise_mix: { "K5s": 0.6, "Q7s": 0.5, "J7s": 0.4 },
  },
  BTN: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s",
      "QJs","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s",
      "JTs","J9s","J8s","J7s","T9s","T8s","T7s","T6s","98s","97s","96s","87s","86s","76s","65s","54s","43s","53s",
      "AKo","AQo","AJo","ATo","A9o","A8o","A7o","A6o","A5o","A4o","A3o","A2o",
      "KQo","KJo","KTo","K9o","K8o","K7o","QJo","QTo","Q9o","Q8o","JTo","J9o","J8o","T9o","T8o","98o",
    ],
    raise_mix: { "K6o": 0.5, "Q7o": 0.4, "J7o": 0.4 },
  },
  SB: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s",
      "QJs","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s",
      "JTs","J9s","J8s","J7s","J6s","T9s","T8s","T7s","T6s",
      "98s","97s","87s","86s","76s","65s","54s",
      "AKo","AQo","AJo","ATo","A9o","A8o","A7o","A6o","A5o","A4o","A3o",
      "KQo","KJo","KTo","K9o","K8o","QJo","QTo","Q9o","JTo","J9o","T9o",
    ],
    raise_mix: { "A2o": 0.5, "K7o": 0.5, "98o": 0.4 },
  },
}

/* ============================================================
   Cash 9-max 100bb — RFI (tighter, more players behind)
   ============================================================ */

const CASH_9MAX_RFI = {
  UTG: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88",
      "AKs","AQs","AJs","ATs","A9s","A8s",
      "KQs","KJs","KTs","QJs","QTs","JTs","T9s","98s",
      "AKo","AQo","AJo",
    ],
    raise_mix: { "77": 0.6, "87s": 0.5, "KQo": 0.4 },
  },
  "UTG+1": {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A5s",
      "KQs","KJs","KTs","QJs","QTs","JTs","T9s","98s","87s",
      "AKo","AQo","AJo","ATo",
    ],
    raise_mix: { "66": 0.5, "KQo": 0.7 },
  },
  "UTG+2": {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s",
      "KQs","KJs","KTs","K9s","QJs","QTs","JTs","T9s","98s","87s","76s",
      "AKo","AQo","AJo","ATo","KQo",
    ],
    raise_mix: { "66": 0.7, "55": 0.4 },
  },
  MP: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","QJs","QTs","JTs","T9s","98s","87s","76s","65s",
      "AKo","AQo","AJo","ATo","KQo","KJo",
    ],
    raise_mix: { "55": 0.5, "44": 0.3, "QJo": 0.5 },
  },
  LJ: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","QJs","QTs","Q9s","JTs","J9s","T9s","T8s","98s","87s","76s","65s",
      "AKo","AQo","AJo","ATo","KQo","KJo","QJo",
    ],
    raise_mix: { "44": 0.5, "ATo": 0.8, "KTo": 0.5 },
  },
  HJ: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","QJs","QTs","Q9s","JTs","J9s","T9s","T8s","98s","87s","76s","65s","54s",
      "AKo","AQo","AJo","ATo","A9o","KQo","KJo","KTo","QJo",
    ],
    raise_mix: { "33": 0.4, "K7s": 0.5, "QTo": 0.5, "JTo": 0.5 },
  },
  CO: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","K7s","QJs","QTs","Q9s","Q8s","JTs","J9s","J8s","T9s","T8s","98s","97s","87s","76s","65s","54s",
      "AKo","AQo","AJo","ATo","A9o","KQo","KJo","KTo","QJo","QTo","JTo",
    ],
    raise_mix: { "K6s": 0.7, "Q7s": 0.5, "K9o": 0.5 },
  },
  BTN: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s",
      "QJs","QTs","Q9s","Q8s","Q7s","Q6s","Q5s",
      "JTs","J9s","J8s","J7s","T9s","T8s","T7s","98s","97s","87s","76s","65s","54s","43s",
      "AKo","AQo","AJo","ATo","A9o","A8o","A7o","A6o","A5o","A4o","A3o","A2o",
      "KQo","KJo","KTo","K9o","K8o","QJo","QTo","Q9o","JTo","J9o","T9o","98o",
    ],
    raise_mix: { "Q4s": 0.6, "J6s": 0.4, "K7o": 0.5, "Q8o": 0.5 },
  },
  SB: {
    raise: [
      "AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22",
      "AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s",
      "KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s",
      "QJs","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s",
      "JTs","J9s","J8s","J7s","T9s","T8s","T7s","98s","97s","87s","76s","65s","54s",
      "AKo","AQo","AJo","ATo","A9o","A8o","A7o","A6o","A5o","A4o","A3o","A2o",
      "KQo","KJo","KTo","K9o","QJo","QTo","JTo","T9o",
    ],
    raise_mix: { "K8o": 0.6, "Q9o": 0.5, "98o": 0.4 },
  },
}

/* ============================================================
   Write everything
   ============================================================ */

function writeAll(dir, format, stack, ranges, vs_action = "RFI") {
  const outDir = path.resolve(`lib/ranges/${dir}`)
  fs.mkdirSync(outDir, { recursive: true })
  for (const [pos, spec] of Object.entries(ranges)) {
    const chart = buildChart({ format, stack, position: pos, vs_action, spec })
    const file = path.join(outDir, `${safeName(pos)}_${vs_action}.json`)
    fs.writeFileSync(file, JSON.stringify(chart, null, 2))
    console.log(`Wrote ${dir}/${safeName(pos)}_${vs_action}.json`)
  }
}

// MTT 12bb shove
writeAll("mtt_12bb", "mtt", 12, MTT_12BB_SHOVE)

// MTT 12bb BB defense
{
  const outDir = path.resolve("lib/ranges/mtt_12bb")
  for (const [vs, spec] of Object.entries(MTT_12BB_BB_CALL)) {
    const opener = vs.replace("vs_", "")
    const chart = buildChart({
      format: "mtt",
      stack: 12,
      position: "BB",
      vs_action: "vs_open",
      vs_position: opener,
      spec,
    })
    const file = path.join(outDir, `BB_vs_open_${safeName(opener)}.json`)
    fs.writeFileSync(file, JSON.stringify(chart, null, 2))
    console.log(`Wrote mtt_12bb/BB_vs_open_${safeName(opener)}.json`)
  }
}

// MTT 20bb shove
writeAll("mtt_20bb", "mtt", 20, MTT_20BB_SHOVE)

// MTT 40bb open
writeAll("mtt_40bb", "mtt", 40, MTT_40BB_OPEN)

// MTT 50bb open
writeAll("mtt_50bb", "mtt", 50, MTT_50BB_OPEN)

// Cash 9-max 100bb RFI
writeAll("cash_9max_100bb", "cash_9max", 100, CASH_9MAX_RFI)

console.log("\nDone. Generated MTT 12/20/40/50 + Cash 9-max ranges.")
