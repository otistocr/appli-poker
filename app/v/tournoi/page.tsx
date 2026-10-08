"use client"

import Link from "next/link"

// Tournament serious / WSOP / final table : black + big numbers + chip counts, "pro" feel

const BLACK = "#0a0a0a"
const CARBON = "#141414"
const CARBON_2 = "#1c1c1c"
const RULE = "#2a2a2a"
const CHIP_RED = "#c8302c"
const CHIP_GOLD = "#d9b96c"
const IVORY = "#ede7d3"
const MUTED = "#8a857a"

export default function TournoiVariant() {
  return (
    <div
      style={{
        background: BLACK,
        color: IVORY,
        fontFamily: "-apple-system, 'Inter', 'Helvetica Neue', sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* Top status — tournament clock feel */}
      <header
        className="border-b sticky top-0 z-40 backdrop-blur"
        style={{ borderColor: RULE, background: `${BLACK}dd` }}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between text-xs uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                style={{ background: CHIP_RED, borderColor: IVORY }}
              />
              <span style={{ letterSpacing: "0.2em", fontWeight: 800 }}>APPLI POKER</span>
            </div>
            <span style={{ color: MUTED }}>Cash 6-max</span>
            <span style={{ color: MUTED }}>Blindes 1/2</span>
            <span style={{ color: MUTED }}>Stack 100bb</span>
          </div>
          <div className="flex items-center gap-4">
            <span style={{ color: CHIP_GOLD }}>◉ session locale</span>
            <Link href="/v" style={{ color: MUTED }} className="hover:text-white">
              variantes
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — chip count as centerpiece */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-[1fr_1fr] gap-16 items-center">
        <div>
          <div
            className="text-xs uppercase mb-6 flex items-center gap-3"
            style={{ color: CHIP_GOLD, letterSpacing: "0.3em" }}
          >
            <div className="w-8 h-px" style={{ background: CHIP_GOLD }} />
            <span>Ta position dans le field</span>
          </div>
          <div className="text-6xl sm:text-8xl font-black tabular-nums leading-none tracking-tight" style={{ color: IVORY }}>
            1 842
          </div>
          <div className="text-lg mt-2 uppercase tracking-widest" style={{ color: MUTED, fontWeight: 700 }}>
            Points · Silver
          </div>

          <div className="mt-8 flex items-baseline gap-8">
            <NumBlock label="Précision" value="74.2%" color={CHIP_GOLD} />
            <NumBlock label="Streak" value="8" color={CHIP_RED} />
            <NumBlock label="Mains" value="342" color={IVORY} />
          </div>

          <div className="mt-10 flex gap-3">
            <Link
              href="/trainer"
              className="px-6 py-3 uppercase tracking-widest text-sm font-black"
              style={{
                background: CHIP_RED,
                color: IVORY,
                letterSpacing: "0.2em",
              }}
            >
              ▶ Lancer une session
            </Link>
            <Link
              href="/charts"
              className="px-6 py-3 uppercase tracking-widest text-sm font-black border-2"
              style={{
                color: IVORY,
                letterSpacing: "0.2em",
                borderColor: RULE,
              }}
            >
              Charts
            </Link>
          </div>
        </div>

        {/* Chip stack visualization */}
        <div className="hidden md:flex items-end justify-center gap-4">
          <ChipStack color={CHIP_RED} height={80} count={5} value="5" />
          <ChipStack color={CHIP_GOLD} height={100} count={8} value="10" />
          <ChipStack color={IVORY} height={70} count={4} value="25" />
          <ChipStack color="#3a3a3a" height={140} count={12} value="100" />
        </div>
      </section>

      {/* Blinds level / navigation as tournament rounds */}
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div
          className="border p-4 rounded-sm grid grid-cols-2 sm:grid-cols-5 gap-4 text-center"
          style={{ borderColor: RULE, background: CARBON }}
        >
          <ModuleTile n="01" href="/charts" name="Ranges" stat="18" />
          <ModuleTile n="02" href="/trainer" name="Drill" stat="3 modes" />
          <ModuleTile n="03" href="/academie" name="Cours" stat="10" />
          <ModuleTile n="04" href="/hh" name="HH" stat="PS / Wnx" />
          <ModuleTile n="05" href="/stats" name="Stats" stat="Local" />
        </div>
      </section>

      {/* Feature — final table */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <div
              className="text-xs uppercase mb-1"
              style={{ color: CHIP_GOLD, letterSpacing: "0.3em" }}
            >
              Cours en tête d&apos;affiche
            </div>
            <h2 className="text-3xl font-black tracking-tight">Les fondements de la GTO</h2>
          </div>
          <Link
            href="/academie"
            className="text-xs uppercase tracking-widest font-black"
            style={{ color: CHIP_GOLD }}
          >
            Voir tout →
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <FeatureCard
            rank="I"
            title="La théorie des jeux appliquée"
            meta="50 min · Avancé"
            href="/academie/gto-fondamentaux"
          />
          <FeatureCard
            rank="II"
            title="Penser en ranges"
            meta="40 min · Intermédiaire"
            href="/academie/ranges"
          />
          <FeatureCard
            rank="III"
            title="Pot odds & equity"
            meta="40 min · Intermédiaire"
            href="/academie/pot-odds-equity"
          />
        </div>
      </section>

      {/* Recent activity — tournament log */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div
          className="text-xs uppercase mb-4"
          style={{ color: CHIP_GOLD, letterSpacing: "0.3em" }}
        >
          Log de session
        </div>
        <div
          className="border rounded-sm divide-y"
          style={{ borderColor: RULE, background: CARBON }}
        >
          <LogRow time="19:04:12" text="Drill CO_RFI · A5s" result="RAISE" ok />
          <LogRow time="19:03:48" text="Drill BTN_RFI · 87s" result="CALL (exp. RAISE)" />
          <LogRow time="19:03:22" text="Drill BB_vs_open_UTG · QQ" result="RAISE" ok />
          <LogRow time="19:02:55" text="Chart BTN vs 3-bet consulté" result="—" />
          <LogRow time="19:02:31" text="Session ouverte" result="→ trainer" />
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t mt-16"
        style={{ borderColor: RULE }}
      >
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap justify-between text-xs uppercase" style={{ color: MUTED, letterSpacing: "0.2em" }}>
          <div>◉ APPLI POKER · Local Session</div>
          <div>V1.0</div>
        </div>
      </footer>
    </div>
  )
}

function NumBlock({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="text-2xl sm:text-3xl font-black tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-widest" style={{ color: MUTED, fontWeight: 700 }}>
        {label}
      </div>
    </div>
  )
}

function ChipStack({
  color,
  height,
  count,
  value,
}: {
  color: string
  height: number
  count: number
  value: string
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        style={{ width: 60, height }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="absolute w-14 h-3 rounded-full border-2"
            style={{
              background: color,
              borderColor: BLACK,
              bottom: i * (height / count),
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        ))}
      </div>
      <div className="text-xs mt-2 font-black tabular-nums" style={{ color: MUTED }}>
        ×{value}
      </div>
    </div>
  )
}

function ModuleTile({
  n,
  href,
  name,
  stat,
}: {
  n: string
  href: string
  name: string
  stat: string
}) {
  return (
    <Link
      href={href}
      className="block py-2 hover:bg-white/5 rounded transition-colors"
    >
      <div className="text-xs tabular-nums" style={{ color: MUTED, letterSpacing: "0.15em" }}>
        {n}
      </div>
      <div className="text-lg font-black tracking-tight" style={{ color: IVORY }}>
        {name}
      </div>
      <div className="text-[10px] uppercase" style={{ color: CHIP_GOLD, letterSpacing: "0.2em" }}>
        {stat}
      </div>
    </Link>
  )
}

function FeatureCard({
  rank,
  title,
  meta,
  href,
}: {
  rank: string
  title: string
  meta: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="block p-6 border rounded-sm hover:border-[color:var(--chip-gold)] transition-colors"
      style={{
        borderColor: RULE,
        background: CARBON,
      }}
    >
      <div className="text-4xl font-black mb-4 tabular-nums" style={{ color: CHIP_GOLD, fontFamily: "'Playfair Display', 'Georgia', serif" }}>
        {rank}
      </div>
      <div className="text-lg font-bold mb-1" style={{ color: IVORY }}>
        {title}
      </div>
      <div className="text-xs uppercase" style={{ color: MUTED, letterSpacing: "0.15em" }}>
        {meta}
      </div>
    </Link>
  )
}

function LogRow({
  time,
  text,
  result,
  ok,
}: {
  time: string
  text: string
  result: string
  ok?: boolean
}) {
  return (
    <div
      className="grid grid-cols-[100px_1fr_140px] gap-4 px-4 py-2.5 text-sm font-mono items-center"
      style={{ borderColor: RULE }}
    >
      <div className="text-xs tabular-nums" style={{ color: MUTED }}>
        {time}
      </div>
      <div style={{ color: IVORY }}>{text}</div>
      <div
        className="text-right text-xs font-bold tabular-nums"
        style={{ color: ok ? "#6cb98d" : result.includes("exp.") ? CHIP_RED : MUTED }}
      >
        {result}
      </div>
    </div>
  )
}
