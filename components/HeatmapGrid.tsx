import type { UserStats } from "@/lib/storage"
import { handAt } from "@/data/hands"

interface Props {
  stats: UserStats
}

function accuracyColor(acc: number | null, played: boolean): string {
  if (!played) return "bg-neutral-900 text-neutral-700"
  if (acc === null) return "bg-neutral-800 text-neutral-500"
  if (acc >= 0.9) return "bg-emerald-600 text-white"
  if (acc >= 0.75) return "bg-emerald-800 text-neutral-100"
  if (acc >= 0.5) return "bg-amber-600 text-white"
  if (acc >= 0.25) return "bg-orange-600 text-white"
  return "bg-red-600 text-white"
}

export default function HeatmapGrid({ stats }: Props) {
  return (
    <div className="inline-block p-2 bg-neutral-950 border border-neutral-800 rounded-lg">
      <div
        className="inline-grid gap-[2px]"
        style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}
      >
        {Array.from({ length: 13 }).map((_, row) =>
          Array.from({ length: 13 }).map((_, col) => {
            const hand = handAt(row, col)
            const acc_data = stats.hand_accuracy[hand]
            const played = !!acc_data && acc_data.total > 0
            const acc = played ? acc_data.correct / acc_data.total : null
            const color = accuracyColor(acc, played)
            return (
              <div
                key={`${row}-${col}`}
                className={`aspect-square min-w-6 min-h-6 flex items-center justify-center text-[9px] sm:text-[10px] font-semibold rounded ${color}`}
                title={
                  played
                    ? `${hand}: ${acc_data.correct}/${acc_data.total} (${Math.round((acc ?? 0) * 100)}%)`
                    : `${hand}: pas encore jouée`
                }
              >
                {hand}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
