"use client"

import Link from "next/link"

export default function TerminalVariant() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text-primary)] font-mono">
      {/* Top status bar */}
      <header
        className="border-b h-9 flex items-center px-3 text-[11px] gap-4 tabular-nums"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[color:var(--accent)] rounded-sm flex items-center justify-center text-white text-[9px] font-bold">
            AP
          </div>
          <span className="font-semibold">appli poker</span>
          <span className="text-[color:var(--text-muted)]">v1.0.0</span>
        </div>
        <div className="flex-1 flex items-center gap-4 justify-end text-[color:var(--text-muted)]">
          <span>
            CHARTS <span className="text-[color:var(--accent)]">18</span>
          </span>
          <span>
            COURSES <span className="text-[color:var(--accent)]">10</span>
          </span>
          <span>
            ACC <span className="text-[#6cb98d]">74.2%</span>
          </span>
          <span>
            STREAK <span className="text-[#6cb98d]">8</span>
          </span>
          <span>
            LVL <span className="text-[color:var(--accent)]">SILVER</span>
          </span>
        </div>
      </header>

      {/* Cmd bar */}
      <div
        className="h-8 border-b flex items-center px-3 text-[11px] gap-3 text-[color:var(--text-muted)]"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="text-[color:var(--accent)]">›</span>
        <span>appli-poker@main</span>
        <span>~</span>
        <span className="text-[color:var(--text-secondary)]">
          Cmd+K to jump · Cmd+/ for help
        </span>
        <Link
          href="/v"
          className="ml-auto hover:text-[color:var(--accent)]"
        >
          [ ← autres variantes ]
        </Link>
      </div>

      {/* Grid layout : 3 panels */}
      <div className="grid grid-cols-[280px_1fr_240px] gap-px bg-[color:var(--border)] h-[calc(100vh-68px)]">
        {/* Left panel : Modules */}
        <div className="bg-[color:var(--bg)] p-3 overflow-y-auto">
          <PanelHeader label="MODULES" count="05" />
          <ul className="text-xs space-y-px">
            <ModuleItem href="/charts" code="01" name="charts" stat="18r" />
            <ModuleItem href="/trainer" code="02" name="trainer" stat="live" active />
            <ModuleItem href="/academie" code="03" name="academie" stat="10c" />
            <ModuleItem href="/hh" code="04" name="hand_history" stat="ps/wnx" />
            <ModuleItem href="/stats" code="05" name="stats" stat="local" />
          </ul>

          <div className="mt-6">
            <PanelHeader label="RECENT" count="03" />
            <ul className="text-xs space-y-1 text-[color:var(--text-secondary)]">
              <li>› /academie/ranges</li>
              <li>› /trainer</li>
              <li>› /charts BTN vs_open</li>
            </ul>
          </div>
        </div>

        {/* Center panel : main content */}
        <div className="bg-[color:var(--bg)] p-4 overflow-y-auto">
          <PanelHeader label="OVERVIEW" count="" />
          <div className="grid grid-cols-4 gap-2 mb-4">
            <Stat label="RANGES" val="18" delta="+0" />
            <Stat label="HANDS" val="342" delta="+42" />
            <Stat label="ACC" val="74.2%" delta="+2.1" positive />
            <Stat label="STREAK" val="8" delta="🔥" positive />
          </div>

          <PanelHeader label="MODULE_STATUS" count="" />
          <div className="text-xs">
            <TableHeader />
            <Row code="01" name="CHARTS" desc="RFI / vsO / vs3 / vs4 · 7 pos" status="OK" />
            <Row code="02" name="TRAINER" desc="3 modes · adaptive weights" status="OK" />
            <Row code="03" name="ACADEMIE" desc="10 cours · 400+ pages" status="OK" />
            <Row code="04" name="HH" desc="PokerStars / Winamax parser" status="OK" />
            <Row code="05" name="STATS" desc="heatmap · 30d chart · spots" status="OK" />
          </div>

          <PanelHeader label="LAST_ACTIONS" count="" />
          <div className="text-[11px] text-[color:var(--text-secondary)] space-y-0.5">
            <div>
              [19:04] <span className="text-[#6cb98d]">✓</span> drill CO_RFI:AKs → raise
            </div>
            <div>
              [19:04] <span className="text-red-400">✗</span> drill BTN_RFI:87s → call (expected raise)
            </div>
            <div>
              [19:03] <span className="text-[#6cb98d]">✓</span> drill BB_vs_open_UTG:QQ → raise
            </div>
          </div>
        </div>

        {/* Right panel : inspector */}
        <div className="bg-[color:var(--bg)] p-3 overflow-y-auto">
          <PanelHeader label="INSPECTOR" count="" />
          <div className="text-xs space-y-2 text-[color:var(--text-secondary)]">
            <div>
              <div className="text-[color:var(--text-muted)]">spot</div>
              <div className="text-[color:var(--text-primary)]">CO / 100bb / RFI</div>
            </div>
            <div>
              <div className="text-[color:var(--text-muted)]">hand</div>
              <div className="text-[color:var(--accent)]">A5s</div>
            </div>
            <div>
              <div className="text-[color:var(--text-muted)]">gto</div>
              <div>R 70% / F 30%</div>
            </div>
            <div>
              <div className="text-[color:var(--text-muted)]">combos</div>
              <div>27 in raise range</div>
            </div>
          </div>

          <div className="mt-6">
            <PanelHeader label="SHORTCUTS" count="" />
            <div className="text-[11px] space-y-0.5 text-[color:var(--text-secondary)]">
              <Shortcut k="⌘K" v="palette" />
              <Shortcut k="F" v="fold" />
              <Shortcut k="C" v="call" />
              <Shortcut k="R" v="raise" />
              <Shortcut k="?" v="help" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PanelHeader({ label, count }: { label: string; count: string }) {
  return (
    <div className="text-[10px] text-[color:var(--text-muted)] mb-2 flex items-center gap-2">
      <span>{label}</span>
      {count && <span>[{count}]</span>}
      <div className="flex-1 h-px bg-[color:var(--border)]" />
    </div>
  )
}

function ModuleItem({
  href,
  code,
  name,
  stat,
  active,
}: {
  href: string
  code: string
  name: string
  stat: string
  active?: boolean
}) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-2 px-1.5 py-1 rounded ${
          active
            ? "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
            : "text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-2)]"
        }`}
      >
        <span className="text-[color:var(--text-muted)] w-6 tabular-nums">{code}</span>
        <span className="flex-1">{name}</span>
        <span className="text-[10px] text-[color:var(--text-muted)]">{stat}</span>
      </Link>
    </li>
  )
}

function Stat({
  label,
  val,
  delta,
  positive,
}: {
  label: string
  val: string
  delta?: string
  positive?: boolean
}) {
  return (
    <div className="border p-2" style={{ borderColor: "var(--border)" }}>
      <div className="text-[10px] text-[color:var(--text-muted)]">{label}</div>
      <div className="text-lg tabular-nums">{val}</div>
      {delta && (
        <div
          className={`text-[10px] ${
            positive ? "text-[#6cb98d]" : "text-[color:var(--text-muted)]"
          }`}
        >
          {delta}
        </div>
      )}
    </div>
  )
}

function TableHeader() {
  return (
    <div
      className="grid grid-cols-[36px_100px_1fr_60px] gap-2 py-1 text-[10px] text-[color:var(--text-muted)] border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <div>ID</div>
      <div>NAME</div>
      <div>DESC</div>
      <div>STATUS</div>
    </div>
  )
}

function Row({
  code,
  name,
  desc,
  status,
}: {
  code: string
  name: string
  desc: string
  status: string
}) {
  return (
    <div
      className="grid grid-cols-[36px_100px_1fr_60px] gap-2 py-1 border-b text-[11px]"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="tabular-nums text-[color:var(--text-muted)]">{code}</div>
      <div>{name}</div>
      <div className="text-[color:var(--text-secondary)] truncate">{desc}</div>
      <div className="text-[#6cb98d]">{status}</div>
    </div>
  )
}

function Shortcut({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="border px-1 min-w-[24px] text-center text-[color:var(--text-primary)]"
        style={{ borderColor: "var(--border)" }}
      >
        {k}
      </span>
      <span>{v}</span>
    </div>
  )
}
