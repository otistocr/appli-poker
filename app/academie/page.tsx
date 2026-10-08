import Link from "next/link"
import { COURSES } from "@/lib/courses/manifest"
import FeltHeader from "@/components/FeltHeader"

export default function AcademiePage() {
  return (
    <main className="min-h-screen">
      <FeltHeader current="Académie" suit="♦" />

      <div className="max-w-4xl mx-auto px-6 py-10 sm:py-14">
        <header className="mb-10">
          <div
            className="flex items-center gap-3 text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--accent)" }}
          >
            <span className="text-lg">♦</span>
            <span>Académie</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Dix chapitres, dans un ordre qui a du sens
          </h1>
          <p
            className="text-sm max-w-2xl leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Des mathématiques du préflop au mental game. Chaque cours propose des définitions
            rigoureuses, des formules démontrées et des exemples chiffrés. Environ sept heures
            de lecture au total.
          </p>
        </header>

        {/* Column headers */}
        <div
          className="grid grid-cols-[36px_1fr_100px_60px_20px] gap-4 py-2 border-b text-[10px] uppercase tracking-widest"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-muted)",
          }}
        >
          <div>N°</div>
          <div>Titre</div>
          <div>Niveau</div>
          <div className="text-right">Durée</div>
          <div></div>
        </div>

        {/* Course rows */}
        <ol>
          {COURSES.map((course, idx) => (
            <CourseRow key={course.slug} course={course} idx={idx} />
          ))}
        </ol>
      </div>
    </main>
  )
}

function CourseRow({
  course,
  idx,
}: {
  course: (typeof COURSES)[number]
  idx: number
}) {
  const levelColor =
    course.level === "Débutant"
      ? "var(--heart-red)"
      : course.level === "Intermédiaire"
        ? "var(--accent)"
        : "#b591b0"

  const inner = (
    <div
      className="grid grid-cols-[36px_1fr_100px_60px_20px] gap-4 py-4 border-b items-baseline"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="text-xs decorative tabular-nums"
        style={{ color: "var(--text-muted)" }}
      >
        {String(idx + 1).padStart(2, "0")}
      </div>
      <div className="min-w-0">
        <div
          className="text-base font-medium"
          style={{
            color: course.available ? "var(--text-primary)" : "var(--text-muted)",
          }}
        >
          {stripLeadingNumber(course.title)}
        </div>
        <div
          className="text-xs mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {course.subtitle}
        </div>
      </div>
      <div
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: levelColor }}
      >
        {course.level}
      </div>
      <div
        className="text-xs text-right tabular-nums"
        style={{ color: "var(--text-secondary)" }}
      >
        {course.duration_min} min
      </div>
      <div className="text-right">
        {course.available ? (
          <span style={{ color: "var(--accent)" }}>→</span>
        ) : (
          <span
            className="text-[10px]"
            style={{ color: "var(--text-muted)" }}
          >
            —
          </span>
        )}
      </div>
    </div>
  )

  if (course.available) {
    return (
      <li>
        <Link
          href={`/academie/${course.slug}`}
          className="block group hover:bg-[color:var(--surface)] px-2 -mx-2 transition-colors"
        >
          {inner}
        </Link>
      </li>
    )
  }
  return <li className="opacity-50">{inner}</li>
}

function stripLeadingNumber(title: string): string {
  return title.replace(/^\d+\.\s*/, "")
}
