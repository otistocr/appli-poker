"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

const LINKS = [
  { href: "/", suit: "♠", label: "Accueil" },
  { href: "/charts", suit: "♠", label: "Ranges" },
  { href: "/postflop", suit: "♣", label: "Postflop" },
  { href: "/academie", suit: "♦", label: "Académie" },
  { href: "/trainer", suit: "♥", label: "Pratique" },
  { href: "/outils", suit: "♦", label: "Outils" },
  { href: "/hh", suit: "♣", label: "Hand history" },
  { href: "/stats", suit: "♠", label: "Stats" },
]

/** Bouton ☰ et menu plein écran, visibles uniquement sur petit écran (le menu classique est masqué sous md). */
export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const path = usePathname()

  useEffect(() => setOpen(false), [path])
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        className="w-10 h-10 -mr-2 flex items-center justify-center text-xl"
        style={{ color: "var(--text-primary)" }}
      >
        {open ? "✕" : "☰"}
      </button>
      {open && mounted && createPortal(
        <nav
          className="fixed inset-x-0 bottom-0 top-[52px] z-50 overflow-y-auto p-4"
          style={{ background: "var(--bg-deep)" }}
        >
          {LINKS.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-3 px-3 py-3.5 border-b text-base"
                style={{
                  borderColor: "var(--border)",
                  color: active ? "var(--accent)" : "var(--text-primary)",
                }}
              >
                <span style={{ color: "var(--accent)" }}>{l.suit}</span>
                <span>{l.label}</span>
              </Link>
            )
          })}
        </nav>,
        document.body
      )}
    </div>
  )
}
