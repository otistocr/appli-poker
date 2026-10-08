"use client"

import { useEffect, useState } from "react"

type Theme = "light" | "dark"

const STORAGE_KEY = "appli_poker_theme"

function applyThemeClass(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle("light", theme === "light")
}

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      (window.localStorage.getItem(STORAGE_KEY) as Theme | null)) as Theme | null
    const initial: Theme = stored === "light" ? "light" : "dark"
    setTheme(initial)
    applyThemeClass(initial)
    setReady(true)
  }, [])

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark"
    setTheme(next)
    applyThemeClass(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }

  if (!ready) return <div className={compact ? "w-8 h-8" : "w-20 h-8"} aria-hidden />

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-900 hover:border-amber-500 hover:bg-neutral-800 transition text-xs font-medium ${
        compact ? "w-8 h-8 justify-center" : "px-3 py-1.5"
      }`}
      title={theme === "dark" ? "Passer en mode jour" : "Passer en mode nuit"}
      aria-label={theme === "dark" ? "Passer en mode jour" : "Passer en mode nuit"}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      {!compact && <span>{theme === "dark" ? "Jour" : "Nuit"}</span>}
    </button>
  )
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
