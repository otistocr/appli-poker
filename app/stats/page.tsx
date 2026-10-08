"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { emptyStats, loadStats, type UserStats } from "@/lib/storage"
import { getLevel, progressToNext } from "@/lib/level"
import HeatmapGrid from "@/components/HeatmapGrid"
import ProgressChart from "@/components/ProgressChart"
import FeltHeader from "@/components/FeltHeader"

export default function StatsPage() {
  const [stats, setStats] = useState<UserStats>(emptyStats())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setStats(loadStats())
    setLoaded(true)
  }, [])

  const level = getLevel(stats.score)
  const progress = progressToNext(stats.score)
  const accuracy = stats.total_hands > 0 ? (stats.correct / stats.total_hands) * 100 : 0

  const spotEntries = Object.entries(stats.spot_accuracy)
    .filter(([, s]) => s.total >= 3)
    .map(([spot, s]) => ({ spot, acc: s.correct / s.total, total: s.total }))
  const bestSpots = [...spotEntries].sort((a, b) => b.acc - a.acc).slice(0, 3)
  const worstSpots = [...spotEntries].sort((a, b) => a.acc - b.acc).slice(0, 3)

  const worstHands = Object.entries(stats.hand_accuracy)
    .filter(([, s]) => s.total >= 3)
    .map(([hand, s]) => ({ hand, acc: s.correct / s.total, total: s.total }))
    .sort((a, b) => a.acc - b.acc)
    .slice(0, 8)

  return (
    <main className="min-h-screen">
      <FeltHeader current="Stats" suit="♠" />
      <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 py-8">
        <header>
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
            <span className="text-lg">♠</span>
            <span>Ta progression</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Stats</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Progression, heatmap des erreurs, meilleurs et pires spots.
          </p>
        </header>

        {loaded && stats.total_hands === 0 && (
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-lg text-center space-y-3">
            <p className="text-neutral-400">
              Tu n&apos;as pas encore joué de main. Lance le Trainer pour démarrer.
            </p>
            <Link
              href="/trainer"
              className="inline-block px-4 py-2 bg-amber-500 text-neutral-950 rounded-md font-semibold hover:bg-amber-400 transition"
            >
              Aller au Trainer →
            </Link>
          </div>
        )}

        {loaded && stats.total_hands > 0 && (
          <>
            {/* ---- LEVEL BAR ---- */}
            <section
              className={`p-4 sm:p-5 rounded-xl border-2 ${level.border} ${level.bg}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-neutral-500">
                    Niveau
                  </div>
                  <div className={`text-3xl sm:text-4xl font-bold ${level.color}`}>
                    {level.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-widest text-neutral-500">
                    Score
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-neutral-100">
                    {stats.score}
                  </div>
                </div>
              </div>
              {level.next_at !== null && (
                <div className="mt-3">
                  <div className="text-xs text-neutral-400 mb-1">
                    Progression : {stats.score} / {level.next_at} pts vers le niveau suivant
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${level.color.replace("text-", "bg-")}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* ---- KEY METRICS ---- */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Metric label="Mains" value={stats.total_hands} />
              <Metric label="Précision" value={`${accuracy.toFixed(1)}%`} />
              <Metric label="Streak actuel" value={`${stats.streak} 🔥`} />
              <Metric label="Meilleur streak" value={stats.best_streak} />
            </section>

            {/* ---- PROGRESSION 30J ---- */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Progression (30 derniers jours)</h2>
              <ProgressChart stats={stats} days={30} />
            </section>

            {/* ---- HEATMAP ---- */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Heatmap des mains</h2>
              <p className="text-xs text-neutral-500 mb-3">
                Vert = maîtrisée, rouge = à retravailler. Survole une case pour les
                détails.
              </p>
              <div className="overflow-x-auto">
                <HeatmapGrid stats={stats} />
              </div>
            </section>

            {/* ---- BEST/WORST SPOTS ---- */}
            <section className="grid sm:grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg font-semibold mb-2 text-emerald-400">
                  Meilleurs spots
                </h2>
                <SpotList entries={bestSpots} emptyMessage="Pas encore assez de data." />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2 text-red-400">Pires spots</h2>
                <SpotList entries={worstSpots} emptyMessage="Pas encore assez de data." />
              </div>
            </section>

            {/* ---- WORST HANDS ---- */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Mains à retravailler</h2>
              {worstHands.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  Pas encore de main assez jouée pour identifier des faiblesses.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {worstHands.map((h) => (
                    <div
                      key={h.hand}
                      className="px-3 py-2 bg-red-950/30 border border-red-900/50 rounded"
                    >
                      <div className="font-mono font-bold">{h.hand}</div>
                      <div className="text-xs text-neutral-400">
                        {Math.round(h.acc * 100)}% ({h.total} mains)
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
      <div className="text-[10px] uppercase tracking-widest text-neutral-500">
        {label}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-neutral-100 mt-1">{value}</div>
    </div>
  )
}

function SpotList({
  entries,
  emptyMessage,
}: {
  entries: { spot: string; acc: number; total: number }[]
  emptyMessage: string
}) {
  if (entries.length === 0) {
    return <p className="text-sm text-neutral-500">{emptyMessage}</p>
  }
  return (
    <ul className="space-y-1 text-sm">
      {entries.map((e) => (
        <li
          key={e.spot}
          className="flex items-center justify-between px-3 py-2 bg-neutral-900 border border-neutral-800 rounded"
        >
          <span className="text-neutral-200 truncate">{formatSpotLabel(e.spot)}</span>
          <span className="font-mono text-xs text-neutral-400 ml-2 whitespace-nowrap">
            {Math.round(e.acc * 100)}% · {e.total}
          </span>
        </li>
      ))}
    </ul>
  )
}

function formatSpotLabel(spot_id: string): string {
  // e.g., "cash_6max_100_BTN_RFI" → "cash 6max 100bb · BTN · RFI"
  const parts = spot_id.split("_")
  if (parts.length < 5) return spot_id
  const format = `${parts[0]} ${parts[1]}`
  const stack = `${parts[2]}bb`
  const pos = parts[3]
  const action = parts.slice(4).join(" ")
  return `${format} ${stack} · ${pos} · ${action}`
}

