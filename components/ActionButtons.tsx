import type { Action } from "@/types"

interface Props {
  disabled?: boolean
  onAction: (action: Action) => void
}

const BUTTONS: { action: Action; label: string; sub: string; symbol: string; color: string }[] = [
  {
    action: "fold",
    label: "Fold",
    sub: "F",
    symbol: "×",
    color: "var(--heart-red)",
  },
  {
    action: "call",
    label: "Call",
    sub: "C",
    symbol: "=",
    color: "#7fa8ce",
  },
  {
    action: "raise",
    label: "Raise",
    sub: "R",
    symbol: "↑",
    color: "#7ec49b",
  },
]

export default function ActionButtons({ disabled, onAction }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {BUTTONS.map((b) => (
        <button
          key={b.action}
          disabled={disabled}
          onClick={() => onAction(b.action)}
          className={`group relative min-h-16 sm:min-h-20 transition ${
            disabled ? "opacity-40 cursor-not-allowed" : "active:translate-y-px"
          }`}
          style={{
            background: "transparent",
            border: `1px solid ${b.color}`,
            color: b.color,
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl leading-none opacity-80">{b.symbol}</span>
            <span className="text-base sm:text-lg font-medium tracking-wide uppercase">
              {b.label}
            </span>
          </div>
          <div
            className="absolute bottom-1.5 right-2 text-[9px] uppercase tracking-widest opacity-60"
            style={{ fontFamily: "SF Mono, monospace" }}
          >
            {b.sub}
          </div>
        </button>
      ))}
    </div>
  )
}
