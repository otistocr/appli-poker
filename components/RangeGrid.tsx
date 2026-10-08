import type { RangeChart, HandFrequency } from "@/types"
import { handAt } from "@/data/hands"

interface Props {
  chart: RangeChart
  showFrequencies?: boolean
}

function cellColor(freq: HandFrequency): string {
  const { raise, call, fold } = freq
  if (raise >= 1) return "bg-emerald-600 text-white"
  if (call >= 1) return "bg-blue-500 text-white"
  if (fold >= 1) return "bg-neutral-100 text-neutral-500"
  if (raise > 0 && call > 0) return "bg-teal-500 text-white"
  if (raise > 0) return "bg-emerald-400 text-white"
  if (call > 0) return "bg-blue-300 text-white"
  return "bg-neutral-100 text-neutral-500"
}

function cellLabel(freq: HandFrequency): string {
  if (freq.raise >= 1) return "R"
  if (freq.call >= 1) return "C"
  if (freq.fold >= 1) return ""
  const parts: string[] = []
  if (freq.raise > 0) parts.push(`R ${Math.round(freq.raise * 100)}%`)
  if (freq.call > 0) parts.push(`C ${Math.round(freq.call * 100)}%`)
  if (freq.fold > 0 && parts.length > 0) parts.push(`F ${Math.round(freq.fold * 100)}%`)
  return parts.join(" / ")
}

export default function RangeGrid({ chart, showFrequencies = true }: Props) {
  return (
    <div
      className="grid w-full max-w-[640px] gap-[2px] p-1 sm:p-2 bg-neutral-900 rounded-lg"
      style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}
    >
      {Array.from({ length: 13 }).map((_, row) =>
        Array.from({ length: 13 }).map((_, col) => {
          const hand = handAt(row, col)
          const freq = chart.hands[hand] ?? { raise: 0, call: 0, fold: 1 }
          const color = cellColor(freq)
          const label = cellLabel(freq)
          return (
            <div
              key={`${row}-${col}`}
              className={`aspect-square min-w-0 flex flex-col items-center justify-center text-[8px] sm:text-xs font-semibold rounded overflow-hidden ${color}`}
              title={`${hand}: R ${Math.round(freq.raise * 100)}% / C ${Math.round(freq.call * 100)}% / F ${Math.round(freq.fold * 100)}%`}
            >
              <div>{hand}</div>
              {showFrequencies && label && (
                <div className="text-[6px] sm:text-[9px] opacity-90 leading-none mt-0.5 text-center">{label}</div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
