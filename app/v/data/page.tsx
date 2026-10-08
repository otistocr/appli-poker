"use client"

import Link from "next/link"

export default function DataVariant() {
  return (
    <main className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text-primary)]">
      {/* Top */}
      <header
        className="border-b px-6 py-3 flex items-center justify-between"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[color:var(--accent)] flex items-center justify-center text-white text-xs font-bold">
            AP
          </div>
          <div className="text-sm font-semibold">appli poker</div>
          <div className="hidden sm:block text-xs text-[color:var(--text-muted)]">
            Cash 6-max · 100bb
          </div>
        </div>
        <Link
          href="/v"
          className="text-xs text-[color:var(--text-muted)] hover:text-[color:var(--accent)]"
        >
          ← autres variantes
        </Link>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Hero metrics — the big data-forward look */}
        <section className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <BigStat label="Score global" value="1,842" delta="+42" up />
          <BigStat label="Précision" value="74.2%" delta="+2.1" up />
          <BigStat label="Streak actuel" value="8" delta="best 22" />
          <BigStat label="Mains jouées" value="342" delta="+18 aujourd'hui" up />
          <BigStat label="Niveau" value="Silver" delta="158 → Gold" />
        </section>

        {/* Two columns : chart + spots */}
        <section className="grid lg:grid-cols-[2fr_1fr] gap-4 mb-6">
          {/* Chart placeholder */}
          <div
            className="border rounded-md p-5 bg-[color:var(--surface)]"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-[color:var(--text-muted)]">
                  Progression 30j
                </h3>
                <div className="text-2xl font-semibold mt-1 tabular-nums">+240 pts</div>
              </div>
              <div className="flex gap-1 text-xs">
                <button className="px-2 py-1 rounded bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                  30j
                </button>
                <button className="px-2 py-1 rounded text-[color:var(--text-muted)]">
                  7j
                </button>
                <button className="px-2 py-1 rounded text-[color:var(--text-muted)]">
                  Tout
                </button>
              </div>
            </div>
            <FakeChart />
          </div>

          {/* Spots */}
          <div
            className="border rounded-md p-5 bg-[color:var(--surface)]"
            style={{ borderColor: "var(--border)" }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[color:var(--text-muted)] mb-3">
              Spots à retravailler
            </h3>
            <ul className="space-y-3">
              <SpotRow name="BB vs UTG open" acc={62} played={18} />
              <SpotRow name="CO vs 3-bet" acc={68} played={12} />
              <SpotRow name="SB RFI" acc={71} played={22} />
              <SpotRow name="BTN vs 3-bet" acc={73} played={9} />
            </ul>
          </div>
        </section>

        {/* Modules as data cards */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[color:var(--text-muted)]">
              Modules
            </h3>
            <span className="text-xs text-[color:var(--text-muted)]">5 disponibles</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <ModuleCard
              href="/charts"
              title="Charts GTO"
              metric="18"
              metricLabel="ranges"
              status="À jour"
            />
            <ModuleCard
              href="/trainer"
              title="Trainer"
              metric="342"
              metricLabel="mains ce mois"
              status="Actif"
            />
            <ModuleCard
              href="/academie"
              title="Académie"
              metric="10"
              metricLabel="cours"
              status="3 vus"
            />
            <ModuleCard
              href="/hh"
              title="Hand history"
              metric="0"
              metricLabel="analyses"
              status="Nouveau"
            />
            <ModuleCard
              href="/stats"
              title="Statistiques"
              metric="30"
              metricLabel="jours tracés"
              status="Local"
            />
          </div>
        </section>
      </div>
    </main>
  )
}

function BigStat({
  label,
  value,
  delta,
  up,
}: {
  label: string
  value: string
  delta?: string
  up?: boolean
}) {
  return (
    <div
      className="border rounded-md p-4 bg-[color:var(--surface)]"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="text-[10px] uppercase tracking-widest text-[color:var(--text-muted)]">
        {label}
      </div>
      <div className="text-3xl font-semibold tabular-nums mt-1">{value}</div>
      {delta && (
        <div
          className={`text-xs mt-1 ${up ? "text-[#6cb98d]" : "text-[color:var(--text-muted)]"}`}
        >
          {up ? "↑ " : ""}
          {delta}
        </div>
      )}
    </div>
  )
}

function SpotRow({
  name,
  acc,
  played,
}: {
  name: string
  acc: number
  played: number
}) {
  return (
    <li>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-[color:var(--text-primary)]">{name}</span>
        <span className="tabular-nums text-[color:var(--text-muted)]">
          {acc}% · {played}
        </span>
      </div>
      <div className="h-1.5 bg-[color:var(--surface-2)] rounded overflow-hidden">
        <div
          className="h-full bg-[color:var(--accent)]"
          style={{ width: `${acc}%` }}
        />
      </div>
    </li>
  )
}

function FakeChart() {
  const bars = [
    30, 45, 20, 50, 35, 60, 40, 55, 70, 45, 80, 60, 90, 75, 65, 85, 70, 100, 88, 92,
    75, 95, 78, 88, 100, 95, 105, 90, 110, 115,
  ]
  const max = Math.max(...bars)
  return (
    <div className="h-40 flex items-end gap-1">
      {bars.map((b, i) => (
        <div
          key={i}
          className="flex-1 bg-[color:var(--accent)] opacity-70 hover:opacity-100 rounded-t transition-opacity"
          style={{ height: `${(b / max) * 100}%` }}
        />
      ))}
    </div>
  )
}

function ModuleCard({
  href,
  title,
  metric,
  metricLabel,
  status,
}: {
  href: string
  title: string
  metric: string
  metricLabel: string
  status: string
}) {
  return (
    <Link
      href={href}
      className="group block border rounded-md p-4 bg-[color:var(--surface)] hover:border-[color:var(--accent)] transition-colors"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-baseline justify-between mb-3">
        <h4 className="text-base font-medium">{title}</h4>
        <span className="text-[10px] uppercase tracking-widest text-[color:var(--accent)]">
          {status}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold tabular-nums text-[color:var(--text-primary)]">
          {metric}
        </span>
        <span className="text-xs text-[color:var(--text-muted)]">{metricLabel}</span>
      </div>
    </Link>
  )
}
