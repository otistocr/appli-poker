"use client"

import Link from "next/link"

// Vintage playing cards : bordeaux, cream, ornate gold accents. Art deco touches.

const CREAM = "#f4ead6"
const CREAM_DEEP = "#eadfb8"
const BORDEAUX = "#5a1e1a"
const BORDEAUX_LIGHT = "#7a2d28"
const GOLD = "#a88530"
const GOLD_DEEP = "#7d611f"
const INK = "#241611"

// Art deco ornament rendered as unicode + custom
function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 my-8" style={{ color: GOLD }}>
      <div className="w-16 h-px" style={{ background: GOLD }} />
      <span className="text-lg">✦</span>
      <span>♠</span>
      <span className="text-2xl">♦</span>
      <span>♥</span>
      <span>♣</span>
      <span className="text-lg">✦</span>
      <div className="w-16 h-px" style={{ background: GOLD }} />
    </div>
  )
}

const CHAPTERS = [
  { n: "I", href: "/academie/mathematiques", title: "Des Mathématiques" },
  { n: "II", href: "/academie/position", title: "De la Position" },
  { n: "III", href: "/academie/ranges", title: "De l'Idée de Range" },
  { n: "IV", href: "/academie/pot-odds-equity", title: "Des Cotes du Pot" },
  { n: "V", href: "/academie/gto-fondamentaux", title: "De la Théorie des Jeux" },
]

export default function VintageVariant() {
  return (
    <div
      style={{
        background: CREAM,
        color: INK,
        fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
        minHeight: "100vh",
        backgroundImage: `
          radial-gradient(circle at 0% 0%, ${CREAM_DEEP} 0%, transparent 25%),
          radial-gradient(circle at 100% 100%, ${CREAM_DEEP} 0%, transparent 25%)
        `,
      }}
    >
      {/* Ornate top bar */}
      <header
        style={{
          borderBottom: `3px double ${BORDEAUX}`,
          background: CREAM_DEEP,
        }}
      >
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between text-xs uppercase tracking-widest" style={{ color: BORDEAUX }}>
          <div className="flex items-center gap-2">
            <span>♠</span>
            <span style={{ letterSpacing: "0.3em", fontWeight: 700 }}>APPLI POKER</span>
            <span>♠</span>
          </div>
          <Link href="/v" style={{ color: BORDEAUX_LIGHT }} className="hover:underline">
            autres variantes
          </Link>
        </div>
      </header>

      {/* Hero — a title page from an old book */}
      <section className="max-w-3xl mx-auto px-8 py-16 sm:py-24 text-center">
        <div className="text-xs uppercase mb-4" style={{ color: GOLD, letterSpacing: "0.4em", fontWeight: 700 }}>
          — Établi en 2026 —
        </div>

        <Ornament />

        <h1
          className="text-5xl sm:text-7xl leading-[1.1] mb-6"
          style={{
            color: BORDEAUX,
            fontWeight: 900,
            letterSpacing: "-0.01em",
          }}
        >
          Traité
          <br />
          <em style={{ color: GOLD_DEEP, fontWeight: 400 }}>du poker préflop</em>
        </h1>

        <p
          className="text-lg italic max-w-xl mx-auto leading-relaxed"
          style={{ color: BORDEAUX_LIGHT }}
        >
          &laquo; Contenant les principes et pratiques du jeu avant les cartes,
          <br />
          en dix chapitres méthodiques &raquo;
        </p>

        <Ornament />

        <div className="text-xs uppercase mt-8" style={{ color: GOLD, letterSpacing: "0.3em" }}>
          Édition locale · Volume premier
        </div>
      </section>

      {/* Feature card — playing card portrait style */}
      <section className="max-w-4xl mx-auto px-8 py-10">
        <div
          className="rounded-lg p-8 sm:p-12 relative overflow-hidden"
          style={{
            background: CREAM_DEEP,
            border: `2px solid ${GOLD}`,
            boxShadow: `inset 0 0 0 4px ${CREAM_DEEP}, inset 0 0 0 6px ${GOLD}`,
          }}
        >
          {/* Suits in corners like a real playing card */}
          <div className="absolute top-4 left-4 text-2xl" style={{ color: BORDEAUX }}>♠</div>
          <div className="absolute top-4 right-4 text-2xl" style={{ color: BORDEAUX }}>♥</div>
          <div className="absolute bottom-4 left-4 text-2xl" style={{ color: BORDEAUX }}>♦</div>
          <div className="absolute bottom-4 right-4 text-2xl" style={{ color: BORDEAUX }}>♣</div>

          <div className="text-center">
            <div className="text-xs uppercase mb-3" style={{ color: GOLD_DEEP, letterSpacing: "0.3em", fontWeight: 700 }}>
              Chapitre du jour
            </div>
            <h2
              className="text-3xl sm:text-4xl mb-3"
              style={{ color: BORDEAUX, fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              De l&apos;Idée de Range
            </h2>
            <p className="italic text-lg mb-6 max-w-lg mx-auto" style={{ color: BORDEAUX_LIGHT }}>
              &laquo; Où l&apos;on démontre que penser en ensembles vaut mieux que de deviner
              des mains, avec démonstrations chiffrées à l&apos;appui. &raquo;
            </p>
            <Link
              href="/academie/ranges"
              className="inline-block px-6 py-3 text-xs uppercase tracking-widest"
              style={{
                background: BORDEAUX,
                color: CREAM,
                letterSpacing: "0.3em",
                fontWeight: 700,
                border: `1px solid ${GOLD}`,
              }}
            >
              Ouvrir le chapitre
            </Link>
          </div>
        </div>
      </section>

      {/* TOC */}
      <section className="max-w-3xl mx-auto px-8 py-16">
        <div className="text-center mb-8">
          <div className="text-xs uppercase mb-3" style={{ color: GOLD_DEEP, letterSpacing: "0.4em", fontWeight: 700 }}>
            Table des matières
          </div>
          <div className="w-16 h-px mx-auto" style={{ background: GOLD }} />
        </div>

        <ol>
          {CHAPTERS.map((c) => (
            <li key={c.n}>
              <Link
                href={c.href}
                className="grid grid-cols-[80px_1fr_60px] gap-4 items-baseline py-4 group hover:pl-2 transition-all"
                style={{ borderBottom: `1px dotted ${GOLD}` }}
              >
                <div className="text-2xl italic" style={{ color: GOLD_DEEP, fontWeight: 400 }}>
                  Ch. {c.n}
                </div>
                <div className="text-xl" style={{ color: INK, fontWeight: 500 }}>
                  {c.title}
                </div>
                <div style={{ color: BORDEAUX_LIGHT }} className="text-right group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <div className="text-center mt-6 italic text-sm" style={{ color: GOLD_DEEP }}>
          Cinq autres chapitres à venir · voir la liste complète
        </div>
      </section>

      {/* Practical tools section */}
      <section className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-8">
          <div className="text-xs uppercase mb-3" style={{ color: GOLD_DEEP, letterSpacing: "0.4em", fontWeight: 700 }}>
            Instruments de travail
          </div>
          <div className="w-16 h-px mx-auto" style={{ background: GOLD }} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <ToolCard suit="♠" name="Charts GTO" desc="Dix-huit tableaux de ranges" href="/charts" />
          <ToolCard suit="♥" name="Cahier d'exercices" desc="Trois modes de pratique quotidienne" href="/trainer" />
          <ToolCard suit="♦" name="Analyse d'une main" desc="PokerStars & Winamax" href="/hh" />
          <ToolCard suit="♣" name="Journal de bord" desc="Progression sur trente jours" href="/stats" />
        </div>
      </section>

      {/* Colophon */}
      <footer
        style={{ borderTop: `3px double ${BORDEAUX}`, background: CREAM_DEEP }}
        className="mt-12"
      >
        <div className="max-w-4xl mx-auto px-8 py-8 text-center text-xs uppercase" style={{ color: BORDEAUX, letterSpacing: "0.3em" }}>
          <div className="mb-2">✦ Colophon ✦</div>
          <div style={{ color: BORDEAUX_LIGHT, fontFamily: "'Cormorant Garamond', serif" }} className="italic normal-case tracking-normal text-sm">
            Composé pour un usage local. Aucun compte, aucune donnée transmise.
          </div>
        </div>
      </footer>
    </div>
  )
}

function ToolCard({
  suit,
  name,
  desc,
  href,
}: {
  suit: string
  name: string
  desc: string
  href: string
}) {
  const isRed = suit === "♥" || suit === "♦"
  return (
    <Link
      href={href}
      className="p-5 flex items-center gap-4 group transition-all hover:pl-6"
      style={{
        background: CREAM_DEEP,
        border: `1px solid ${GOLD}`,
      }}
    >
      <div className="text-4xl" style={{ color: isRed ? BORDEAUX : INK }}>
        {suit}
      </div>
      <div className="flex-1">
        <div style={{ color: BORDEAUX, fontWeight: 700 }} className="text-lg">
          {name}
        </div>
        <div className="italic text-sm" style={{ color: BORDEAUX_LIGHT }}>
          {desc}
        </div>
      </div>
      <div style={{ color: GOLD_DEEP }} className="opacity-0 group-hover:opacity-100 transition-opacity">
        →
      </div>
    </Link>
  )
}
