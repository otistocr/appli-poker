export type LevelName = "Bronze" | "Silver" | "Gold" | "Diamond" | "Master"

export interface Level {
  name: LevelName
  min_score: number
  color: string
  bg: string
  border: string
  next_at: number | null
}

const LEVELS: Level[] = [
  {
    name: "Bronze",
    min_score: 0,
    color: "text-amber-700",
    bg: "bg-amber-950/20",
    border: "border-amber-800/50",
    next_at: 500,
  },
  {
    name: "Silver",
    min_score: 500,
    color: "text-neutral-300",
    bg: "bg-neutral-800/50",
    border: "border-neutral-500/50",
    next_at: 2000,
  },
  {
    name: "Gold",
    min_score: 2000,
    color: "text-amber-400",
    bg: "bg-amber-900/20",
    border: "border-amber-500/50",
    next_at: 5000,
  },
  {
    name: "Diamond",
    min_score: 5000,
    color: "text-cyan-300",
    bg: "bg-cyan-900/20",
    border: "border-cyan-500/50",
    next_at: 15000,
  },
  {
    name: "Master",
    min_score: 15000,
    color: "text-fuchsia-300",
    bg: "bg-fuchsia-900/20",
    border: "border-fuchsia-500/50",
    next_at: null,
  },
]

export function getLevel(score: number): Level {
  let current = LEVELS[0]
  for (const l of LEVELS) {
    if (score >= l.min_score) current = l
  }
  return current
}

export function progressToNext(score: number): number {
  const l = getLevel(score)
  if (l.next_at === null) return 100
  return Math.min(100, Math.round(((score - l.min_score) / (l.next_at - l.min_score)) * 100))
}
