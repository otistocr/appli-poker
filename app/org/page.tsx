import Link from "next/link"

const OPTIONS = [
  { slug: "a", name: "A — Nav groupée en 3 catégories", desc: "Étudier / Jouer / S'entraîner en top nav" },
  { slug: "b", name: "B — Sidebar gauche", desc: "Navigation persistante à gauche façon Linear/Notion" },
  { slug: "c", name: "C — Workspace focused", desc: "Home comme espace de travail actif, nav discrète" },
]

export default function OrgIndex() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div
          className="text-xs uppercase tracking-widest mb-3"
          style={{ color: "var(--accent)", letterSpacing: "0.3em" }}
        >
          Prototypes d&apos;organisation
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          3 refontes de la structure
        </h1>
        <p className="mb-10" style={{ color: "var(--text-secondary)" }}>
          Chaque option applique une logique différente à la home + la nav. Ouvre les 3 pour comparer.
        </p>

        <div className="space-y-3">
          {OPTIONS.map((o) => (
            <Link
              key={o.slug}
              href={`/org/${o.slug}`}
              className="block p-5 border transition-colors group"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-lg font-semibold">{o.name}</div>
                <div
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--accent)" }}
                >
                  →
                </div>
              </div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {o.desc}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-xs">
          <Link href="/" style={{ color: "var(--text-muted)" }} className="hover:opacity-80">
            ← Version actuelle
          </Link>
        </div>
      </div>
    </main>
  )
}
