import type { UserStats, DailyStats } from "@/lib/storage"

interface Props {
  stats: UserStats
  days?: number
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function lastNDays(n: number): { key: string; label: string; date: Date }[] {
  const out: { key: string; label: string; date: Date }[] = []
  const today = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    out.push({ key: dateKey(d), label: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`, date: d })
  }
  return out
}

export default function ProgressChart({ stats, days = 30 }: Props) {
  const range = lastNDays(days)
  const values: { day: string; label: string; acc: number | null; hands: number }[] = range.map(
    (r) => {
      const d = stats.daily[r.key] as DailyStats | undefined
      if (!d || d.hands === 0) return { day: r.key, label: r.label, acc: null, hands: 0 }
      return { day: r.key, label: r.label, acc: d.correct / d.hands, hands: d.hands }
    }
  )

  const maxHands = Math.max(1, ...values.map((v) => v.hands))
  const anyPlayed = values.some((v) => v.hands > 0)

  return (
    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
      {!anyPlayed && (
        <p className="text-sm text-neutral-500 text-center py-8">
          Aucune main jouée dans les 30 derniers jours. Va sur le Trainer pour démarrer.
        </p>
      )}
      {anyPlayed && (
        <>
          <div className="flex items-end gap-[1px] sm:gap-0.5 h-40 border-l border-b border-neutral-700 pl-1 pb-1">
            {values.map((v) => {
              const heightPct = v.hands === 0 ? 3 : Math.max(6, (v.hands / maxHands) * 100)
              const colorClass =
                v.hands === 0
                  ? "bg-neutral-800"
                  : v.acc === null
                    ? "bg-neutral-700"
                    : v.acc >= 0.85
                      ? "bg-emerald-500"
                      : v.acc >= 0.7
                        ? "bg-amber-500"
                        : "bg-red-500"
              return (
                <div
                  key={v.day}
                  className={`flex-1 rounded-t transition ${colorClass}`}
                  style={{ height: `${heightPct}%` }}
                  title={
                    v.hands === 0
                      ? `${v.day} — pas de session`
                      : `${v.day} : ${v.hands} mains, ${Math.round((v.acc ?? 0) * 100)}%`
                  }
                />
              )
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-neutral-500">
            <span>{values[0].label}</span>
            <span>{values[Math.floor(values.length / 2)].label}</span>
            <span>{values[values.length - 1].label}</span>
          </div>
          <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-neutral-400">
            <LegendItem color="bg-emerald-500" label="≥ 85%" />
            <LegendItem color="bg-amber-500" label="70-85%" />
            <LegendItem color="bg-red-500" label="&lt; 70%" />
            <span className="text-neutral-500">Hauteur = volume de mains</span>
          </div>
        </>
      )}
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className={`w-3 h-3 rounded ${color}`} />
      <span>{label}</span>
    </div>
  )
}
