"use client"

import Link from "next/link"

// Strava / Nike Run Club-inspired : big color block, activity feed, motivating
// Palette : bright orange primary #fc5200 (Strava), white bg, black text

const FEED = [
  {
    when: "Aujourd'hui · 19:04",
    title: "Session de drill",
    metric: "42 mains",
    perf: { label: "Précision", value: "74%", up: true },
    perf2: { label: "Streak max", value: "8" },
    tag: "Trainer",
  },
  {
    when: "Hier · 22:15",
    title: "Cours lu : Les maths du poker",
    metric: "45 min",
    perf: { label: "Sections", value: "6/6", up: true },
    perf2: { label: "Idées clés", value: "3" },
    tag: "Académie",
  },
  {
    when: "Il y a 2 jours · 20:30",
    title: "Analyse d'une main",
    metric: "1 hand",
    perf: { label: "Décision", value: "GTO ✓", up: true },
    perf2: { label: "Spot", value: "BTN vs 3-bet" },
    tag: "HH",
  },
]

export default function StravaVariant() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{
        color: "#242428",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Top */}
      <header
        className="border-b bg-white sticky top-0 z-40"
        style={{ borderColor: "#e6e6e6" }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black"
              style={{ background: "#fc5200" }}
            >
              ♠
            </div>
            <span className="font-black tracking-tight text-lg">appli poker</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold">
            <span className="border-b-2" style={{ borderColor: "#fc5200" }}>
              Accueil
            </span>
            <Link href="/trainer" className="text-neutral-500 hover:text-black">
              Entraînement
            </Link>
            <Link href="/stats" className="text-neutral-500 hover:text-black">
              Progression
            </Link>
          </nav>
          <Link
            href="/v"
            className="text-xs text-neutral-500 hover:text-black"
          >
            autres variantes
          </Link>
        </div>
      </header>

      {/* Big hero with orange block */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #fc5200 0%, #d84400 60%, #b23a00 100%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 py-16 sm:py-20 text-white">
          <div className="text-xs uppercase tracking-[0.2em] opacity-80 mb-4">
            Cette semaine
          </div>
          <div className="flex items-end gap-8 flex-wrap">
            <div>
              <div className="text-6xl sm:text-7xl font-black tabular-nums leading-none">
                342
              </div>
              <div className="text-sm opacity-80 mt-2 font-semibold uppercase tracking-widest">
                Mains drillées
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 sm:gap-8">
              <HeroStat label="Précision" value="74.2%" delta="+2.1%" />
              <HeroStat label="Streak" value="8" delta="best 22" />
              <HeroStat label="Temps" value="1h42" delta="cette semaine" />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Link
              href="/trainer"
              className="px-6 py-3 bg-white rounded-full font-black text-sm uppercase tracking-wider transition-transform hover:scale-105"
              style={{ color: "#fc5200" }}
            >
              Démarrer une session
            </Link>
            <Link
              href="/academie"
              className="px-6 py-3 border-2 border-white rounded-full font-bold text-sm text-white"
            >
              Voir les cours
            </Link>
          </div>
        </div>
      </section>

      {/* Weekly goal progress */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div
          className="p-5 rounded-2xl border-2 flex items-center gap-5"
          style={{ borderColor: "#e6e6e6" }}
        >
          <div>
            <div
              className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-black text-lg"
              style={{ borderColor: "#fc5200", color: "#fc5200" }}
            >
              68%
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest text-neutral-500 mb-1">
              Objectif hebdomadaire
            </div>
            <div className="font-black text-lg">500 mains drillées</div>
            <div className="text-sm text-neutral-500 mt-0.5">
              342 / 500 · reviens demain pour continuer
            </div>
          </div>
          <div
            className="hidden sm:block text-sm font-semibold px-4 py-2 rounded-full"
            style={{ background: "#fff3ec", color: "#fc5200" }}
          >
            +158 pour finir
          </div>
        </div>
      </section>

      {/* Activity feed */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-black">Fil d&apos;activité</h2>
          <span className="text-xs text-neutral-500">Local · ton historique</span>
        </div>
        <div className="space-y-3">
          {FEED.map((f, i) => (
            <ActivityCard key={i} {...f} />
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="max-w-5xl mx-auto px-6 py-8 pb-16">
        <h2 className="text-xl font-black mb-4">Explorer</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <ModuleTile href="/charts" title="Charts GTO" meta="18 ranges" />
          <ModuleTile href="/trainer" title="Trainer" meta="3 modes de drill" />
          <ModuleTile href="/academie" title="Académie" meta="10 cours" />
          <ModuleTile href="/hh" title="Hand history" meta="Analyse d'une main" />
        </div>
      </section>
    </div>
  )
}

function HeroStat({
  label,
  value,
  delta,
}: {
  label: string
  value: string
  delta?: string
}) {
  return (
    <div>
      <div className="text-3xl font-black tabular-nums leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-widest opacity-80 mt-1 font-semibold">
        {label}
      </div>
      {delta && <div className="text-xs opacity-70 mt-0.5">{delta}</div>}
    </div>
  )
}

function ActivityCard({
  when,
  title,
  metric,
  perf,
  perf2,
  tag,
}: {
  when: string
  title: string
  metric: string
  perf: { label: string; value: string; up?: boolean }
  perf2: { label: string; value: string }
  tag: string
}) {
  return (
    <div
      className="border-2 rounded-2xl p-5"
      style={{ borderColor: "#e6e6e6" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-neutral-500 font-semibold">{when}</div>
        <div
          className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-bold"
          style={{ background: "#fff3ec", color: "#fc5200" }}
        >
          {tag}
        </div>
      </div>
      <div className="font-black text-lg mb-3">{title}</div>
      <div className="flex items-baseline gap-8 flex-wrap">
        <div>
          <div className="text-2xl font-black tabular-nums">{metric}</div>
          <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
            Volume
          </div>
        </div>
        <div>
          <div
            className={`text-2xl font-black tabular-nums ${
              perf.up ? "" : ""
            }`}
            style={{ color: perf.up ? "#22a06b" : "#242428" }}
          >
            {perf.value}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
            {perf.label}
          </div>
        </div>
        <div>
          <div className="text-2xl font-black tabular-nums">{perf2.value}</div>
          <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
            {perf2.label}
          </div>
        </div>
      </div>
    </div>
  )
}

function ModuleTile({
  href,
  title,
  meta,
}: {
  href: string
  title: string
  meta: string
}) {
  return (
    <Link
      href={href}
      className="border-2 rounded-2xl p-5 hover:border-[#fc5200] transition-colors block group"
      style={{ borderColor: "#e6e6e6" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-black text-base">{title}</div>
          <div className="text-xs text-neutral-500 mt-0.5">{meta}</div>
        </div>
        <div
          className="opacity-0 group-hover:opacity-100 transition-opacity font-black"
          style={{ color: "#fc5200" }}
        >
          →
        </div>
      </div>
    </Link>
  )
}
