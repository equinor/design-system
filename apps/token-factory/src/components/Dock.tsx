import { useEffect, useState } from 'react'
import { Building } from './Building'
import { Crate } from './Crate'
import { Gate } from './Gate'
import { Lorry } from './Lorry'
import { Token } from './Token'

// Scene 1 — The Goods Terminal.
// One horizontal conveyor at the bottom carries our crate from the
// lorry past the worker (for inspection) and into the factory through
// a gate that slides open on approach.
//
// The 5 lane labels at the top-left are a *destination indicator* — they
// say which conceptual lane our crate is on, not five separate physical
// belts. The visible belt is the one we're following today.
//
// Beat mapping:
//   0 — Lorry parked, conveyor running, worker idle. No crate.
//   1 — Terminal sign pulses. No crate yet.
//   2 — Crate appears on the lorry side of the belt with "color scheme" label.
//   3 — Lane indicator brightens: Color Scheme bright, others very dim.
//   4 — Crate journey: slide → pause at worker → slide → gate opens →
//       crate enters building → gate closes.
//
// The journey is driven by a state machine; CSS positions the crate
// per-state with a smooth steps() transition so the team can read each
// stage.

type Journey =
  | 'idle'
  | 'sliding-1'
  | 'inspecting'
  | 'sliding-2'
  | 'entering'
  | 'inside'

const LANES = [
  { id: 'color-scheme', label: 'color scheme', colorVar: '--pico-dark-purple' },
  { id: 'semantic', label: 'semantic', colorVar: '--pico-dark-green' },
  { id: 'appearance', label: 'appearance', colorVar: '--pico-orange' },
  { id: 'spacing', label: 'spacing', colorVar: '--pico-light-gray' },
  { id: 'typography', label: 'typography', colorVar: '--pico-light-gray' },
]

export function Dock({ activeBeatIdx }: { activeBeatIdx: number }) {
  const [journey, setJourney] = useState<Journey>('idle')

  useEffect(() => {
    if (activeBeatIdx < 4) {
      setJourney('idle')
      return
    }
    // Beat 4 kicks off the journey
    setJourney('sliding-1')
    const t1 = window.setTimeout(() => setJourney('inspecting'), 1400)
    const t2 = window.setTimeout(() => setJourney('sliding-2'), 2400)
    const t3 = window.setTimeout(() => setJourney('entering'), 3600)
    const t4 = window.setTimeout(() => setJourney('inside'), 4400)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
      window.clearTimeout(t4)
    }
  }, [activeBeatIdx])

  const showCrateOnLorry = activeBeatIdx === 2 || activeBeatIdx === 3
  const showCrateInTransit = activeBeatIdx >= 4 && journey !== 'inside'
  const gateOpen = journey === 'entering' || journey === 'inside'

  return (
    <div className="dock-scene">
      {/* terminal sign */}
      <div
        className={`terminal-sign ${activeBeatIdx === 1 ? 'is-pulsing' : ''}`}
      >
        <span>★ EDS-TOKENS-SYNC TERMINAL ★</span>
      </div>

      {/* lane indicator (top-left) — destination labels, not parallel belts */}
      <div
        className={`lane-indicator ${activeBeatIdx >= 3 ? 'is-highlighted' : ''}`}
      >
        {LANES.map((lane) => (
          <div
            key={lane.id}
            className={`lane-row ${
              lane.id === 'color-scheme' ? 'lane-active' : 'lane-sibling'
            }`}
          >
            <span
              className="lane-swatch"
              style={{ background: `var(${lane.colorVar})` }}
            />
            <span className="lane-name">{lane.label}</span>
            <span className="lane-arrow">→</span>
          </div>
        ))}
      </div>

      {/* factory building on the right */}
      <div className="factory-building">
        <Building />
        <div className="gate-frame">
          <Gate open={gateOpen} />
        </div>
      </div>

      {/* lorry at the start of the belt */}
      <div className="lorry-spot">
        <Lorry />
      </div>

      {/* the worker standing on the conveyor */}
      <div className="dock-worker">
        <Token />
      </div>

      {/* the conveyor belt running the full width of the stage */}
      <div className="dock-belt">
        <div className="belt-strip" />
      </div>

      {/* the crate — either on the lorry (beats 2-3) or in transit (beat 4+) */}
      {showCrateOnLorry && (
        <div className="dock-crate dock-crate-on-lorry">
          <Crate />
          <div className="crate-label">color scheme</div>
        </div>
      )}

      {showCrateInTransit && (
        <div className={`dock-crate dock-crate-journey crate-state-${journey}`}>
          <Crate />
        </div>
      )}
    </div>
  )
}
