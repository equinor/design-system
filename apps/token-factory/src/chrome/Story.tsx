import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  LANES,
  PROLOGUE,
  STATIC_LANE,
  type LaneId,
  type SceneRef,
} from '../data/lanes'
import { SCENES } from '../data/sceneRegistry'
import { LaneContext, LaneSelectionContext } from './LaneContext'
import { Narrator } from './Narrator'

// Top-level story orchestrator.
//
// Owns:
//   - `route`            — where we are: prologue (intro/dock) or in a lane
//   - `selectedLaneId`   — which lane the dock will route into when we leave it
//   - `skipTick`         — narrator skip-pulse counter
//   - `activeBeatIdx`    — current beat index within the active scene
//
// Branching: the Dock scene exposes the lane indicator as clickable rows
// (via LaneSelectionContext). Clicking a different lane updates
// `selectedLaneId`. When the driver advances past the dock, the route
// transitions into that lane's first post-dock scene.

type Route =
  | { kind: 'prologue'; sceneIdx: number }
  | { kind: 'lane'; laneId: LaneId; sceneIdx: number }

export function Story() {
  const [route, setRoute] = useState<Route>({ kind: 'prologue', sceneIdx: 0 })
  const [selectedLaneId, setSelectedLaneId] = useState<LaneId>('static')
  const [skipTick, setSkipTick] = useState(0)
  const [activeBeatIdx, setActiveBeatIdx] = useState(0)

  const selectedLane = LANES[selectedLaneId] ?? STATIC_LANE

  // Current scene resolves from the route. Falls back to intro if a
  // lane index goes out of bounds — defensive against locked lanes
  // accidentally becoming the selected lane.
  const scene: SceneRef | undefined =
    route.kind === 'prologue'
      ? PROLOGUE[route.sceneIdx]
      : LANES[route.laneId]?.scenes[route.sceneIdx]

  const Scene = scene ? SCENES[scene.id] : undefined

  // Reset beat index when the scene changes.
  useEffect(() => {
    setActiveBeatIdx(0)
  }, [route])

  const advance = useCallback(() => {
    setRoute((r) => {
      if (r.kind === 'prologue') {
        if (r.sceneIdx < PROLOGUE.length - 1) {
          return { kind: 'prologue', sceneIdx: r.sceneIdx + 1 }
        }
        // Past the dock — enter the selected lane's first scene.
        const lane = LANES[selectedLaneId]
        if (lane && lane.scenes.length > 0) {
          return { kind: 'lane', laneId: selectedLaneId, sceneIdx: 0 }
        }
        // Selected lane has no scenes (locked). Loop back to intro.
        return { kind: 'prologue', sceneIdx: 0 }
      }
      // In a lane — advance, or loop back to intro at the end.
      const lane = LANES[r.laneId]
      if (lane && r.sceneIdx < lane.scenes.length - 1) {
        return { kind: 'lane', laneId: r.laneId, sceneIdx: r.sceneIdx + 1 }
      }
      return { kind: 'prologue', sceneIdx: 0 }
    })
  }, [selectedLaneId])

  const back = useCallback(() => {
    setRoute((r) => {
      if (r.kind === 'prologue') {
        if (r.sceneIdx > 0) {
          return { kind: 'prologue', sceneIdx: r.sceneIdx - 1 }
        }
        // Wrap back to the end of the selected lane (or stay if locked).
        const lane = LANES[selectedLaneId]
        if (lane && lane.scenes.length > 0) {
          return {
            kind: 'lane',
            laneId: selectedLaneId,
            sceneIdx: lane.scenes.length - 1,
          }
        }
        return r
      }
      if (r.sceneIdx > 0) {
        return { kind: 'lane', laneId: r.laneId, sceneIdx: r.sceneIdx - 1 }
      }
      // At the start of a lane — step back to the dock (last prologue scene).
      return { kind: 'prologue', sceneIdx: PROLOGUE.length - 1 }
    })
  }, [selectedLaneId])

  const skip = useCallback(() => {
    setSkipTick((t) => t + 1)
  }, [])

  const restart = useCallback(() => {
    setRoute({ kind: 'prologue', sceneIdx: 0 })
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        skip()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        advance()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        back()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        restart()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [advance, back, skip, restart])

  const selectionValue = useMemo(
    () => ({ selectedLaneId, setSelectedLaneId }),
    [selectedLaneId],
  )

  return (
    <LaneContext.Provider value={selectedLane}>
      <LaneSelectionContext.Provider value={selectionValue}>
        {Scene && scene ? (
          <Scene activeBeatIdx={activeBeatIdx} />
        ) : (
          <div className="scene-placeholder">
            <div className="scene-header">
              <span className="scene-title">scene not available</span>
            </div>
          </div>
        )}

        {scene && (
          <Narrator
            lines={scene.lines}
            skipTick={skipTick}
            onBeatChange={setActiveBeatIdx}
            onAdvancePastEnd={advance}
            centered={scene.narrator === 'centered'}
          />
        )}

        <div className="story-hint">
          <span className="hint-key">[ space ]</span>
          <span className="hint-label">skip / next line</span>
          <span className="hint-sep">·</span>
          <span className="hint-key">[ → ]</span>
          <span className="hint-label">next scene</span>
        </div>
      </LaneSelectionContext.Provider>
    </LaneContext.Provider>
  )
}
