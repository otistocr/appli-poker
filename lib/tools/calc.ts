/**
 * Pure calculation helpers for poker tools.
 */

/* ============================================================
   Pot odds
   ============================================================ */

export function potOdds(potBefore: number, betAdv: number, callCost: number) {
  if (callCost <= 0) return null
  const potAfterBet = potBefore + betAdv
  const potAfterCall = potAfterBet + callCost
  const equityMin = (callCost / potAfterCall) * 100
  const ratio = potAfterBet / callCost
  return {
    potAfterBet,
    potAfterCall,
    equityMin,
    ratio,
  }
}

/* ============================================================
   MDF — Minimum Defense Frequency
   ============================================================ */

export function mdf(pot: number, bet: number) {
  if (bet <= 0 || pot <= 0) return null
  const mdfPct = (pot / (pot + bet)) * 100
  const alpha = (bet / (pot + bet)) * 100
  return { mdf: mdfPct, alpha }
}

/* ============================================================
   Value / bluff ratio (river bet)
   Formule : bluff% = bet / (pot + 2*bet)
   Value% = 1 - bluff%
   ============================================================ */

export function valueBluff(pot: number, bet: number) {
  if (pot <= 0 || bet <= 0) return null
  const bluffPct = (bet / (pot + 2 * bet)) * 100
  const valuePct = 100 - bluffPct
  const ratio = valuePct / bluffPct
  return { valuePct, bluffPct, ratio }
}

/* ============================================================
   Combo counter
   Parse une range simplifiée : "AA, KK, AKs, AKo, 76s-54s, JJ+"
   ============================================================ */

const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"] as const
const RANK_VALUE: Record<string, number> = Object.fromEntries(
  RANKS.map((r, i) => [r, 13 - i])
)

function comboCountForHand(hand: string): number {
  const clean = hand.trim()
  if (clean.length === 2) return 6 // paire
  if (clean.length === 3) {
    const suf = clean[2].toLowerCase()
    if (suf === "s") return 4
    if (suf === "o") return 12
  }
  return 0
}

function expandTier(tier: string): string[] {
  // "JJ+" → JJ, QQ, KK, AA
  // "AJs+" → AJs, AQs, AKs
  // "76s-54s" → 76s, 65s, 54s
  const t = tier.trim()
  if (!t) return []

  // Range "A-B"
  if (t.includes("-")) {
    const [a, b] = t.split("-").map((s) => s.trim())
    if (a.length !== b.length) return [t]
    // Suited connectors range 76s-54s
    const suf = a.slice(-1)
    if ((suf === "s" || suf === "o") && a.length === 3) {
      const h1 = RANK_VALUE[a[0]]
      const l1 = RANK_VALUE[a[1]]
      const h2 = RANK_VALUE[b[0]]
      const gap = h1 - l1
      const out: string[] = []
      for (let x = h1; x >= h2; x--) {
        const y = x - gap
        if (y < 2) break
        out.push(`${RANKS[13 - x]}${RANKS[13 - y]}${suf}`)
      }
      return out
    }
    return [t]
  }

  // Plus "JJ+" or "AJs+"
  if (t.endsWith("+")) {
    const base = t.slice(0, -1)
    if (base.length === 2) {
      // paires
      const v = RANK_VALUE[base[0]]
      const out: string[] = []
      for (let x = v; x <= 14; x++) {
        const r = RANKS[13 - x]
        out.push(`${r}${r}`)
      }
      return out
    }
    if (base.length === 3) {
      const suf = base[2]
      const highRank = base[0]
      const lowRank = base[1]
      const v = RANK_VALUE[lowRank]
      const out: string[] = []
      for (let x = v; x < RANK_VALUE[highRank]; x++) {
        out.push(`${highRank}${RANKS[13 - x]}${suf}`)
      }
      return out
    }
  }

  return [t]
}

export function countCombos(rangeStr: string): { total: number; breakdown: { hand: string; combos: number }[]; invalid: string[] } {
  const tokens = rangeStr.split(",").map((s) => s.trim()).filter(Boolean)
  const breakdown: { hand: string; combos: number }[] = []
  const invalid: string[] = []
  const seen = new Set<string>()

  for (const t of tokens) {
    const expanded = expandTier(t)
    for (const h of expanded) {
      if (seen.has(h)) continue
      const c = comboCountForHand(h)
      if (c === 0) invalid.push(h)
      else {
        breakdown.push({ hand: h, combos: c })
        seen.add(h)
      }
    }
  }

  const total = breakdown.reduce((s, x) => s + x.combos, 0)
  return { total, breakdown, invalid }
}

/* ============================================================
   Equity estimator — heads-up hand vs hand approximation
   ============================================================ */

type HandCategory = "pair" | "suited" | "offsuit"

interface HandInfo {
  cat: HandCategory
  hi: number
  lo: number
}

function parseHand(h: string): HandInfo | null {
  const t = h.trim().toUpperCase()
  if (t.length < 2 || t.length > 3) return null
  const hi = RANK_VALUE[t[0]]
  const lo = RANK_VALUE[t[1]]
  if (!hi || !lo) return null
  if (t.length === 2 && hi === lo) return { cat: "pair", hi, lo }
  if (t.length === 3) {
    const suf = t[2].toLowerCase()
    const [big, small] = hi > lo ? [hi, lo] : [lo, hi]
    if (suf === "S") return { cat: "suited", hi: big, lo: small }
    if (suf === "s") return { cat: "suited", hi: big, lo: small }
    if (suf === "o") return { cat: "offsuit", hi: big, lo: small }
  }
  return null
}

/**
 * Approximation basée sur les matchups classiques du poker.
 * Résultat : equity du hand1 vs hand2 (en %).
 */
export function estimateEquity(hand1: string, hand2: string): number | null {
  const h1 = parseHand(hand1)
  const h2 = parseHand(hand2)
  if (!h1 || !h2) return null

  // Same hand (equity ~50 with card removal ~0)
  if (h1.cat === h2.cat && h1.hi === h2.hi && h1.lo === h2.lo) return 50

  // Pair vs Pair
  if (h1.cat === "pair" && h2.cat === "pair") {
    return h1.hi > h2.hi ? 82 : 18
  }

  // Pair vs 2 cards
  if (h1.cat === "pair") {
    const overpair = h1.hi > h2.hi
    const underpair = h1.hi < h2.lo
    if (overpair) {
      // pair vs 2 undercards: ~85%
      return h2.cat === "suited" ? 82 : 85
    }
    if (underpair) {
      // pair vs 2 overcards: ~55%
      return h2.cat === "suited" ? 48 : 52
    }
    // pair between the 2 cards: pair still favored ~70%
    return h2.cat === "suited" ? 67 : 71
  }

  if (h2.cat === "pair") {
    return 100 - (estimateEquity(hand2, hand1) ?? 50)
  }

  // Two non-pair hands
  // Compute domination score
  const sameHigh = h1.hi === h2.hi
  const sameLow = h1.lo === h2.lo

  if (sameHigh) {
    // Dominated by kicker (AK vs AQ)
    const kickerDiff = Math.abs(h1.lo - h2.lo)
    const dominator = h1.lo > h2.lo
    const base = 72 + Math.min(kickerDiff, 5)
    let e = dominator ? base : 100 - base
    // Suited bonus
    if (h1.cat === "suited" && h2.cat !== "suited") e += 3
    if (h2.cat === "suited" && h1.cat !== "suited") e -= 3
    return Math.round(e)
  }

  if (sameLow) {
    // Same low kicker (AK vs QK)
    const dominator = h1.hi > h2.hi
    const base = 70
    let e = dominator ? base : 100 - base
    if (h1.cat === "suited" && h2.cat !== "suited") e += 3
    if (h2.cat === "suited" && h1.cat !== "suited") e -= 3
    return Math.round(e)
  }

  // Non-overlapping cards
  // Higher hand wins ~57-60% (unless connected suited connector)
  const rank1Sum = h1.hi + h1.lo
  const rank2Sum = h2.hi + h2.lo
  let e = 50
  if (rank1Sum > rank2Sum) e = 60
  else if (rank1Sum < rank2Sum) e = 40

  // Suited connector edge
  const gap1 = h1.hi - h1.lo
  const gap2 = h2.hi - h2.lo
  if (h1.cat === "suited" && gap1 <= 4) e += 2
  if (h2.cat === "suited" && gap2 <= 4) e -= 2

  // Suited bonus
  if (h1.cat === "suited" && h2.cat !== "suited") e += 3
  if (h2.cat === "suited" && h1.cat !== "suited") e -= 3

  return Math.round(Math.max(20, Math.min(80, e)))
}
