import './gaugeRack.css'

// The modular type scale as a rack of milled gauge blocks. Each block's
// height is proportional to 2^(n/5) — the geometric progression EDS font
// sizes follow (xs..6xl). Reused by The Master Gauge (H.3) and The
// Density Dial (H.6); the latter passes a `scale` < 1 to show the whole
// rack re-milling smaller when density drops.

type Size = { key: string; h: number }

// Heights in logical px ≈ 20 · 2^(n/5), n = -3..6, rounded for crisp
// pixels. The ladder is the point; exact px are presentation values.
const SIZES: Size[] = [
  { key: 'xs', h: 13 },
  { key: 'sm', h: 15 },
  { key: 'md', h: 17 },
  { key: 'lg', h: 20 },
  { key: 'xl', h: 23 },
  { key: '2xl', h: 26 },
  { key: '3xl', h: 30 },
  { key: '4xl', h: 35 },
  { key: '5xl', h: 40 },
  { key: '6xl', h: 46 },
]

type Props = {
  /** Size key to highlight (e.g. 'md' for the protagonist). */
  highlight?: string
  /** Trigger the staggered mill-out reveal animation. */
  animate?: boolean
  /** Multiply every block height — used by the density dial. */
  scale?: number
}

export function GaugeRack({ highlight, animate = false, scale = 1 }: Props) {
  return (
    <div className={`gauge-rack ${animate ? 'is-milling' : ''}`}>
      {SIZES.map((s, i) => (
        <div
          key={s.key}
          className={`gauge-bar ${highlight === s.key ? 'is-highlight' : ''}`}
          style={{
            height: `calc(${(s.h * scale).toFixed(1)} * var(--px))`,
            animationDelay: animate ? `${i * 70}ms` : undefined,
          }}
        >
          <span className="gauge-bar-label">{s.key}</span>
        </div>
      ))}
    </div>
  )
}
