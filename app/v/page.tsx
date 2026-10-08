import Link from "next/link"

const VARIANTS = [
  {
    slug: "felt",
    name: "A — Feutre de table",
    desc: "Vert sombre de feutre, jetons stylisés, cartes de jeu comme motifs. Vibe salle de poker classique, mais moderne. Doré chaud pour accent.",
  },
  {
    slug: "roomtraining",
    name: "B — Card Room Training (Run It Once)",
    desc: "Dark navy, accent rouge coeurs/diams + vert piques/trèfles. Rangée d'infos denses en haut, cours en cartes. Vibe école de poker moderne.",
  },
  {
    slug: "vintage",
    name: "C — Vintage playing cards",
    desc: "Palette cartes anciennes : bordeaux, crème, doré. Ornements art-déco discrets. Vibe jeu de cartes premium, sans être cliché casino.",
  },
  {
    slug: "tournoi",
    name: "D — Tournoi sérieux",
    desc: "Noir + chip counts géants, ambiance final table. Typographie grasse, gros chiffres, timers. Vibe WSOP / pro.",
  },
]

export default function VariantsIndex() {
  return (
    <main className="min-h-screen bg-[color:var(--bg)] px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-xs uppercase tracking-widest text-[color:var(--text-muted)] mb-3">
          Prototypes v4 · retour au poker
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
          Quatre pistes vraiment poker
        </h1>
        <p className="text-[color:var(--text-secondary)] mb-10 leading-relaxed">
          Fini le newspaper/boutique. Chaque piste garde l&apos;ADN d&apos;une app de poker :
          jetons, cartes, table, suits. Cohérente sur toute l&apos;app une fois choisie.
        </p>

        <div className="space-y-3">
          {VARIANTS.map((v) => (
            <Link
              key={v.slug}
              href={`/v/${v.slug}`}
              className="block p-5 rounded-lg border hover:border-[color:var(--accent)] bg-[color:var(--surface)] transition-colors group"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-lg font-semibold text-[color:var(--text-primary)]">
                  {v.name}
                </div>
                <div className="text-[color:var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
              <div className="text-sm text-[color:var(--text-secondary)]">{v.desc}</div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-xs text-[color:var(--text-muted)]">
          <Link href="/" className="hover:text-[color:var(--accent)]">
            ← Version courante
          </Link>
        </div>
      </div>
    </main>
  )
}
