"use client"

import Link from "next/link"

// Notion / Bear-inspired : off-white bg, minimal chrome, content-first
// Palette : #faf9f7 bg, warm neutral text, subtle single accent

const PAGES = [
  {
    href: "/charts",
    icon: "▤",
    title: "Charts GTO",
    desc: "Consultation des 18 ranges préflop",
    tag: "outil",
  },
  {
    href: "/trainer",
    icon: "◈",
    title: "Trainer",
    desc: "Drill quotidien avec feedback",
    tag: "pratique",
  },
  {
    href: "/academie",
    icon: "📖",
    title: "Académie",
    desc: "10 cours structurés sur le preflop",
    tag: "lecture",
  },
  {
    href: "/hh",
    icon: "📄",
    title: "Hand history",
    desc: "Analyse d'une main jouée",
    tag: "review",
  },
  {
    href: "/stats",
    icon: "📊",
    title: "Statistiques",
    desc: "Progression, heatmap, spots",
    tag: "mesure",
  },
]

const RECENT = [
  { href: "/academie/mathematiques", label: "Les maths du poker", context: "il y a 2 jours" },
  { href: "/trainer", label: "Session drill · 42 mains", context: "hier" },
  { href: "/charts", label: "BTN vs open CO", context: "hier" },
]

export default function NotionVariant() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "#faf9f7",
        color: "#37352f",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Helvetica, sans-serif",
      }}
    >
      {/* Very minimal top */}
      <div
        className="border-b"
        style={{ borderColor: "#ebeae6" }}
      >
        <div className="max-w-3xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm" style={{ color: "#787774" }}>
            <span>♠</span>
            <span>appli poker</span>
            <span>/</span>
            <span style={{ color: "#37352f" }}>Home</span>
          </div>
          <Link
            href="/v"
            className="text-xs hover:underline"
            style={{ color: "#787774" }}
          >
            autres variantes
          </Link>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-8 py-16">
        {/* Emoji header */}
        <div className="text-5xl mb-6">♠</div>

        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight mb-3"
          style={{ color: "#37352f", letterSpacing: "-0.02em" }}
        >
          Home
        </h1>
        <p
          className="text-base mb-16 leading-relaxed"
          style={{ color: "#787774" }}
        >
          Ton espace de travail pour progresser au preflop. Tout est enregistré localement,
          rien n&apos;est envoyé ailleurs.
        </p>

        {/* Quote block, Notion style */}
        <blockquote
          className="border-l-2 pl-4 py-1 mb-16 italic"
          style={{ borderColor: "#37352f", color: "#37352f" }}
        >
          &laquo; Un bon joueur perd 30 à 40 % de ses sessions même en jouant parfaitement.
          Ce qui distingue un pro, c&apos;est qu&apos;il évalue ses décisions sur leur EV,
          pas sur leur résultat. &raquo;
        </blockquote>

        {/* Pages section */}
        <section className="mb-16">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#9b9a97", letterSpacing: "0.08em" }}
          >
            Pages
          </h2>
          <div className="space-y-px">
            {PAGES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="flex items-center gap-3 py-2 px-2 -mx-2 rounded hover:bg-black/[0.03] transition-colors"
              >
                <span
                  className="text-lg w-6 text-center"
                  style={{ color: "#9b9a97" }}
                >
                  {p.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-medium"
                    style={{ color: "#37352f" }}
                  >
                    {p.title}
                  </div>
                  <div className="text-xs" style={{ color: "#9b9a97" }}>
                    {p.desc}
                  </div>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded uppercase tracking-wider"
                  style={{
                    background: "#f0ede8",
                    color: "#787774",
                  }}
                >
                  {p.tag}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent */}
        <section className="mb-16">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#9b9a97", letterSpacing: "0.08em" }}
          >
            Récents
          </h2>
          <div className="space-y-2">
            {RECENT.map((r, i) => (
              <Link
                key={i}
                href={r.href}
                className="flex items-center gap-3 py-2 px-2 -mx-2 rounded hover:bg-black/[0.03]"
              >
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: "#9b9a97" }}
                />
                <span className="text-sm" style={{ color: "#37352f" }}>
                  {r.label}
                </span>
                <span className="text-xs ml-auto" style={{ color: "#9b9a97" }}>
                  {r.context}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Callout — Notion signature */}
        <div
          className="p-4 rounded-md mb-16 flex gap-3"
          style={{ background: "#f1f1ef" }}
        >
          <div className="text-lg">💡</div>
          <div className="text-sm leading-relaxed" style={{ color: "#37352f" }}>
            <strong>Aujourd&apos;hui</strong> — Reprends le cours &laquo; Position et
            dynamique de table &raquo;, tu l&apos;avais laissé à la section 3.
            <Link
              href="/academie/position"
              className="ml-2 underline"
              style={{ color: "#37352f" }}
            >
              Reprendre
            </Link>
          </div>
        </div>

        <div className="text-xs" style={{ color: "#9b9a97" }}>
          Dernière modification à l&apos;instant · Aucune donnée transmise
        </div>
      </main>
    </div>
  )
}
