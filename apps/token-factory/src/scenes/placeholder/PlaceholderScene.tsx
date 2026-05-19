import { useLane } from '../../chrome/LaneContext'
import { SceneHeader } from '../../chrome/SceneHeader'
import type { SceneRef } from '../../data/lanes'
import './placeholder.css'

// Generic placeholder scene reused by every scaffold lane. Renders the
// active lane's label + the scene title + a "TBD" hint inside the
// usual pixel-art chrome.
//
// One component, many scene-ref instances — adding more placeholder
// scenes is a data-only change (no new component).

type Props = {
  activeBeatIdx: number
  scene: SceneRef
}

export function PlaceholderScene({ scene }: Props) {
  const lane = useLane()
  const sceneIdx = lane.scenes.findIndex((s) => s === scene)
  const total = lane.scenes.length

  return (
    <div className="placeholder-scene">
      <SceneHeader
        pkg={`lane · ${lane.label}`}
        title={scene.title.toUpperCase()}
      />

      <div className="placeholder-stage">
        <div
          className="placeholder-card"
          style={{ borderColor: `var(${lane.accent})` }}
        >
          <div
            className="placeholder-card-stripe"
            style={{ background: `var(${lane.accent})` }}
          />
          <div className="placeholder-card-body">
            <p className="placeholder-meta">
              <span className="placeholder-meta-key">LANE</span>
              <span className="placeholder-meta-value">{lane.label}</span>
            </p>
            <p className="placeholder-meta">
              <span className="placeholder-meta-key">SCENE</span>
              <span className="placeholder-meta-value">
                {sceneIdx + 1} / {total}
              </span>
            </p>
            <p className="placeholder-tbd">scene content tbd</p>
          </div>
        </div>
      </div>
    </div>
  )
}
