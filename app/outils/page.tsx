"use client"

import { useMemo, useState } from "react"
import FeltHeader from "@/components/FeltHeader"
import {
  potOdds,
  mdf,
  valueBluff,
  countCombos,
  estimateEquity,
} from "@/lib/tools/calc"

type Tool = "potodds" | "mdf" | "valuebluff" | "combos" | "equity"

const TOOLS: { value: Tool; label: string; suit: string }[] = [
  { value: "potodds", label: "Pot odds", suit: "♠" },
  { value: "mdf", label: "MDF", suit: "♥" },
  { value: "valuebluff", label: "Value/Bluff", suit: "♦" },
  { value: "combos", label: "Combos", suit: "♣" },
  { value: "equity", label: "Equity", suit: "♠" },
]

export default function OutilsPage() {
  const [tool, setTool] = useState<Tool>("potodds")

  return (
    <main className="min-h-screen">
      <FeltHeader current="Outils" suit="♦" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <header>
          <div
            className="flex items-center gap-3 text-xs uppercase tracking-widest mb-2"
            style={{ color: "var(--accent)" }}
          >
            <span className="text-lg">♦</span>
            <span>Outils</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Calculateurs
          </h1>
          <p
            className="text-sm mt-2 max-w-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            Cinq calculs qu&apos;on utilise vraiment à la table. Ouvre l&apos;outil dont tu
            as besoin, tape tes chiffres, lis la sortie.
          </p>
        </header>

        {/* Tool selector */}
        <nav className="flex flex-wrap gap-2">
          {TOOLS.map((t) => {
            const isCurrent = tool === t.value
            return (
              <button
                key={t.value}
                onClick={() => setTool(t.value)}
                className="px-3 py-2 text-xs font-medium border transition-colors flex items-center gap-2"
                style={{
                  background: isCurrent ? "var(--accent)" : "transparent",
                  color: isCurrent ? "var(--bg-deep)" : "var(--text-secondary)",
                  borderColor: isCurrent ? "var(--accent)" : "var(--border)",
                }}
              >
                <span>{t.suit}</span>
                <span>{t.label}</span>
              </button>
            )
          })}
        </nav>

        <div
          className="border p-5 sm:p-6"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          {tool === "potodds" && <PotOddsTool />}
          {tool === "mdf" && <MDFTool />}
          {tool === "valuebluff" && <ValueBluffTool />}
          {tool === "combos" && <ComboTool />}
          {tool === "equity" && <EquityTool />}
        </div>
      </div>
    </main>
  )
}

/* ============================================================
   Pot Odds
   ============================================================ */
function PotOddsTool() {
  const [pot, setPot] = useState("100")
  const [bet, setBet] = useState("50")

  const result = useMemo(() => {
    const p = parseFloat(pot)
    const b = parseFloat(bet)
    if (isNaN(p) || isNaN(b) || p < 0 || b <= 0) return null
    return potOdds(p, b, b)
  }, [pot, bet])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-1">Pot odds</h2>
        <p
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Quelle equity minimum dont tu as besoin pour rendre un call rentable.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumInput label="Pot avant sa mise" value={pot} onChange={setPot} suffix="$" />
        <NumInput label="Sa mise" value={bet} onChange={setBet} suffix="$" />
      </div>

      {result ? (
        <div className="space-y-2 pt-2">
          <Result label="Equity minimum requise" value={`${result.equityMin.toFixed(1)}%`} big />
          <Result label="Ratio" value={`${result.ratio.toFixed(1)}:1`} />
          <Result label="Pot après ton call" value={`${result.potAfterCall.toFixed(0)}$`} />
        </div>
      ) : (
        <Warning>Entre des valeurs positives.</Warning>
      )}

      <Formula>
        equity_min = call / (pot + adv_bet + call)
      </Formula>
    </div>
  )
}

/* ============================================================
   MDF
   ============================================================ */
function MDFTool() {
  const [pot, setPot] = useState("100")
  const [bet, setBet] = useState("66")

  const result = useMemo(() => {
    const p = parseFloat(pot)
    const b = parseFloat(bet)
    if (isNaN(p) || isNaN(b) || p <= 0 || b <= 0) return null
    return mdf(p, b)
  }, [pot, bet])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-1">MDF (Minimum Defense Frequency)</h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Fréquence minimale à laquelle tu dois défendre pour empêcher un bluff auto-profitable.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumInput label="Pot avant sa mise" value={pot} onChange={setPot} suffix="$" />
        <NumInput label="Sa mise" value={bet} onChange={setBet} suffix="$" />
      </div>

      {result ? (
        <div className="space-y-2 pt-2">
          <Result label="MDF" value={`${result.mdf.toFixed(1)}%`} big />
          <Result label="Alpha (fréq bluff auto-profitable)" value={`${result.alpha.toFixed(1)}%`} />
        </div>
      ) : (
        <Warning>Entre des valeurs positives.</Warning>
      )}

      <Formula>MDF = pot / (pot + bet)</Formula>
      <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>
        La MDF est un floor défensif. Face à un joueur qui ne bluff jamais, tu peux fold
        en-dessous sans être exploité.
      </p>
    </div>
  )
}

/* ============================================================
   Value / Bluff
   ============================================================ */
function ValueBluffTool() {
  const [pot, setPot] = useState("100")
  const [bet, setBet] = useState("100")

  const result = useMemo(() => {
    const p = parseFloat(pot)
    const b = parseFloat(bet)
    if (isNaN(p) || isNaN(b) || p <= 0 || b <= 0) return null
    return valueBluff(p, b)
  }, [pot, bet])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-1">Ratio value / bluff</h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Le ratio value/bluff optimal pour ta range de bet à la river, selon le sizing.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumInput label="Pot" value={pot} onChange={setPot} suffix="$" />
        <NumInput label="Ta mise" value={bet} onChange={setBet} suffix="$" />
      </div>

      {result ? (
        <div className="space-y-2 pt-2">
          <Result
            label="% value"
            value={`${result.valuePct.toFixed(1)}%`}
            big
          />
          <Result label="% bluff" value={`${result.bluffPct.toFixed(1)}%`} />
          <Result label="Ratio value:bluff" value={`${result.ratio.toFixed(1)}:1`} />
        </div>
      ) : (
        <Warning>Entre des valeurs positives.</Warning>
      )}

      <Formula>bluff% = bet / (pot + 2 × bet)</Formula>
      <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>
        Plus tu bets gros, plus tu bluff (ratio se rapproche de 1:1). C&apos;est ce que le
        solveur applique pour être unexploitable.
      </p>
    </div>
  )
}

/* ============================================================
   Combo Counter
   ============================================================ */
function ComboTool() {
  const [range, setRange] = useState("QQ+, AKs, AKo, AJs+")
  const result = useMemo(() => countCombos(range), [range])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-1">Compteur de combos</h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Compte le nombre de combos dans une range. Supporte la notation courte (JJ+, AKs+,
          76s-54s).
        </p>
      </div>

      <div>
        <label
          className="text-[10px] uppercase tracking-widest block mb-1"
          style={{ color: "var(--text-muted)" }}
        >
          Ta range
        </label>
        <textarea
          value={range}
          onChange={(e) => setRange(e.target.value)}
          rows={2}
          className="w-full p-3 font-mono text-sm border"
          style={{ borderColor: "var(--border)" }}
        />
      </div>

      <div className="space-y-2 pt-2">
        <Result label="Combos totaux" value={String(result.total)} big />
        <Result
          label="Ratio du deck préflop"
          value={`${((result.total / 1326) * 100).toFixed(2)}%`}
        />
      </div>

      {result.breakdown.length > 0 && (
        <div>
          <div
            className="text-[10px] uppercase tracking-widest mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Détail
          </div>
          <div
            className="flex flex-wrap gap-2 text-xs font-mono max-h-40 overflow-y-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            {result.breakdown.map((b) => (
              <span
                key={b.hand}
                className="px-2 py-0.5 border"
                style={{ borderColor: "var(--border)" }}
              >
                {b.hand} · {b.combos}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.invalid.length > 0 && (
        <Warning>
          Non reconnus : {result.invalid.join(", ")}
        </Warning>
      )}

      <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>
        Rappel : paires = 6 combos, suited = 4, offsuit = 12. Total du deck = 1 326 combos.
      </p>
    </div>
  )
}

/* ============================================================
   Equity Estimator
   ============================================================ */
function EquityTool() {
  const [hand1, setHand1] = useState("AA")
  const [hand2, setHand2] = useState("AKs")

  const equity1 = useMemo(() => estimateEquity(hand1, hand2), [hand1, hand2])
  const equity2 = equity1 !== null ? 100 - equity1 : null

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-1">Estimateur d&apos;equity</h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Approximation d&apos;equity heads-up entre deux mains préflop. Utilise une lookup
          table de matchups classiques, pas un vrai solveur — précision ±3%.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumInput label="Main 1" value={hand1} onChange={setHand1} placeholder="AA" isText />
        <NumInput label="Main 2" value={hand2} onChange={setHand2} placeholder="AKs" isText />
      </div>

      {equity1 !== null && equity2 !== null ? (
        <div className="space-y-2 pt-2">
          <div
            className="p-4 border"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-deep)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  {hand1}
                </div>
                <div
                  className="text-3xl font-semibold tabular-nums"
                  style={{ color: "var(--accent)" }}
                >
                  {equity1}%
                </div>
              </div>
              <div style={{ color: "var(--text-muted)" }} className="text-sm">
                vs
              </div>
              <div className="flex-1 text-right">
                <div
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  {hand2}
                </div>
                <div
                  className="text-3xl font-semibold tabular-nums"
                  style={{ color: "var(--text-primary)" }}
                >
                  {equity2}%
                </div>
              </div>
            </div>
            <div className="mt-3 h-2 flex overflow-hidden">
              <div
                style={{ width: `${equity1}%`, background: "var(--accent)" }}
              />
              <div
                style={{ width: `${equity2}%`, background: "var(--border-strong)" }}
              />
            </div>
          </div>
        </div>
      ) : (
        <Warning>
          Format attendu : &quot;AA&quot;, &quot;AKs&quot;, &quot;AKo&quot;, &quot;76s&quot;.
        </Warning>
      )}

      <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>
        Pour de la vraie précision, utilise PokerStove ou Equilab. Cet outil est fait pour
        se faire une idée à la table.
      </p>
    </div>
  )
}

/* ============================================================
   Shared UI bits
   ============================================================ */

function NumInput({
  label,
  value,
  onChange,
  suffix,
  placeholder,
  isText,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  suffix?: string
  placeholder?: string
  isText?: boolean
}) {
  return (
    <div>
      <label
        className="text-[10px] uppercase tracking-widest block mb-1"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={isText ? "text" : "number"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-2.5 text-base font-medium border tabular-nums"
          style={{ borderColor: "var(--border)" }}
        />
        {suffix && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

function Result({
  label,
  value,
  big,
}: {
  label: string
  value: string
  big?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between border-b py-2" style={{ borderColor: "var(--border)" }}>
      <div
        className="text-[10px] uppercase tracking-widest"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </div>
      <div
        className={`${big ? "text-2xl sm:text-3xl" : "text-lg"} font-semibold tabular-nums`}
        style={{ color: big ? "var(--accent)" : "var(--text-primary)" }}
      >
        {value}
      </div>
    </div>
  )
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="pl-4 py-1 font-mono text-sm border-l-2 mt-3"
      style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
    >
      {children}
    </div>
  )
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-sm p-3 border-l-2"
      style={{
        borderColor: "var(--heart-red)",
        color: "var(--text-secondary)",
        background: "rgba(212, 120, 98, 0.05)",
      }}
    >
      {children}
    </div>
  )
}
