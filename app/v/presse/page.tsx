"use client"

import Link from "next/link"

// Le Monde / NYT style : cream bg, black serif, editorial columns

const CREAM = "#f8f4ea"
const INK = "#141210"
const RULE = "#141210"
const ACCENT = "#8b2b1f"
const MUTED = "#6b6255"

export default function PresseVariant() {
  return (
    <div
      style={{
        background: CREAM,
        color: INK,
        fontFamily: "'Georgia', 'Times New Roman', 'Playfair Display', serif",
        minHeight: "100vh",
      }}
    >
      {/* Masthead */}
      <div
        style={{ borderColor: RULE }}
        className="border-b-4"
      >
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <div style={{ color: MUTED }} className="text-[10px] uppercase tracking-widest">
              Nº 001 · Cash Game 6-max · 100bb
            </div>
            <div style={{ color: MUTED }} className="text-[10px] uppercase tracking-widest">
              Mercredi 9 juillet 2026 · Éd. locale
            </div>
          </div>
          <h1
            className="text-center text-6xl sm:text-8xl tracking-tight mt-3"
            style={{ letterSpacing: "-0.03em", fontWeight: 900 }}
          >
            appli poker
          </h1>
          <div
            className="text-center italic text-sm mt-2"
            style={{ color: MUTED }}
          >
            Le journal du préflop — indépendant, local, sans compte
          </div>
        </div>
      </div>

      {/* Sub nav */}
      <div style={{ borderColor: RULE }} className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center gap-6 text-xs uppercase tracking-widest">
          {[
            { href: "/", label: "Une" },
            { href: "/charts", label: "Ranges" },
            { href: "/trainer", label: "Drill" },
            { href: "/academie", label: "Cours" },
            { href: "/hh", label: "Analyse de main" },
            { href: "/stats", label: "Progression" },
          ].map((l, i) => (
            <Link key={i} href={l.href} className="hover:underline">
              {l.label}
            </Link>
          ))}
          <Link
            href="/v"
            className="ml-auto italic normal-case"
            style={{ color: MUTED }}
          >
            autres variantes
          </Link>
        </div>
      </div>

      {/* Front page */}
      <main className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-[2fr_1fr] gap-10">
        {/* Lead */}
        <article>
          <div
            className="text-xs uppercase tracking-widest mb-3"
            style={{ color: ACCENT, letterSpacing: "0.2em" }}
          >
            À la une · Cours du jour
          </div>
          <h2
            className="text-5xl sm:text-6xl mb-4 leading-[1.05] tracking-tight"
            style={{ letterSpacing: "-0.02em", fontWeight: 800 }}
          >
            Penser en ranges, pas en mains
          </h2>
          <div className="italic mb-6" style={{ color: MUTED }}>
            Par le rédacteur en chef · 40 minutes · Intermédiaire
          </div>
          <p className="text-lg leading-[1.7] mb-4">
            Le saut qualitatif majeur du joueur amateur au joueur solide n&apos;est pas
            technique : il est cognitif. Il consiste à cesser de raisonner sur &laquo;
            quelle main a l&apos;adversaire &raquo; pour commencer à penser en{" "}
            <em>ensembles</em> — les ranges. Un chapitre sur la construction rigoureuse en
            combos, la taxonomie des ranges (polarisée, linéaire, condensée), et la lecture
            adverse street par street.
          </p>
          <Link
            href="/academie/ranges"
            className="inline-block border-b pb-1 hover:border-b-2"
            style={{ borderColor: INK, color: INK }}
          >
            Lire la suite →
          </Link>

          {/* Divider */}
          <div className="my-12 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: RULE }} />
            <div className="text-[10px] uppercase tracking-widest" style={{ color: MUTED }}>
              ⁂
            </div>
            <div className="flex-1 h-px" style={{ background: RULE }} />
          </div>

          {/* Secondary articles */}
          <div className="grid sm:grid-cols-2 gap-8">
            <SecondaryArticle
              kicker="Théorie"
              title="La théorie des jeux appliquée au poker"
              meta="50 min · Avancé"
              href="/academie/gto-fondamentaux"
              body="La GTO n'est pas synonyme de meilleur jeu. C'est un baseline défensif — inexploitable — à partir duquel on choisit d'exploiter ou non."
            />
            <SecondaryArticle
              kicker="Mathématiques"
              title="Ce qu'on utilise vraiment, au quotidien"
              meta="45 min · Débutant"
              href="/academie/mathematiques"
              body="Trois calculs suffisent à couvrir 90 % des situations : probabilités élémentaires, cotes du pot, espérance mathématique."
            />
          </div>
        </article>

        {/* Sidebar — chronique du jour + brèves */}
        <aside className="space-y-10">
          <section>
            <div
              className="text-xs uppercase tracking-widest mb-3 pb-2 border-b"
              style={{ color: ACCENT, borderColor: RULE, letterSpacing: "0.2em" }}
            >
              La chronique
            </div>
            <blockquote
              className="italic text-lg leading-relaxed pl-4 border-l-2"
              style={{ borderColor: ACCENT }}
            >
              &laquo; Un bon joueur perd 30 à 40 % de ses sessions même en jouant
              parfaitement. Ce qui distingue le pro, c&apos;est qu&apos;il évalue ses
              décisions sur leur EV, jamais sur leur résultat. &raquo;
            </blockquote>
            <div className="text-xs mt-3 not-italic" style={{ color: MUTED }}>
              — Extrait du dossier &laquo; Mental & bankroll &raquo;
            </div>
          </section>

          <section>
            <div
              className="text-xs uppercase tracking-widest mb-3 pb-2 border-b"
              style={{ color: ACCENT, borderColor: RULE, letterSpacing: "0.2em" }}
            >
              À l&apos;affiche
            </div>
            <ul className="space-y-3 text-sm">
              <MiniItem href="/charts" title="18 ranges GTO" meta="Consultation" />
              <MiniItem href="/trainer" title="Trainer — trois modes" meta="Aléatoire, ciblé, erreurs" />
              <MiniItem href="/hh" title="Analyse d'une main" meta="PokerStars, Winamax" />
              <MiniItem href="/stats" title="Ta progression" meta="Heatmap, streak, spots" />
            </ul>
          </section>

          <section>
            <div
              className="text-xs uppercase tracking-widest mb-3 pb-2 border-b"
              style={{ color: ACCENT, borderColor: RULE, letterSpacing: "0.2em" }}
            >
              Le chiffre
            </div>
            <div
              className="text-7xl leading-none"
              style={{ fontWeight: 900, letterSpacing: "-0.03em" }}
            >
              1 326
            </div>
            <div className="text-sm mt-2 leading-relaxed" style={{ color: MUTED }}>
              combinaisons de deux cartes possibles au Texas Hold&apos;em. Réduites à{" "}
              <strong>169 mains</strong> stratégiquement distinctes.
            </div>
          </section>
        </aside>
      </main>

      {/* Footer / colophon */}
      <footer
        style={{ borderColor: RULE }}
        className="border-t"
      >
        <div className="max-w-6xl mx-auto px-6 py-8 text-xs" style={{ color: MUTED }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="italic">
              Publication locale. Aucune donnée transmise. Tirage limité à un navigateur.
            </div>
            <div className="uppercase tracking-widest">
              Colophon · Nº 001
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function SecondaryArticle({
  kicker,
  title,
  meta,
  body,
  href,
}: {
  kicker: string
  title: string
  meta: string
  body: string
  href: string
}) {
  return (
    <div>
      <div
        className="text-xs uppercase tracking-widest mb-2"
        style={{ color: ACCENT, letterSpacing: "0.2em" }}
      >
        {kicker}
      </div>
      <Link href={href}>
        <h3
          className="text-2xl mb-2 leading-tight hover:underline"
          style={{ fontWeight: 800, letterSpacing: "-0.01em" }}
        >
          {title}
        </h3>
      </Link>
      <div className="italic text-xs mb-2" style={{ color: MUTED }}>
        {meta}
      </div>
      <p className="text-sm leading-relaxed">{body}</p>
    </div>
  )
}

function MiniItem({ href, title, meta }: { href: string; title: string; meta: string }) {
  return (
    <li>
      <Link href={href} className="hover:underline">
        <div style={{ fontWeight: 700 }}>{title}</div>
        <div className="text-xs italic" style={{ color: MUTED }}>
          {meta}
        </div>
      </Link>
    </li>
  )
}
