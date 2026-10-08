"use client"

import Link from "next/link"

// Monocle / Wallpaper style : structured columns, serif titles + sans body,
// strong contrast between bold and light, editorial kickers

const PAPER = "#f4f2ed"
const INK = "#111111"
const ACCENT = "#c8202a"
const MUTED = "#7a746c"
const RULE = "#111111"

export default function MonocleVariant() {
  return (
    <div
      style={{
        background: PAPER,
        color: INK,
        fontFamily: "'Helvetica Neue', 'Inter', -apple-system, Arial, sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* Top spine */}
      <div style={{ borderColor: RULE }} className="border-b">
        <div className="max-w-6xl mx-auto px-8 py-3 flex items-center justify-between text-[10px] uppercase tracking-widest">
          <div className="flex items-center gap-6">
            <span style={{ fontWeight: 900, letterSpacing: "0.02em" }}>
              APPLI POKER
            </span>
            <span style={{ color: MUTED }}>Volume 1 · Issue 1 · Juillet 2026</span>
          </div>
          <Link href="/v" style={{ color: MUTED }} className="hover:underline">
            Autres variantes
          </Link>
        </div>
      </div>

      {/* Section spine */}
      <div style={{ borderColor: RULE }} className="border-b">
        <div className="max-w-6xl mx-auto px-8 py-3 flex items-center gap-6 text-[10px] uppercase tracking-widest">
          <span style={{ color: ACCENT, fontWeight: 700 }}>
            ● En couverture
          </span>
          <Link href="/charts">Ranges</Link>
          <Link href="/trainer">Entraînement</Link>
          <Link href="/academie">Chapitres</Link>
          <Link href="/hh">Analyse</Link>
          <Link href="/stats">Bilan</Link>
        </div>
      </div>

      {/* Hero — big serif cover title */}
      <section className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-[3fr_2fr] gap-12">
        <div>
          <div
            className="text-xs uppercase mb-4 flex items-center gap-3"
            style={{ letterSpacing: "0.2em" }}
          >
            <span style={{ color: ACCENT, fontWeight: 700 }}>
              Nº 001
            </span>
            <span style={{ color: MUTED }}>Le préflop, en dix chapitres</span>
          </div>
          <h1
            className="text-6xl sm:text-8xl leading-[0.95] mb-6 text-balance"
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            Le pré-flop,
            <br />
            <span style={{ color: MUTED }}>en dix chapitres</span>
          </h1>
          <p
            className="text-lg leading-relaxed max-w-xl"
            style={{ fontWeight: 300 }}
          >
            Un manuel opérationnel du poker avant les cartes. Ranges, drills, cours, analyses
            de mains — dans un cadre pensé pour la lecture attentive plutôt que le
            &laquo; scroll &raquo;.
          </p>

          <div
            className="mt-10 flex gap-3 text-xs uppercase tracking-widest"
          >
            <Link
              href="/academie"
              className="px-5 py-3"
              style={{
                background: INK,
                color: PAPER,
                fontWeight: 700,
                letterSpacing: "0.15em",
              }}
            >
              Commencer la lecture
            </Link>
            <Link
              href="/trainer"
              className="px-5 py-3 border-2"
              style={{
                borderColor: INK,
                color: INK,
                fontWeight: 700,
                letterSpacing: "0.15em",
              }}
            >
              Session drill
            </Link>
          </div>
        </div>

        {/* Sidebar — small features */}
        <aside>
          <div
            className="text-xs uppercase mb-4"
            style={{ color: ACCENT, letterSpacing: "0.2em", fontWeight: 700 }}
          >
            Dans ce numéro
          </div>
          <div className="space-y-6">
            <SmallFeature
              num="03"
              cat="Théorie"
              title="Penser en ranges"
              meta="40 min · Intermédiaire"
              href="/academie/ranges"
            />
            <SmallFeature
              num="05"
              cat="Stratégie"
              title="GTO — Fondamentaux"
              meta="50 min · Avancé"
              href="/academie/gto-fondamentaux"
            />
            <SmallFeature
              num="09"
              cat="Tournoi"
              title="Le modèle ICM"
              meta="45 min · Avancé"
              href="/academie/tournois-icm"
            />
          </div>
        </aside>
      </section>

      {/* Full-width divider block */}
      <div
        className="max-w-6xl mx-auto px-8 border-t border-b py-4 text-center text-xs uppercase tracking-[0.4em]"
        style={{ borderColor: RULE, color: MUTED }}
      >
        Édition locale · Pas de compte · Pas de suivi
      </div>

      {/* Sections — magazine style */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <div
          className="grid md:grid-cols-[1fr_2fr] gap-8 mb-16 border-b pb-16"
          style={{ borderColor: RULE }}
        >
          <div>
            <div
              className="text-xs uppercase mb-2"
              style={{ color: ACCENT, letterSpacing: "0.2em", fontWeight: 700 }}
            >
              Section · Ranges
            </div>
            <h2
              className="text-4xl leading-tight"
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontWeight: 900,
                letterSpacing: "-0.02em",
              }}
            >
              Dix-huit tableaux,
              <br />
              une méthode.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed mb-4" style={{ fontWeight: 300 }}>
              Consultation immédiate des ranges GTO préflop cash 6-max 100bb : RFI, vs open,
              vs 3-bet, vs 4-bet. Filtre par position, action, et profil adverse (GTO / vs
              fish / vs nit).
            </p>
            <Link
              href="/charts"
              className="inline-block border-b pb-1 text-sm uppercase tracking-widest"
              style={{ borderColor: INK, letterSpacing: "0.15em", fontWeight: 700 }}
            >
              Ouvrir les charts
            </Link>
          </div>
        </div>

        <div
          className="grid md:grid-cols-[1fr_2fr] gap-8 mb-16 border-b pb-16"
          style={{ borderColor: RULE }}
        >
          <div>
            <div
              className="text-xs uppercase mb-2"
              style={{ color: ACCENT, letterSpacing: "0.2em", fontWeight: 700 }}
            >
              Section · Pratique
            </div>
            <h2
              className="text-4xl leading-tight"
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontWeight: 900,
                letterSpacing: "-0.02em",
              }}
            >
              Un drill quotidien
              <br />
              qui révèle vos leaks.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed mb-4" style={{ fontWeight: 300 }}>
              Trois modes de pratique : aléatoire, ciblé sur une position, ou rejeu de vos
              erreurs. Feedback immédiat avec la fréquence GTO exacte. Difficulté adaptative :
              les spots à faible taux de réussite reviennent plus souvent.
            </p>
            <Link
              href="/trainer"
              className="inline-block border-b pb-1 text-sm uppercase tracking-widest"
              style={{ borderColor: INK, letterSpacing: "0.15em", fontWeight: 700 }}
            >
              Démarrer une session
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-8">
          <div>
            <div
              className="text-xs uppercase mb-2"
              style={{ color: ACCENT, letterSpacing: "0.2em", fontWeight: 700 }}
            >
              Section · Théorie
            </div>
            <h2
              className="text-4xl leading-tight"
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontWeight: 900,
                letterSpacing: "-0.02em",
              }}
            >
              Dix chapitres,
              <br />
              du calcul au mental.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed mb-4" style={{ fontWeight: 300 }}>
              Une progression pensée : mathématiques du poker, position, ranges, pot odds,
              GTO, préflop avancé, postflop, exploitation, tournois-ICM, mental game &
              bankroll. Environ sept heures de lecture au total.
            </p>
            <Link
              href="/academie"
              className="inline-block border-b pb-1 text-sm uppercase tracking-widest"
              style={{ borderColor: INK, letterSpacing: "0.15em", fontWeight: 700 }}
            >
              Table des matières
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="max-w-6xl mx-auto px-8 py-8 border-t text-xs uppercase tracking-widest"
        style={{ borderColor: RULE, color: MUTED }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span>© appli poker</span>
          <span>Éd. locale, non commerciale</span>
        </div>
      </footer>
    </div>
  )
}

function SmallFeature({
  num,
  cat,
  title,
  meta,
  href,
}: {
  num: string
  cat: string
  title: string
  meta: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="grid grid-cols-[36px_1fr] gap-3 items-baseline pb-4 border-b hover:pl-1 transition-all"
      style={{ borderColor: RULE }}
    >
      <div
        className="text-2xl"
        style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontWeight: 900,
          color: ACCENT,
        }}
      >
        {num}
      </div>
      <div>
        <div className="text-[10px] uppercase" style={{ color: MUTED, letterSpacing: "0.2em" }}>
          {cat}
        </div>
        <div
          className="text-xl mt-1"
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </div>
        <div className="text-xs mt-1" style={{ color: MUTED }}>
          {meta}
        </div>
      </div>
    </Link>
  )
}
