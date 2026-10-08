import Link from "next/link"

interface Props {
  current: string
  suit?: string
}

export default function FeltHeader({ current, suit = "♠" }: Props) {
  return (
    <header
      className="border-b sticky top-0 z-40 backdrop-blur"
      style={{
        borderColor: "var(--border)",
        background: "color-mix(in srgb, var(--bg-deep) 85%, transparent)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center border-2 text-[10px] font-black"
              style={{
                background: "var(--accent)",
                borderColor: "var(--text-primary)",
                color: "var(--bg-deep)",
              }}
            >
              ♠
            </div>
            <span className="font-bold">appli poker</span>
          </Link>
          <span style={{ color: "var(--text-muted)" }}>/</span>
          <span className="flex items-center gap-1.5" style={{ color: "var(--accent)" }}>
            <span>{suit}</span>
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>
              {current}
            </span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-xs uppercase tracking-widest">
          <NavLink href="/charts" label="Ranges" current={current === "Ranges"} />
          <NavLink href="/postflop" label="Postflop" current={current === "Postflop"} />
          <NavLink href="/academie" label="Académie" current={current === "Académie" || current.startsWith("Ch.")} />
          <NavLink href="/trainer" label="Pratique" current={current === "Pratique"} />
          <NavLink href="/outils" label="Outils" current={current === "Outils"} />
          <NavLink href="/hh" label="HH" current={current === "Hand history"} />
          <NavLink href="/stats" label="Stats" current={current === "Stats"} />
        </nav>
      </div>
    </header>
  )
}

function NavLink({ href, label, current }: { href: string; label: string; current: boolean }) {
  return (
    <Link
      href={href}
      style={{
        color: current ? "var(--accent)" : "var(--text-secondary)",
        borderBottom: current ? "1px solid var(--accent)" : "none",
      }}
      className="pb-0.5"
    >
      {label}
    </Link>
  )
}
