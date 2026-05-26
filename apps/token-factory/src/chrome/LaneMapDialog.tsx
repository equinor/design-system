import type { Lane, SceneRef, StageViz } from '../data/lanes/types'
import { StageViz as StageVizIcon } from './StageVizIcon'
import './laneMapDialog.css'

// Modal dialog showing the active lane's pipeline as a 3×3 connected
// snake. Opened with the `m` key, dismissed with `m` or `Esc`.
//
// Cell flow (snake):
//   1 → 2 → 3
//             ↓
//   6 ← 5 ← 4
//   ↓
//   7 → 8 → 9
//
// We render in flow order — the cells' physical grid position is set
// per-cell so the visual layout matches the snake regardless of the
// stage's index in `lane.stages`.

type Props = {
  lane: Lane
  scene: SceneRef
  onClose: () => void
}

type CellPos = {
  row: number
  col: number
  next: 'right' | 'down' | 'left' | null
}

// Snake positions for cells 0..8 (flow order).
const FLOW: CellPos[] = [
  { row: 0, col: 0, next: 'right' },
  { row: 0, col: 1, next: 'right' },
  { row: 0, col: 2, next: 'down' },
  { row: 1, col: 2, next: 'left' },
  { row: 1, col: 1, next: 'left' },
  { row: 1, col: 0, next: 'down' },
  { row: 2, col: 0, next: 'right' },
  { row: 2, col: 1, next: 'right' },
  { row: 2, col: 2, next: null },
]

export function LaneMapDialog({ lane, scene, onClose }: Props) {
  const stages = lane.stages ?? []
  const activeStage = scene.stage
  const activeIdx = stages.findIndex((s) => s.id === activeStage)

  return (
    <div
      className="lane-map-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="pipeline map"
      onClick={onClose}
    >
      <div className="lane-map-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="lane-map-dialog-header">
          <span className="lane-map-dialog-title">
            ★ {lane.label} pipeline ★
          </span>
          <button
            type="button"
            className="lane-map-close"
            onClick={onClose}
            aria-label="close map"
          >
            ✕
          </button>
        </div>

        <div className="lane-map-grid">
          {stages.slice(0, 9).map((stage, idx) => {
            const pos = FLOW[idx]
            if (!pos) return null
            const state =
              activeIdx === -1
                ? 'future'
                : idx < activeIdx
                  ? 'past'
                  : idx === activeIdx
                    ? 'active'
                    : 'future'
            return (
              <div
                key={stage.id}
                className="lane-map-cell"
                data-state={state}
                style={{
                  gridRow: pos.row + 1,
                  gridColumn: pos.col + 1,
                }}
              >
                <div className="lane-map-cell-step">{idx + 1}</div>
                <div className="lane-map-cell-viz">
                  {stage.viz && <StageVizIcon viz={stage.viz as StageViz} />}
                </div>
                <div className="lane-map-cell-label">{stage.label}</div>
                <div className="lane-map-cell-pkg">{stage.pkg ?? ''}</div>
                {pos.next && (
                  <div
                    className="lane-map-arrow"
                    data-direction={pos.next}
                    aria-hidden
                  />
                )}
              </div>
            )
          })}
        </div>

        <div className="lane-map-footer">
          <span className="lane-map-footer-key">[ m ]</span>
          <span className="lane-map-footer-label">close</span>
        </div>
      </div>
    </div>
  )
}
