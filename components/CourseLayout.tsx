import Link from "next/link"
import type { CourseMeta } from "@/lib/courses/manifest"
import type { ReactNode } from "react"
import FeltHeader from "@/components/FeltHeader"

interface Props {
  meta: CourseMeta
  toc: { id: string; title: string }[]
  children: ReactNode
}

export default function CourseLayout({ meta, toc, children }: Props) {
  const chapterNum = extractChapterNumber(meta.title)
  return (
    <main className="min-h-screen">
      <FeltHeader current={`Ch. ${chapterNum}`} suit="♦" />

      <div className="max-w-4xl mx-auto px-6 py-10 sm:py-14">
        <nav className="mb-10 text-xs">
          <Link
            href="/academie"
            style={{ color: "var(--text-muted)" }}
            className="hover:opacity-80"
          >
            ← Retour à l&apos;académie
          </Link>
        </nav>

        <div className="grid lg:grid-cols-[1fr_180px] gap-16">
          <article>
            <header className="mb-14">
              <div
                className="text-xs uppercase tracking-widest mb-4 flex items-center gap-3"
                style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
              >
                <span style={{ color: "var(--accent)" }}>Chapitre {chapterNum}</span>
                <span>·</span>
                <span>{meta.level}</span>
                <span>·</span>
                <span>{meta.duration_min} min</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1] text-balance mb-4">
                {stripLeadingNumber(meta.title)}
              </h1>
              <p
                className="text-lg leading-relaxed max-w-xl"
                style={{ color: "var(--text-secondary)" }}
              >
                {meta.subtitle}
              </p>
            </header>

            <div className="text-[16px] leading-[1.8]">{children}</div>
          </article>

          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <div
                  className="text-[10px] uppercase tracking-widest mb-3"
                  style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
                >
                  Au fil du chapitre
                </div>
                <ol className="space-y-2 text-sm">
                  {toc.map((item, idx) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="flex gap-3 hover:text-[color:var(--accent)] transition-colors"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span
                          className="tabular-nums text-xs pt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 leading-snug">{item.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          )}
        </div>
      </div>
    </main>
  )
}

function stripLeadingNumber(title: string): string {
  return title.replace(/^\d+\.\s*/, "")
}

function extractChapterNumber(title: string): string {
  const match = title.match(/^(\d+)\./)
  if (!match) return "?"
  const n = parseInt(match[1], 10)
  const roman = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n] ?? String(n)
  return roman
}

/* ============================================================
   Editorial components — clean, book-like, no boxes
   ============================================================ */

export function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} className="mb-20 scroll-mt-24">
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-6 h-px"
          style={{ background: "var(--accent)" }}
        />
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight">
          {title}
        </h2>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  )
}

export function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-10 mb-4">
      <h3
        className="text-[13px] uppercase tracking-widest mb-3 font-semibold"
        style={{ color: "var(--text-primary)", letterSpacing: "0.15em" }}
      >
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

/* Formula — centrée, sérif, discrète */
export function Formula({ children }: { children: ReactNode }) {
  return (
    <div
      className="my-8 py-2 text-center text-lg decorative italic"
      style={{ color: "var(--accent)" }}
    >
      {children}
    </div>
  )
}

/* Example — introduit par un simple label italique, texte flowing */
export function Example({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="my-6">
      <p
        className="italic text-sm mb-2"
        style={{ color: "var(--text-muted)" }}
      >
        Exemple{title ? ` — ${title}` : ""}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

/* KeyIdea — juste un texte en gras avec un petit trait au-dessus, sobre */
export function KeyIdea({ children }: { children: ReactNode }) {
  return (
    <div className="my-10">
      <div
        className="w-8 h-px mb-4"
        style={{ background: "var(--accent)" }}
      />
      <div
        className="text-lg leading-relaxed font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        {children}
      </div>
    </div>
  )
}

/* Definition — terme en gras normal, tiret gris, définition inline */
export function Definition({ term, children }: { term: string; children: ReactNode }) {
  return (
    <p className="my-4">
      <strong style={{ color: "var(--text-primary)", fontWeight: 700 }}>
        {term}
      </strong>
      <span style={{ color: "var(--text-muted)" }}> — </span>
      <span>{children}</span>
    </p>
  )
}
