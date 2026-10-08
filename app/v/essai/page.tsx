"use client"

import Link from "next/link"

// Long-form essay / Substack premium : warm dark bg, serif reading, sidenotes

const PARCH = "#1c1815"
const INK = "#e8ddc9"
const RULE = "#3a3128"
const ACCENT = "#c9a961"
const MUTED = "#8a8072"

const TOC = [
  { n: "I", href: "/academie/mathematiques", title: "Les mathématiques du préflop" },
  { n: "II", href: "/academie/position", title: "La position et sa valeur" },
  { n: "III", href: "/academie/ranges", title: "L'idée de range" },
  { n: "IV", href: "/academie/pot-odds-equity", title: "Cotes et equity" },
  { n: "V", href: "/academie/gto-fondamentaux", title: "GTO — les fondements" },
  { n: "VI", href: "/academie/preflop-avance", title: "Préflop avancé" },
  { n: "VII", href: "/academie/postflop", title: "Postflop et c-bet" },
  { n: "VIII", href: "/academie/exploitation", title: "Exploiter, lire, ajuster" },
  { n: "IX", href: "/academie/tournois-icm", title: "Tournois, ICM, bulle" },
  { n: "X", href: "/academie/mental-game", title: "Mental, variance, bankroll" },
]

export default function EssaiVariant() {
  return (
    <div
      style={{
        background: PARCH,
        color: INK,
        fontFamily: "'Cormorant Garamond', 'Georgia', 'Times New Roman', serif",
        minHeight: "100vh",
      }}
    >
      {/* Header — minimal, reader-focused */}
      <header className="max-w-4xl mx-auto px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs" style={{ color: MUTED }}>
          <span style={{ color: ACCENT }}>♠</span>
          <span className="uppercase tracking-widest">appli poker</span>
        </div>
        <Link
          href="/v"
          className="text-xs uppercase tracking-widest hover:underline"
          style={{ color: MUTED }}
        >
          autres variantes
        </Link>
      </header>

      {/* Title block — full width, big serif */}
      <section className="max-w-2xl mx-auto px-8 py-16 sm:py-24 text-center">
        <div
          className="text-xs uppercase mb-8"
          style={{ color: ACCENT, letterSpacing: "0.4em" }}
        >
          Un essai en dix chapitres
        </div>
        <h1
          className="text-5xl sm:text-7xl leading-[1.05] mb-8 text-balance"
          style={{
            fontWeight: 400,
            letterSpacing: "-0.02em",
          }}
        >
          <em style={{ color: ACCENT }}>Avant</em>
          <br />
          les cartes.
        </h1>
        <p
          className="text-lg leading-[1.9] italic max-w-xl mx-auto"
          style={{ color: MUTED, fontWeight: 400 }}
        >
          Une méthode patiente pour comprendre le poker avant les cartes,
          <br />
          entre théorie, pratique et retour d&apos;expérience.
        </p>
      </section>

      {/* Preface */}
      <section className="max-w-2xl mx-auto px-8 py-8">
        <div
          className="text-xs uppercase mb-6 pb-3 border-b"
          style={{ color: ACCENT, letterSpacing: "0.3em", borderColor: RULE }}
        >
          Préface
        </div>
        <p className="text-lg leading-[1.9]">
          <span
            className="float-left text-6xl leading-none mr-3 mt-1"
            style={{ color: ACCENT, fontWeight: 400 }}
          >
            L
          </span>
          e poker se joue avec des chiffres, mais se comprend avec du temps. Vous ne
          trouverez ici ni promesse de progrès fulgurant, ni recette miracle. Simplement une
          progression pensée en dix chapitres, chacun articulé autour d&apos;un concept
          central — la combinatoire, la position, la range, l&apos;espérance
          mathématique — et prolongé par des exercices pratiques.
        </p>
        <p className="text-lg leading-[1.9] mt-4">
          À vous de choisir votre rythme. Rien ici ne s&apos;installe. Rien ne se paie. Rien
          ne quitte votre navigateur. Nous espérons que vous y trouverez un compagnon de
          lecture aussi bien qu&apos;un outil de travail.
        </p>
        <div
          className="mt-6 text-xs italic"
          style={{ color: MUTED }}
        >
          — L&apos;éditeur
        </div>
      </section>

      {/* TOC */}
      <section
        className="max-w-2xl mx-auto px-8 py-16 border-t"
        style={{ borderColor: RULE }}
      >
        <div
          className="text-xs uppercase mb-8 pb-3 border-b"
          style={{ color: ACCENT, letterSpacing: "0.3em", borderColor: RULE }}
        >
          Table des matières
        </div>

        <ol>
          {TOC.map((c) => (
            <li key={c.n}>
              <Link
                href={c.href}
                className="grid grid-cols-[60px_1fr] gap-4 items-baseline py-4 border-b hover:pl-2 transition-all group"
                style={{ borderColor: RULE }}
              >
                <div
                  className="text-2xl tracking-widest"
                  style={{ color: ACCENT, fontWeight: 400 }}
                >
                  {c.n}.
                </div>
                <div className="flex items-baseline gap-4">
                  <div
                    className="text-xl group-hover:italic transition-all"
                    style={{ fontWeight: 400 }}
                  >
                    {c.title}
                  </div>
                  <div className="flex-1 border-b border-dotted" style={{ borderColor: RULE }} />
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Appendices — tools */}
      <section
        className="max-w-2xl mx-auto px-8 py-16 border-t"
        style={{ borderColor: RULE }}
      >
        <div
          className="text-xs uppercase mb-8 pb-3 border-b"
          style={{ color: ACCENT, letterSpacing: "0.3em", borderColor: RULE }}
        >
          Appendices
        </div>
        <div className="space-y-6 text-lg leading-[1.9]">
          <div>
            <Link
              href="/charts"
              className="italic hover:underline"
              style={{ color: ACCENT }}
            >
              Charts GTO —
            </Link>{" "}
            dix-huit tableaux préflop en consultation libre, filtrables par action, position
            et profil adverse.
          </div>
          <div>
            <Link
              href="/trainer"
              className="italic hover:underline"
              style={{ color: ACCENT }}
            >
              Cahier d&apos;exercices —
            </Link>{" "}
            drills avec retour immédiat, difficulté adaptative et rejeu des erreurs
            passées.
          </div>
          <div>
            <Link
              href="/hh"
              className="italic hover:underline"
              style={{ color: ACCENT }}
            >
              Grand livre —
            </Link>{" "}
            analyse d&apos;une main jouée à partir d&apos;un texte PokerStars ou Winamax.
          </div>
          <div>
            <Link
              href="/stats"
              className="italic hover:underline"
              style={{ color: ACCENT }}
            >
              Journal de bord —
            </Link>{" "}
            suivi local des sessions, heatmap des mains, progression sur trente jours.
          </div>
        </div>
      </section>

      {/* Colophon */}
      <footer
        className="max-w-2xl mx-auto px-8 py-24 text-center border-t"
        style={{ borderColor: RULE }}
      >
        <div
          className="text-xs uppercase mb-4"
          style={{ color: ACCENT, letterSpacing: "0.4em" }}
        >
          Colophon
        </div>
        <p
          className="text-sm leading-relaxed italic"
          style={{ color: MUTED, fontWeight: 400 }}
        >
          Composé en Cormorant Garamond. Édition locale, non commerciale.
          <br />
          Aucun compte requis, aucune donnée transmise.
        </p>
      </footer>
    </div>
  )
}
