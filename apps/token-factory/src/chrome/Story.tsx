import { useCallback, useEffect, useState } from 'react'
import { SCRIPT } from '../data/script'
import { Narrator } from './Narrator'
import { Dock } from '../scenes/dock/Dock'
import { Crack } from '../scenes/static/Crack'
import { Cutting } from '../scenes/static/Cutting'
import { Inside } from '../scenes/static/Inside'
import { Jeweller } from '../scenes/static/Jeweller'
import { Packaging } from '../scenes/static/Packaging'
import { Peel } from '../scenes/static/Peel'
import { Reveal } from '../scenes/static/Reveal'
import { Tray } from '../scenes/static/Tray'

// Top-level story orchestrator. Owns scene index (0..SCRIPT.length-1),
// the narrator skip-tick counter, and the keyboard handler.
//
// Phase B ships with all 9 scenes rendering as titled placeholders.
// Phase C and D will replace the placeholders with real scene
// components.

export function Story() {
  const [sceneIdx, setSceneIdx] = useState(0)
  const [skipTick, setSkipTick] = useState(0)
  const [activeBeatIdx, setActiveBeatIdx] = useState(0)
  const scene = SCRIPT[sceneIdx]

  // Reset the beat index when the scene changes.
  useEffect(() => {
    setActiveBeatIdx(0)
  }, [sceneIdx])

  const advance = useCallback(() => {
    setSceneIdx((i) => (i + 1) % SCRIPT.length)
  }, [])

  const back = useCallback(() => {
    setSceneIdx((i) => (i - 1 + SCRIPT.length) % SCRIPT.length)
  }, [])

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

  const isReady = (id: string) =>
    id === 'intro' ||
    id === 'jeweller' ||
    id === 'dock' ||
    id === 'inside' ||
    id === 'crack' ||
    id === 'reveal' ||
    id === 'peel' ||
    id === 'cutting' ||
    id === 'tray' ||
    id === 'packaging'

  return (
    <>
      {scene.id === 'dock' && <Dock activeBeatIdx={activeBeatIdx} />}
      {scene.id === 'inside' && <Inside activeBeatIdx={activeBeatIdx} />}
      {scene.id === 'crack' && <Crack activeBeatIdx={activeBeatIdx} />}
      {scene.id === 'reveal' && <Reveal activeBeatIdx={activeBeatIdx} />}
      {scene.id === 'peel' && <Peel activeBeatIdx={activeBeatIdx} />}
      {scene.id === 'cutting' && <Cutting activeBeatIdx={activeBeatIdx} />}
      {scene.id === 'tray' && <Tray activeBeatIdx={activeBeatIdx} />}
      {scene.id === 'packaging' && <Packaging activeBeatIdx={activeBeatIdx} />}
      {scene.id === 'jeweller' && <Jeweller activeBeatIdx={activeBeatIdx} />}
      {!isReady(scene.id) && (
        <div className="scene-placeholder">
          <div className="scene-header">
            <span className="scene-counter">
              scene {sceneIdx + 1} / {SCRIPT.length}
            </span>
            <span className="scene-title">{scene.title}</span>
          </div>
          <div className="scene-body">
            <p>scene visuals land in phase d</p>
          </div>
        </div>
      )}

      <Narrator
        lines={scene.lines}
        skipTick={skipTick}
        onBeatChange={setActiveBeatIdx}
        onAdvancePastEnd={advance}
        centered={scene.id === 'intro'}
      />

      <div className="story-hint">
        {!isReady(scene.id) && (
          <>
            <span className="hint-label">phase b scaffold ·</span>
          </>
        )}
        <span className="hint-key">[ space ]</span>
        <span className="hint-label">skip / next line</span>
        <span className="hint-sep">·</span>
        <span className="hint-key">[ → ]</span>
        <span className="hint-label">next scene</span>
      </div>
    </>
  )
}
