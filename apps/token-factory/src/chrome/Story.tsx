import { useCallback, useEffect, useMemo, useState } from 'react'
import { PROLOGUE, STATIC_LANE, type SceneRef } from '../data/lanes'
import { SCENES } from '../data/sceneRegistry'
import { LaneContext } from './LaneContext'
import { Narrator } from './Narrator'

// Top-level story orchestrator. Owns scene index, the narrator skip-tick
// counter, and the keyboard handler.
//
// G.1 keeps a flat sequence: prologue (intro + dock) followed by the
// Static lane's post-dock scenes. G.2 will replace this with route-aware
// state that branches at the dock based on the selected lane.

export function Story() {
  const sequence = useMemo<SceneRef[]>(
    () => [...PROLOGUE, ...STATIC_LANE.scenes],
    [],
  )

  const [sceneIdx, setSceneIdx] = useState(0)
  const [skipTick, setSkipTick] = useState(0)
  const [activeBeatIdx, setActiveBeatIdx] = useState(0)
  const scene = sequence[sceneIdx]
  const Scene = SCENES[scene.id]

  // Reset the beat index when the scene changes.
  useEffect(() => {
    setActiveBeatIdx(0)
  }, [sceneIdx])

  const advance = useCallback(() => {
    setSceneIdx((i) => (i + 1) % sequence.length)
  }, [sequence.length])

  const back = useCallback(() => {
    setSceneIdx((i) => (i - 1 + sequence.length) % sequence.length)
  }, [sequence.length])

  const skip = useCallback(() => {
    setSkipTick((t) => t + 1)
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
        setSceneIdx(0)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [advance, back, skip])

  return (
    <LaneContext.Provider value={STATIC_LANE}>
      {Scene ? (
        <Scene activeBeatIdx={activeBeatIdx} />
      ) : (
        <div className="scene-placeholder">
          <div className="scene-header">
            <span className="scene-counter">
              scene {sceneIdx + 1} / {sequence.length}
            </span>
            <span className="scene-title">{scene.title}</span>
          </div>
          <div className="scene-body">
            <p>no component registered for scene id "{scene.id}"</p>
          </div>
        </div>
      )}

      <Narrator
        lines={scene.lines}
        skipTick={skipTick}
        onBeatChange={setActiveBeatIdx}
        onAdvancePastEnd={advance}
        centered={scene.narrator === 'centered'}
      />

      <div className="story-hint">
        <span className="hint-key">[ space ]</span>
        <span className="hint-label">skip / next line</span>
        <span className="hint-sep">·</span>
        <span className="hint-key">[ → ]</span>
        <span className="hint-label">next scene</span>
      </div>
    </LaneContext.Provider>
  )
}
