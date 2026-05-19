import { useEffect, useState } from 'react'
import { Building } from '../../sprites/Building'
import { Crate } from '../../sprites/Crate'
import { Gate } from '../../sprites/Gate'
import { Lorry } from '../../sprites/Lorry'
import { Token } from '../../sprites/Token'
import { SceneHeader } from '../../chrome/SceneHeader'
import './dock.css'

// Scene 1 — The Goods Terminal.
//
// Driver-paced (no auto-advance on narrator). Each space press advances
// the narrator one beat AND advances the crate journey one stage.
//
// Beat mapping:
//   0 — Lorry parked, conveyor running, worker idle. Crate hidden behind lorry.
//   1 — Terminal sign pulses. Crate still hidden.
//   2 — Crate peeks out from behind lorry with the "static" label.
//   3 — Lane indicator brightens: Color Scheme bright, others very dim.
//   4 — Crate slides from behind lorry along the belt, stops at the worker
//       for inspection. Worker shows a reaction ("✓ static") bubble.
//   5 — Gate slides open, crate continues, enters factory, gate closes.

type Journey =
  | 'hidden' // behind lorry, not visible (beats 0–1)
  | 'peeking' // peeking out from behind lorry with label (beats 2–3)
  | 'sliding-to-worker' // beat 4 start: sliding along belt
  | 'inspecting' // beat 4 end: paused at worker, reaction shown
  | 'sliding-to-gate' // beat 5 start: continuing toward gate
  | 'entering' // gate open, crate going through
  | 'inside' // crate disappeared into building

// Five Figma files = five lanes. Names match the actual files
// listed in eds-tokens-sync/CLAUDE.md.
const LANES = [
  { id: 'static', label: 'static', colorVar: '--pico-dark-purple' },
  { id: 'foundations', label: 'foundations', colorVar: '--pico-lavender' },
  { id: 'dynamic', label: 'dynamic', colorVar: '--pico-dark-green' },
  { id: 'spacing', label: 'spacing primitives', colorVar: '--pico-orange' },
  {
    id: 'design-tokens',
    label: 'design tokens',
    colorVar: '--pico-light-gray',
  },
]

export function Dock({ activeBeatIdx }: { activeBeatIdx: number }) {
  const [journey, setJourney] = useState<Journey>('hidden')

  useEffect(() => {
    if (activeBeatIdx <= 1) {
      setJourney('hidden')
    } else if (activeBeatIdx === 2 || activeBeatIdx === 3) {
      setJourney('peeking')
    } else if (activeBeatIdx === 4) {
      // Start sliding, then auto-pause at the worker for inspection.
      setJourney('sliding-to-worker')
      const t = window.setTimeout(() => setJourney('inspecting'), 1400)
      return () => window.clearTimeout(t)
    } else if (activeBeatIdx === 5) {
      // Continue: slide past worker, then enter the building.
      setJourney('sliding-to-gate')
      const t1 = window.setTimeout(() => setJourney('entering'), 1400)
      const t2 = window.setTimeout(() => setJourney('inside'), 2400)
      return () => {
        window.clearTimeout(t1)
        window.clearTimeout(t2)
      }
    }
  }, [activeBeatIdx])

  const gateOpen = journey === 'entering' || journey === 'inside'
  const showReaction = journey === 'inspecting'
  // Crate is always rendered except after it's entered the building.
  // The 'hidden' state uses scale(0) inside the lorry so the move to
  // 'peeking' reads as an unload animation rather than a pop-in.
  const crateVisible = journey !== 'inside'

  return (
    <div className="dock-scene">
      <SceneHeader pkg="@equinor/eds-tokens-sync" title="GOODS TERMINAL" />

      {/* lane indicator (top-left) — destination labels, not parallel belts */}
      <div
        className={`lane-indicator ${activeBeatIdx >= 3 ? 'is-highlighted' : ''}`}
      >
        {LANES.map((lane) => (
          <div
            key={lane.id}
            className={`lane-row ${
              lane.id === 'static' ? 'lane-active' : 'lane-sibling'
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

      {/* the conveyor belt running the full width of the stage */}
      <div className="dock-belt">
        <div className="belt-strip" />
      </div>

      {/* worker on the belt — with a reaction bubble during inspection */}
      <div className="dock-worker">
        {showReaction && (
          <div className="worker-bubble">
            <span>✓ static</span>
          </div>
        )}
        <Token />
      </div>

      {/* lorry at the start of the belt — z-index above the crate when
          hidden/peeking so the crate is partially obscured. */}
      <div className="lorry-spot">
        <Lorry />
      </div>

      {/* the crate — sized down, position driven by journey state. */}
      {crateVisible && (
        <div className={`dock-crate dock-crate-journey crate-state-${journey}`}>
          <Crate />
          <div className="crate-travel-label">static</div>
        </div>
      )}
    </div>
  )
}
