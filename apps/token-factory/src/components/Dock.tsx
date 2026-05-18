import { Crate } from './Crate'
import { Lorry } from './Lorry'
import { Token } from './Token'

// Scene 1 — The Goods Terminal.
// Lorry with Figma logo parked at the dock. Behind the dock: five
// conveyor belts going deeper into the factory, each a different lane.
// Worker reads the crate's label and sorts it onto the Color Scheme belt.
//
// Beat mapping:
//   0 — Lorry parked, terminal sign visible, belts dim. Worker idle.
//   1 — Terminal sign "EDS-TOKENS-SYNC" pulses (highlight).
//   2 — Crate appears on lorry's cargo bed with "color scheme" label.
//   3 — Belts highlighted: Color Scheme bright, others very dim.
//   4 — Crate animates from lorry onto Color Scheme belt and scrolls right.

const LANES = [
  { id: 'color-scheme', label: 'color scheme', colorVar: '--pico-dark-purple' },
  { id: 'semantic', label: 'semantic', colorVar: '--pico-dark-green' },
  { id: 'appearance', label: 'appearance', colorVar: '--pico-orange' },
  { id: 'spacing', label: 'spacing', colorVar: '--pico-light-gray' },
  { id: 'typography', label: 'typography', colorVar: '--pico-light-gray' },
]

export function Dock({ activeBeatIdx }: { activeBeatIdx: number }) {
  const showCrate = activeBeatIdx >= 2
  const beltsHighlighted = activeBeatIdx >= 3
  const crateMoving = activeBeatIdx >= 4

  return (
    <div className="dock-scene">
      {/* terminal sign */}
      <div
        className={`terminal-sign ${activeBeatIdx === 1 ? 'is-pulsing' : ''}`}
      >
        <span>★ EDS-TOKENS-SYNC TERMINAL ★</span>
      </div>

      {/* lorry parking spot (left half) */}
      <div className="lorry-spot">
        <Lorry />
        {showCrate && !crateMoving && (
          <div className="crate-on-lorry">
            <Crate />
            <div className="crate-label">color scheme</div>
          </div>
        )}
        <div className="dock-ramp" />
      </div>

      {/* worker (between lorry and belts) */}
      <div className="dock-worker">
        <Token />
      </div>

      {/* five conveyor belts going into the factory (right half) */}
      <div className={`belt-stack ${beltsHighlighted ? 'is-highlighted' : ''}`}>
        {LANES.map((lane) => (
          <div
            key={lane.id}
            className={`belt-rail belt-${lane.id} ${
              lane.id === 'color-scheme' ? 'belt-active' : 'belt-sibling'
            }`}
          >
            <span
              className="belt-swatch"
              style={{ background: `var(${lane.colorVar})` }}
            />
            <span className="belt-label">{lane.label}</span>
            <span className="belt-arrow">→</span>
          </div>
        ))}
      </div>

      {/* the crate's animated transit from lorry to Color Scheme belt */}
      {crateMoving && (
        <div className="crate-in-transit">
          <Crate />
        </div>
      )}
    </div>
  )
}
