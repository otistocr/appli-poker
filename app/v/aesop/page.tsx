"use client"

import Link from "next/link"

// Aesop / boutique brand : bone bg, warm brown text, ultra minimal, luxury retail vibe

const BONE = "#f0ebe0"
const INK = "#33322e"
const RULE = "#c5bfaf"
const MUTED = "#8a8474"
const ACCENT = "#33322e" // deliberate: no bright accent, restraint

const MODULES = [
  {
    href: "/charts",
    number: "I.",
    label: "Charts",
    desc: "Consultation des dix-huit ranges pré-calculées.",
  },
  {
    href: "/trainer",
    number: "II.",
    label: "Entraînement",
    desc: "Trois modes de drill avec retour immédiat.",
  },
  {
    href: "/academie",
    number: "III.",
    label: "Académie",
    desc: "Dix chapitres, du calcul à la psychologie.",
  },
  {
    href: "/hh",
    number: "IV.",
    label: "Analyse",
    desc: "Décomposition d'une main jouée.",
  },
  {
    href: "/stats",
    number: "V.",
    label: "Progression",
    desc: "Suivi local de vos sessions.",
  },
]

export default function AesopVariant() {
  return (
    <div
      style={{
        background: BONE,
        color: INK,
        fontFamily: "'Optima', 'Cormorant Garamond', 'Georgia', serif",
        minHeight: "100vh",
      }}
    >
      {/* Ultra minimal top */}
      <header
        style={{ borderColor: RULE }}
        className="border-b"
      >
        <div className="max-w-5xl mx-auto px-8 py-5 flex items-center justify-between">
          <div
            className="text-xs uppercase tracking-[0.3em]"
            style={{ letterSpacing: "0.3em" }}
          >
            appli poker
          </div>
          <Link
            href="/v"
            className="text-xs uppercase tracking-[0.3em] hover:underline"
            style={{ color: MUTED, letterSpacing: "0.3em" }}
          >
            variantes
          </Link>
        </div>
      </header>

      {/* Hero — restraint maximal */}
      <section className="max-w-3xl mx-auto px-8 pt-32 pb-24">
        <div
          className="text-[10px] uppercase mb-8"
          style={{ color: MUTED, letterSpacing: "0.4em" }}
        >
          — Édition Nº 1 —
        </div>
        <h1
          className="text-5xl sm:text-6xl leading-[1.1] mb-8 text-balance"
          style={{
            fontWeight: 300,
            letterSpacing: "-0.02em",
          }}
        >
          Une pratique
          <br />
          du poker préflop,
          <br />
          conçue avec attention.
        </h1>
        <p
          className="text-lg max-w-xl leading-relaxed"
          style={{ color: MUTED, fontWeight: 300 }}
        >
          Cinq modules pour construire une compréhension durable du jeu avant les cartes.
          Rien ne s&apos;installe. Rien ne se paie. Rien ne quitte votre navigateur.
        </p>
      </section>

      {/* Modules — presented as product line */}
      <section
        className="max-w-3xl mx-auto px-8 py-16 border-t"
        style={{ borderColor: RULE }}
      >
        <div
          className="text-[10px] uppercase mb-8"
          style={{ color: MUTED, letterSpacing: "0.4em" }}
        >
          La collection
        </div>
        <div className="space-y-1">
          {MODULES.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="group grid grid-cols-[60px_1fr_auto] items-baseline gap-8 py-6 border-b hover:pl-2 transition-all"
              style={{ borderColor: RULE }}
            >
              <div
                className="text-xs uppercase tracking-widest"
                style={{ color: MUTED, letterSpacing: "0.2em" }}
              >
                {m.number}
              </div>
              <div>
                <div
                  className="text-2xl mb-1 leading-snug"
                  style={{ fontWeight: 300, letterSpacing: "-0.01em" }}
                >
                  {m.label}
                </div>
                <div className="text-sm leading-relaxed" style={{ color: MUTED }}>
                  {m.desc}
                </div>
              </div>
              <div
                className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ letterSpacing: "0.2em", color: INK }}
              >
                Découvrir →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Philosophy — a signature block */}
      <section
        className="max-w-3xl mx-auto px-8 py-24 border-t"
        style={{ borderColor: RULE }}
      >
        <div
          className="text-[10px] uppercase mb-6"
          style={{ color: MUTED, letterSpacing: "0.4em" }}
        >
          Philosophie
        </div>
        <p
          className="text-2xl leading-[1.7] max-w-2xl italic"
          style={{ fontWeight: 300, letterSpacing: "-0.01em" }}
        >
          Le poker se joue avec des chiffres, mais se comprend avec du temps. Nous préférons
          un chapitre lu avec attention à cent notions parcourues.
        </p>
      </section>

      {/* Footer */}
      <footer
        className="max-w-3xl mx-auto px-8 py-12 border-t"
        style={{ borderColor: RULE }}
      >
        <div
          className="text-[10px] uppercase flex flex-wrap justify-between gap-4"
          style={{ color: MUTED, letterSpacing: "0.3em" }}
        >
          <div>© appli poker</div>
          <div>Local uniquement · Aucun compte requis</div>
        </div>
      </footer>
    </div>
  )
}
