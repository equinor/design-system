import { ACTIVE_LANE } from '../data/lanes'

// Persistent chyron strip at the very top of the stage. Tells the
// driver and the team which lane we're walking today on every scene.

export function LaneBadge() {
  return (
    <div className="lane-chyron">
      <span
        className="chyron-swatch"
        style={{ background: ACTIVE_LANE.colorVar }}
      />
      <span className="chyron-label">lane :: {ACTIVE_LANE.label}</span>
      <span className="chyron-spacer" />
      <span className="chyron-hint">[ m ] map</span>
    </div>
  )
}
