import type { UserStats } from "@/lib/storage"

interface Props {
  stats: UserStats
}

export default function ScoreBar({ stats }: Props) {
  const accuracy = stats.total_hands > 0 ? Math.round((stats.correct / stats.total_hands) * 100) : 0
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      <Stat label="Score" value={stats.score} accent />
      <Stat label="Streak" value={`${stats.streak} 🔥`} />
      <Stat label="Précision" value={`${accuracy}%`} />
      <Stat label="Mains" value={stats.total_hands} />
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div
      className={`p-2 sm:p-3 rounded-lg border ${
        accent
          ? "border-amber-500/40 bg-amber-950/20"
          : "border-neutral-800 bg-neutral-900"
      }`}
    >
      <div className="text-[10px] uppercase tracking-wide text-neutral-500">{label}</div>
      <div className={`text-lg sm:text-2xl font-bold ${accent ? "text-amber-400" : "text-neutral-100"}`}>
        {value}
      </div>
    </div>
  )
}
