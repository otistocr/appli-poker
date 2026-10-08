"use client"

import Link from "next/link"

const CHAPTERS = [
  {
    num: "01",
    slug: "/charts",
    title: "Charts GTO",
    subtitle: "Les ranges, sans le solveur.",
    body:
      "Dix-huit ranges pré-calculées pour cash 6-max 100bb. Filtrables par action, position et profil adverse.",
  },
  {
    num: "02",
    slug: "/trainer",
    title: "Trainer",
    subtitle: "La répétition qui révèle tes leaks.",
    body:
      "Un spot au hasard, trois choix, feedback immédiat. Trois modes : aléatoire, ciblé par position, ou rejouer tes erreurs.",
  },
  {
    num: "03",
    slug: "/academie",
    title: "Académie",
    subtitle: "Dix cours, dans un ordre qui a du sens.",
    body:
      "Des mathématiques du preflop jusqu'au mental game. Rigueur des définitions, formules démontrées, exemples chiffrés.",
  },
  {
    num: "04",
    slug: "/hh",
    title: "Hand history",
    subtitle: "Colle une main, on regarde.",
    body:
      "Parser PokerStars et Winamax. Détection automatique de ta position, de la séquence d'actions, et comparaison à la range GTO du spot.",
  },
  {
    num: "05",
    slug: "/stats",
    title: "Statistiques",
    subtitle: "Ta progression, mesurée.",
    body:
      "Niveau, streak, heatmap des 169 mains, progression sur trente jours, spots les plus faibles à retravailler.",
  },
]

export default function EditorialVariant() {
  return (
    <main className="min-h-screen bg-[color:var(--bg)]">
      {/* Ultra minimal top */}
      <header className="max-w-4xl mx-auto px-8 pt-10 pb-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[color:var(--accent)]" />
          <span className="text-sm font-medium">appli poker</span>
        </div>
        <Link
          href="/v"
          className="text-xs text-[color:var(--text-muted)] hover:text-[color:var(--accent)]"
        >
          ← autres variantes
        </Link>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-8 py-16">
        <div className="text-xs uppercase tracking-[0.35em] text-[color:var(--text-muted)] mb-6">
          — Cinq chapitres —
        </div>
        <h1 className="text-4xl sm:text-6xl font-medium tracking-tight leading-[1.05] text-balance mb-6">
          Une lecture patiente
          <br />
          <span className="text-[color:var(--text-secondary)]">
            du preflop qui te fait progresser.
          </span>
        </h1>
        <p className="text-lg text-[color:var(--text-secondary)] leading-relaxed max-w-xl">
          Cinq modules pour bâtir ta compréhension du jeu avant les cartes, de la théorie
          à l&apos;exécution. Rien ne s&apos;installe, rien ne se paie, rien ne quitte ton
          navigateur.
        </p>
      </section>

      {/* Chapters */}
      <section className="max-w-4xl mx-auto px-8 py-16">
        <div className="space-y-24">
          {CHAPTERS.map((ch) => (
            <article key={ch.num} className="grid md:grid-cols-[80px_1fr] gap-8">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--text-muted)] pt-2">
                Ch. {ch.num}
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-medium tracking-tight leading-tight mb-1">
                  {ch.title}
                </h2>
                <p className="text-lg text-[color:var(--text-secondary)] mb-4">
                  {ch.subtitle}
                </p>
                <p className="text-[color:var(--text-primary)]/80 leading-[1.75] max-w-2xl mb-6">
                  {ch.body}
                </p>
                <Link
                  href={ch.slug}
                  className="inline-flex items-center gap-2 text-sm text-[color:var(--accent)] border-b pb-1 hover:pb-2 transition-all"
                  style={{ borderColor: "var(--accent)" }}
                >
                  Ouvrir le chapitre
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-8 py-24 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--text-muted)] mb-3">
          Fin
        </div>
        <p className="text-[color:var(--text-secondary)] max-w-lg mx-auto italic">
          &laquo; Les cartes que tu joues comptent moins que le cadre avec lequel tu les
          joues. &raquo;
        </p>
      </footer>
    </main>
  )
}
