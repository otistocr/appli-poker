"use client"

import Link from "next/link"

// Duolingo-inspired : bright, friendly, gamified
// Palette : white bg, warm gray, primary green #58cc02, secondary blues/oranges

const PATHS = [
  {
    href: "/academie/mathematiques",
    label: "Les maths du poker",
    step: 1,
    total: 10,
    done: 3,
    color: "#58cc02",
  },
  {
    href: "/academie/position",
    label: "La position",
    step: 2,
    total: 8,
    done: 0,
    color: "#1cb0f6",
  },
  {
    href: "/academie/ranges",
    label: "Penser en ranges",
    step: 3,
    total: 12,
    done: 0,
    color: "#ff9600",
  },
  {
    href: "/academie/pot-odds-equity",
    label: "Pot odds & equity",
    step: 4,
    total: 10,
    done: 0,
    color: "#ce82ff",
  },
]

export default function DuoVariant() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "#fff",
        color: "#3c3c3c",
        fontFamily: "'Feather Bold', 'Nunito', -apple-system, sans-serif",
      }}
    >
      {/* Top bar */}
      <header
        className="border-b bg-white sticky top-0 z-40"
        style={{ borderColor: "#e5e5e5" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-lg"
              style={{ background: "#58cc02" }}
            >
              ♠
            </div>
            <span className="text-lg font-extrabold" style={{ color: "#3c3c3c" }}>
              appli poker
            </span>
          </div>
          <div className="flex items-center gap-4">
            <StatChip icon="🔥" value="8" color="#ff9600" />
            <StatChip icon="💎" value="1 842" color="#1cb0f6" />
            <StatChip icon="❤️" value="5/5" color="#ff4b4b" />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 grid lg:grid-cols-[1fr_280px] gap-8">
        {/* Learning path */}
        <div>
          <div
            className="mb-6 p-4 rounded-2xl flex items-center gap-4"
            style={{ background: "#f0f9ff", border: "2px solid #cfe9ff" }}
          >
            <div className="text-3xl">🎯</div>
            <div className="flex-1">
              <div className="text-xs font-bold uppercase" style={{ color: "#1cb0f6" }}>
                Objectif du jour
              </div>
              <div className="text-lg font-bold" style={{ color: "#3c3c3c" }}>
                20 mains drillées
              </div>
            </div>
            <div
              className="text-sm font-bold px-4 py-2 rounded-full"
              style={{ background: "#1cb0f6", color: "white" }}
            >
              14 / 20
            </div>
          </div>

          <h2 className="text-xl font-black mb-4" style={{ color: "#3c3c3c" }}>
            Ton parcours
          </h2>
          <div className="space-y-4">
            {PATHS.map((p, i) => (
              <PathCard key={p.href} {...p} isFirst={i === 0} />
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-black mb-4" style={{ color: "#3c3c3c" }}>
              Défis quotidiens
            </h2>
            <div className="grid sm:grid-cols-3 gap-3">
              <ChallengeCard title="Speed drill" desc="10 mains en 60s" xp={30} icon="⚡" color="#ff9600" />
              <ChallengeCard title="Perfect run" desc="5 mains sans erreur" xp={50} icon="✨" color="#ce82ff" />
              <ChallengeCard title="Weak spot" desc="Rejoue tes erreurs" xp={40} icon="🎯" color="#ff4b4b" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="p-5 rounded-2xl border-2" style={{ borderColor: "#e5e5e5" }}>
            <div className="text-xs font-black uppercase mb-3" style={{ color: "#8e8e8e" }}>
              Ton niveau
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl"
                style={{ background: "#58cc02" }}
              >
                ⚔
              </div>
              <div>
                <div className="text-lg font-black" style={{ color: "#3c3c3c" }}>
                  Silver
                </div>
                <div className="text-xs" style={{ color: "#8e8e8e" }}>
                  158 XP → Gold
                </div>
              </div>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: "#e5e5e5" }}>
              <div className="h-full" style={{ background: "#58cc02", width: "42%" }} />
            </div>
          </div>

          <Link
            href="/trainer"
            className="block p-5 rounded-2xl text-center font-black text-white transition-transform hover:scale-105"
            style={{ background: "#58cc02", boxShadow: "0 4px 0 #4a9d02" }}
          >
            <div className="text-lg">Commencer une leçon</div>
            <div className="text-xs opacity-90 mt-1 font-normal">Trainer · ~5 min</div>
          </Link>

          <div className="p-5 rounded-2xl border-2" style={{ borderColor: "#e5e5e5" }}>
            <div className="text-xs font-black uppercase mb-3" style={{ color: "#8e8e8e" }}>
              Amis (bientôt)
            </div>
            <div className="text-sm" style={{ color: "#3c3c3c" }}>
              Compare ta streak avec des amis, débloque les défis à deux.
            </div>
          </div>
        </aside>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-8">
        <Link
          href="/v"
          className="text-xs font-bold hover:underline"
          style={{ color: "#8e8e8e" }}
        >
          ← autres variantes
        </Link>
      </div>
    </div>
  )
}

function StatChip({ icon, value, color }: { icon: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 font-black" style={{ color }}>
      <span>{icon}</span>
      <span className="tabular-nums text-sm">{value}</span>
    </div>
  )
}

function PathCard({
  href,
  label,
  step,
  total,
  done,
  color,
  isFirst,
}: {
  href: string
  label: string
  step: number
  total: number
  done: number
  color: string
  isFirst: boolean
}) {
  const pct = (done / total) * 100
  return (
    <Link
      href={href}
      className="block p-5 rounded-2xl border-2 transition-transform hover:scale-[1.01]"
      style={{
        borderColor: isFirst ? color : "#e5e5e5",
        background: isFirst ? `${color}0d` : "white",
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0"
          style={{ background: color }}
        >
          {step}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-lg font-black mb-1" style={{ color: "#3c3c3c" }}>
            {label}
          </div>
          <div className="text-xs mb-2" style={{ color: "#8e8e8e" }}>
            {done}/{total} leçons complétées
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "#e5e5e5" }}>
            <div className="h-full" style={{ background: color, width: `${pct}%` }} />
          </div>
        </div>
        <div className="text-xl" style={{ color }}>
          {isFirst ? "▶" : "🔒"}
        </div>
      </div>
    </Link>
  )
}

function ChallengeCard({
  title,
  desc,
  xp,
  icon,
  color,
}: {
  title: string
  desc: string
  xp: number
  icon: string
  color: string
}) {
  return (
    <div
      className="p-4 rounded-2xl border-2"
      style={{ borderColor: "#e5e5e5", background: "white" }}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-black text-sm mb-0.5" style={{ color: "#3c3c3c" }}>
        {title}
      </div>
      <div className="text-xs mb-2" style={{ color: "#8e8e8e" }}>
        {desc}
      </div>
      <div className="text-xs font-black" style={{ color }}>
        +{xp} XP
      </div>
    </div>
  )
}
