"use client"

import Link from "next/link"

// Run It Once / modern poker training school : dark navy, suits for accents, dense stat bar

const BG = "#0f1420"
const SURFACE = "#161c2b"
const SURFACE_2 = "#1e2537"
const BORDER = "#2a324a"
const TEXT = "#e6e8ee"
const MUTED = "#7a8399"
const HEART = "#e34a4a"
const SPADE = "#4ec36e"
const ACCENT = HEART // red suits for hero accents

const COURSES = [
  { n: 1, href: "/academie/mathematiques", title: "Les mathématiques du préflop", tag: "Débutant", time: "45m" },
  { n: 2, href: "/academie/position", title: "Position et dynamique de table", tag: "Débutant", time: "30m" },
  { n: 3, href: "/academie/ranges", title: "Penser en ranges", tag: "Interm.", time: "40m" },
  { n: 4, href: "/academie/pot-odds-equity", title: "Pot odds & equity", tag: "Interm.", time: "40m" },
]

export default function RoomTrainingVariant() {
  return (
    <div
      style={{
        background: BG,
        color: TEXT,
        fontFamily: "-apple-system, 'Inter', 'Helvetica Neue', sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* Top nav */}
      <header
        className="border-b sticky top-0 z-40 backdrop-blur"
        style={{ borderColor: BORDER, background: `${BG}dd` }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center font-black"
                style={{ background: HEART, color: "white" }}
              >
                ♠
              </div>
              <span className="font-bold tracking-tight">appli poker</span>
            </div>
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              <NavLink href="/charts">Charts</NavLink>
              <NavLink href="/trainer">Drill</NavLink>
              <NavLink href="/academie" active>Cours</NavLink>
              <NavLink href="/hh">Hand history</NavLink>
              <NavLink href="/stats">Stats</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span style={{ color: MUTED }}>Silver · 1 842 pts</span>
            <Link href="/v" style={{ color: MUTED }} className="hover:text-white">
              variantes
            </Link>
          </div>
        </div>
      </header>

      {/* Stat strip */}
      <div style={{ background: SURFACE, borderColor: BORDER }} className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-3 grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
          <StatPill label="Ranges disponibles" value="18" />
          <StatPill label="Mains drillées" value="342" delta="+42" up />
          <StatPill label="Précision" value="74.2%" delta="+2.1" up />
          <StatPill label="Streak" value="8" delta="best 22" />
          <StatPill label="Cours vus" value="3/10" />
        </div>
      </div>

      {/* Hero — big learning banner */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div
          className="rounded-xl overflow-hidden relative border"
          style={{ borderColor: BORDER, background: SURFACE }}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 90% 30%, ${HEART}, transparent 60%)`,
            }}
          />
          <div className="relative p-8 sm:p-10 grid md:grid-cols-[1fr_200px] gap-8 items-center">
            <div>
              <div className="text-xs uppercase tracking-widest mb-3" style={{ color: HEART }}>
                ♥ Continue de progresser
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-2">
                Reprends là où tu t&apos;es arrêté
              </h1>
              <div className="text-lg font-semibold mb-1" style={{ color: MUTED }}>
                Cours 3 · Penser en ranges
              </div>
              <div className="text-sm mb-6" style={{ color: MUTED }}>
                Section 4/6 · 15 min restantes
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full overflow-hidden mb-6" style={{ background: SURFACE_2 }}>
                <div className="h-full" style={{ background: HEART, width: "62%" }} />
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/academie/ranges"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm"
                  style={{ background: HEART, color: "white" }}
                >
                  ▶ Reprendre le cours
                </Link>
                <Link
                  href="/trainer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm border"
                  style={{ borderColor: BORDER, color: TEXT }}
                >
                  Drill maintenant
                </Link>
              </div>
            </div>

            {/* Big suit block */}
            <div className="hidden md:flex items-center justify-center">
              <div
                className="text-9xl leading-none opacity-30"
                style={{ color: HEART }}
              >
                ♥
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses grid */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-bold">Cours à suivre</h2>
          <Link href="/academie" className="text-xs font-medium" style={{ color: HEART }}>
            Voir les 10 cours →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COURSES.map((c) => (
            <CourseCard key={c.n} {...c} />
          ))}
        </div>
      </section>

      {/* Two columns : drill quick + spots */}
      <section className="max-w-6xl mx-auto px-6 pb-10 grid lg:grid-cols-2 gap-4">
        <div
          className="rounded-xl p-5 border"
          style={{ borderColor: BORDER, background: SURFACE }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span style={{ color: SPADE }} className="text-lg">♠</span>
            <h3 className="font-bold">Modes de drill</h3>
          </div>
          <div className="space-y-2">
            <DrillMode label="Aléatoire" desc="Un spot au hasard sur les 18 ranges" href="/trainer" />
            <DrillMode label="Ciblé" desc="Sélectionne une position à travailler" href="/trainer" />
            <DrillMode label="Erreurs" desc="Rejeu de tes mains ratées" href="/trainer" />
          </div>
        </div>

        <div
          className="rounded-xl p-5 border"
          style={{ borderColor: BORDER, background: SURFACE }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span style={{ color: HEART }} className="text-lg">♥</span>
            <h3 className="font-bold">À retravailler</h3>
          </div>
          <div className="space-y-3">
            <WeakSpot name="BB vs UTG open" acc={62} played={18} />
            <WeakSpot name="CO vs 3-bet" acc={68} played={12} />
            <WeakSpot name="SB RFI" acc={71} played={22} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t"
        style={{ borderColor: BORDER }}
      >
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap justify-between text-xs" style={{ color: MUTED }}>
          <div>Cash 6-max · 100bb · GTO ranges</div>
          <div>Tout local · aucun compte</div>
        </div>
      </footer>
    </div>
  )
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-md text-sm font-medium"
      style={{
        color: active ? TEXT : MUTED,
        background: active ? SURFACE : "transparent",
      }}
    >
      {children}
    </Link>
  )
}

function StatPill({
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
    <div className="flex flex-col">
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold tabular-nums">{value}</span>
        {delta && (
          <span style={{ color: up ? SPADE : MUTED }} className="text-xs font-medium tabular-nums">
            {up ? "↑ " : ""}
            {delta}
          </span>
        )}
      </div>
      <div className="text-[10px] uppercase tracking-widest" style={{ color: MUTED }}>
        {label}
      </div>
    </div>
  )
}

function CourseCard({
  n,
  href,
  title,
  tag,
  time,
}: {
  n: number
  href: string
  title: string
  tag: string
  time: string
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl p-4 border hover:border-[color:var(--accent-hover)] transition-colors"
      style={{ borderColor: BORDER, background: SURFACE }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center font-black tabular-nums text-sm"
          style={{ background: SURFACE_2, color: MUTED }}
        >
          {String(n).padStart(2, "0")}
        </div>
        <div className="text-[10px] uppercase tracking-widest" style={{ color: MUTED }}>
          {tag} · {time}
        </div>
      </div>
      <div className="font-semibold text-sm mb-2 leading-snug">{title}</div>
      <div className="text-xs font-medium" style={{ color: HEART }}>
        Commencer →
      </div>
    </Link>
  )
}

function DrillMode({ label, desc, href }: { label: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-3 rounded-md border hover:bg-[color:var(--surface-2)]"
      style={{ borderColor: BORDER, background: SURFACE_2 }}
    >
      <div>
        <div className="font-semibold text-sm">{label}</div>
        <div className="text-xs" style={{ color: MUTED }}>{desc}</div>
      </div>
      <span style={{ color: HEART }}>▶</span>
    </Link>
  )
}

function WeakSpot({ name, acc, played }: { name: string; acc: number; played: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span>{name}</span>
        <span className="tabular-nums" style={{ color: MUTED }}>{acc}% · {played}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
        <div className="h-full" style={{ background: acc < 70 ? HEART : SPADE, width: `${acc}%` }} />
      </div>
    </div>
  )
}
