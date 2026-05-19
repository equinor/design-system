import { useEffect, useState } from 'react'
import { useLaneSelection } from '../../chrome/LaneContext'
import { SceneHeader } from '../../chrome/SceneHeader'
import { LANES } from '../../data/lanes'
import { Building } from '../../sprites/Building'
import { Crate } from '../../sprites/Crate'
import { Gate } from '../../sprites/Gate'
import { Lorry } from '../../sprites/Lorry'
import { Token } from '../../sprites/Token'
import './dock.css'

// Scene 1 — The Goods Terminal. Also the diegetic branch point: at
// beat ≥3 the lane indicator becomes clickable and the driver can
// switch which lane the crate carries.
//
// Beat mapping:
//   0 — Lorry parked, conveyor running, worker idle. Crate hidden behind lorry.
//   1 — Terminal sign pulses. Crate still hidden.
//   2 — Crate peeks out from behind lorry with its lane label.
//   3 — Lane indicator brightens; rows become clickable for ready/scaffold lanes.
//   4 — Crate slides from lorry along the belt, pauses at the worker for inspection.
//   5 — Gate slides open, crate continues, enters factory, gate closes.

type Journey =
  | 'hidden'
  | 'peeking'
  | 'sliding-to-worker'
  | 'inspecting'
  | 'sliding-to-gate'
  | 'entering'
  | 'inside'

const LANE_LIST = Object.values(LANES)

export function Dock({ activeBeatIdx }: { activeBeatIdx: number }) {
  const { selectedLaneId, setSelectedLaneId } = useLaneSelection()
  const [journey, setJourney] = useState<Journey>('hidden')

  useEffect(() => {
    if (activeBeatIdx <= 1) {
      setJourney('hidden')
    } else if (activeBeatIdx === 2 || activeBeatIdx === 3) {
      setJourney('peeking')
    } else if (activeBeatIdx === 4) {
      setJourney('sliding-to-worker')
      const t = window.setTimeout(() => setJourney('inspecting'), 1400)
      return () => window.clearTimeout(t)
    } else if (activeBeatIdx === 5) {
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
  const crateVisible = journey !== 'inside'

  const selectionEnabled = activeBeatIdx >= 3
  const selectedLane = LANES[selectedLaneId]
  const selectedLabel = selectedLane?.label ?? 'static'

  return (
    <div className="dock-scene">
      <SceneHeader pkg="@equinor/eds-tokens-sync" title="GOODS TERMINAL" />

      {/* lane indicator (top-left) — destination labels.
          At beat ≥3, ready/scaffold rows become clickable. */}
      <div
        className={`lane-indicator ${activeBeatIdx >= 3 ? 'is-highlighted' : ''} ${selectionEnabled ? 'is-selectable' : ''}`}
      >
        {LANE_LIST.map((lane) => {
          const isActive = lane.id === selectedLaneId
          const isClickable =
            selectionEnabled && !isActive && lane.status !== 'locked'
          return (
            <button
              key={lane.id}
              type="button"
              className={`lane-row ${isActive ? 'lane-active' : 'lane-sibling'} ${lane.status === 'locked' ? 'is-locked' : ''} ${isClickable ? 'is-clickable' : ''}`}
              onClick={
                isClickable ? () => setSelectedLaneId(lane.id) : undefined
              }
              disabled={!isClickable}
              aria-pressed={isActive}
              aria-label={
                lane.status === 'locked'
                  ? `${lane.label} — coming soon`
                  : isActive
                    ? `${lane.label} — current lane`
                    : `Switch to ${lane.label}`
              }
            >
              <span
                className="lane-swatch"
                style={{ background: `var(${lane.accent})` }}
              />
              <span className="lane-name">{lane.label}</span>
              {lane.status === 'locked' ? (
                <span className="lane-soon-badge">soon</span>
              ) : (
                <span className="lane-arrow">→</span>
              )}
            </button>
          )
        })}
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
            <span>✓ {selectedLabel}</span>
          </div>
        )}
        <Token />
      </div>

      {/* lorry at the start of the belt */}
      <div className="lorry-spot">
        <Lorry />
      </div>

      {/* the crate — sized down, position driven by journey state. */}
      {crateVisible && (
        <div className={`dock-crate dock-crate-journey crate-state-${journey}`}>
          <Crate />
          <div className="crate-travel-label">{selectedLabel}</div>
        </div>
      )}
    </div>
  )
}
