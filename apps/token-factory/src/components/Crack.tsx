import { useEffect, useState } from 'react'
import { Crate } from './Crate'
import { Geode } from './Geode'
import { SceneHeader } from './SceneHeader'

// Scene 3 — The Crack.
// The crate sits under a slam press at the build station. On beat 1
// ("SLAM."), the press drops, the screen shakes, the crate splits
// open. Beat 2 holds while the narrator names the geode that emerges.
//
// State machine:
//   pre-slam — beat 0. Press up, crate closed.
//   slamming — beat 1 transition. Press dropping, screen shaking.
//   cracked  — beat 1 settled / beat 2. Press back up, crate open,
//              geode visible.

type State = 'pre-slam' | 'slamming' | 'cracked'

export function Crack({ activeBeatIdx }: { activeBeatIdx: number }) {
  const [state, setState] = useState<State>('pre-slam')

  useEffect(() => {
    if (activeBeatIdx === 0) {
      setState('pre-slam')
    } else if (activeBeatIdx === 1) {
      setState('slamming')
      // Press drop + recovery animation runs ~520ms. After it lands the
      // crate stays cracked open and the geode is revealed.
      const t = window.setTimeout(() => setState('cracked'), 520)
      return () => window.clearTimeout(t)
    } else if (activeBeatIdx >= 2) {
      setState('cracked')
    }
  }, [activeBeatIdx])

  const crateOpen = state === 'cracked' || state === 'slamming'
  const showGeode = state === 'cracked'
  const isSlamming = state === 'slamming'

  return (
    <div className={`crack-scene ${isSlamming ? 'is-shaking' : ''}`}>
      <SceneHeader pkg="@equinor/eds-tokens-build" title="BUILD STATION" />

      {/* the press: frame + head (sits on the belt below) */}
      <div className="press-rig">
        <div className="press-frame press-frame-left" />
        <div className="press-frame press-frame-right" />
        <div className={`press-hammer ${isSlamming ? 'is-slamming' : ''}`}>
          <div className="press-hammer-shaft" />
          <div className="press-hammer-head" />
        </div>
      </div>

      {/* static conveyor belt running across the bottom — same look as
          the dock/inside belts but no scroll animation. */}
      <div className="crack-belt">
        <div className="belt-strip" />
      </div>

      {/* the crate on the floor */}
      <div className={`crack-crate ${crateOpen ? 'is-open' : ''}`}>
        <Crate open={crateOpen} />
      </div>

      {/* geode revealed after the slam */}
      {showGeode && (
        <div className="crack-geode">
          <Geode />
        </div>
      )}
    </div>
  )
}
