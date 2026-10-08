"use client"

import Link from "next/link"

// MasterClass-inspired : dark cinematic, warm gold accent, serif type
// Palette : deep near-black bg #0d0d0d, warm gold #b8975c, serif elegance

const FEATURED = [
  {
    href: "/academie/gto-fondamentaux",
    number: "01",
    title: "La théorie des jeux appliquée au poker",
    author: "Le fondement — GTO",
    duration: "50 min",
    gradient: "linear-gradient(135deg, #3a2c1c 0%, #1a1109 100%)",
  },
  {
    href: "/academie/ranges",
    number: "02",
    title: "Penser en ranges, pas en mains",
    author: "Le changement de paradigme",
    duration: "40 min",
    gradient: "linear-gradient(135deg, #2a1c1c 0%, #1a0e0e 100%)",
  },
  {
    href: "/academie/mental-game",
    number: "03",
    title: "Le mental game et la variance",
    author: "Survivre à long terme",
    duration: "35 min",
    gradient: "linear-gradient(135deg, #1c2a2a 0%, #0e1a1a 100%)",
  },
]

const MODULES = [
  { href: "/charts", n: "IX", label: "Charts GTO", meta: "18 ranges · consultation" },
  { href: "/trainer", n: "X", label: "Drill", meta: "Trois modes · feedback immédiat" },
  { href: "/hh", n: "XI", label: "Hand History", meta: "PokerStars & Winamax" },
  { href: "/stats", n: "XII", label: "Progression", meta: "Local · heatmap · trente jours" },
]

export default function MasterclassVariant() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "#0d0d0d",
        color: "#e8e2d5",
        fontFamily: "'Georgia', 'Cormorant Garamond', 'Playfair Display', serif",
      }}
    >
      {/* Top bar */}
      <header
        className="border-b sticky top-0 z-40 backdrop-blur"
        style={{ borderColor: "rgba(184, 151, 92, 0.2)", background: "rgba(13,13,13,0.85)" }}
      >
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xl"
              style={{ background: "#b8975c", color: "#0d0d0d" }}
            >
              ♠
            </div>
            <span className="text-lg tracking-wide">appli poker</span>
          </div>
          <div
            className="text-xs uppercase tracking-[0.3em] hidden sm:block"
            style={{ color: "#867555" }}
          >
            Une méthode pour le preflop
          </div>
          <Link
            href="/v"
            className="text-xs uppercase tracking-widest hover:text-[#b8975c]"
            style={{ color: "#867555" }}
          >
            Autres variantes
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 py-24 sm:py-32">
        <div
          className="text-xs uppercase tracking-[0.4em] mb-6"
          style={{ color: "#b8975c" }}
        >
          — Chapitres à l&apos;étude —
        </div>
        <h1
          className="text-5xl sm:text-7xl font-normal leading-[1.05] mb-8 tracking-tight"
          style={{ color: "#f0eadb" }}
        >
          Le poker se joue
          <br />
          <em style={{ color: "#b8975c" }}>avant les cartes.</em>
        </h1>
        <p
          className="text-lg leading-relaxed max-w-2xl"
          style={{ color: "#a89f89", fontFamily: "'Georgia', serif" }}
        >
          Une lecture guidée du jeu preflop, en douze chapitres, illustrée d&apos;exemples
          chiffrés. À votre rythme, sur votre navigateur, sans compte.
        </p>
      </section>

      {/* Featured chapters */}
      <section className="max-w-6xl mx-auto px-8 pb-24">
        <div
          className="text-xs uppercase tracking-[0.3em] mb-8 pb-4 border-b"
          style={{ color: "#867555", borderColor: "rgba(184,151,92,0.2)" }}
        >
          À la une · trois chapitres essentiels
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURED.map((f) => (
            <Link key={f.href} href={f.href} className="group block">
              <div
                className="aspect-[3/4] rounded-sm p-8 flex flex-col justify-between transition-transform group-hover:-translate-y-1 border"
                style={{
                  background: f.gradient,
                  borderColor: "rgba(184,151,92,0.15)",
                }}
              >
                <div
                  className="text-4xl font-serif tracking-widest"
                  style={{ color: "#b8975c" }}
                >
                  {f.number}
                </div>
                <div>
                  <div className="text-2xl leading-snug mb-3" style={{ color: "#f0eadb" }}>
                    {f.title}
                  </div>
                  <div className="text-sm italic" style={{ color: "#a89f89" }}>
                    {f.author}
                  </div>
                  <div
                    className="mt-4 text-xs uppercase tracking-widest"
                    style={{ color: "#867555" }}
                  >
                    {f.duration}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Other modules */}
      <section
        className="max-w-6xl mx-auto px-8 py-16 border-t"
        style={{ borderColor: "rgba(184,151,92,0.15)" }}
      >
        <div
          className="text-xs uppercase tracking-[0.3em] mb-8"
          style={{ color: "#867555" }}
        >
          Poursuivre · outils de travail
        </div>
        <div className="grid sm:grid-cols-2 gap-x-16 gap-y-4">
          {MODULES.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="group flex items-baseline gap-6 py-5 border-b hover:bg-black/20 -mx-2 px-2 transition-colors"
              style={{ borderColor: "rgba(184,151,92,0.15)" }}
            >
              <div
                className="text-xs tabular-nums w-8 shrink-0"
                style={{ color: "#867555" }}
              >
                {m.n}
              </div>
              <div className="flex-1">
                <div
                  className="text-xl group-hover:text-[#b8975c] transition-colors"
                  style={{ color: "#f0eadb" }}
                >
                  {m.label}
                </div>
                <div className="text-sm italic mt-1" style={{ color: "#867555" }}>
                  {m.meta}
                </div>
              </div>
              <div style={{ color: "#b8975c" }}>→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer quote */}
      <footer className="max-w-4xl mx-auto px-8 py-32 text-center">
        <div
          className="text-xs uppercase tracking-[0.4em] mb-6"
          style={{ color: "#867555" }}
        >
          Épilogue
        </div>
        <p
          className="text-2xl italic leading-relaxed"
          style={{ color: "#a89f89", fontFamily: "'Georgia', serif" }}
        >
          &laquo; Le meilleur joueur n&apos;est pas celui qui gagne toujours.
          <br />
          C&apos;est celui qui a raison de jouer comme il joue,
          <br />
          même les jours où il perd. &raquo;
        </p>
      </footer>
    </div>
  )
}
