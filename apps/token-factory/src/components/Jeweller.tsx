import { useEffect, useState } from 'react'
import { Necklace, type NecklaceState } from './Necklace'
import { Token } from './Token'

// Scene 9 — the payoff. Box arrives at the EDS product team workshop.
// A jeweller pulls components from it and assembles a necklace. On the
// narrator's "what they make is your design system" beat (beat 3), the
// pixel-art necklace transitions into a real EDS <Button>.
//
// The pixel-to-real shift IS the bookend. Everything before it is pixel-
// art chrome; the Button uses real EDS CSS variables and the real font
// stack — image-rendering: auto overrides the global pixelated rule.
//
// Beat mapping:
//   0 — workshop intro, jeweller alone with empty bench
//   1 — gemstone, cord, clasp appear separately on the bench
//   2 — assembly: gem → cord → full necklace (sub-timed within beat 2)
//   3 — reveal: necklace fades, real Button fades in
//   4 — Button held, closing beat

type Phase = NecklaceState | 'revealing' | 'revealed'

export function Jeweller({ activeBeatIdx }: { activeBeatIdx: number }) {
  const [phase, setPhase] = useState<Phase>('none')

  useEffect(() => {
    if (activeBeatIdx === 0) {
      setPhase('none')
    } else if (activeBeatIdx === 1) {
      setPhase('gem')
    } else if (activeBeatIdx === 2) {
      // Sub-timed assembly within beat 2: gem → cord → full
      setPhase('gem')
      const t1 = window.setTimeout(() => setPhase('cord'), 700)
      const t2 = window.setTimeout(() => setPhase('full'), 1500)
      return () => {
        window.clearTimeout(t1)
        window.clearTimeout(t2)
      }
    } else if (activeBeatIdx === 3) {
      setPhase('revealing')
      const t = window.setTimeout(() => setPhase('revealed'), 600)
      return () => window.clearTimeout(t)
    } else if (activeBeatIdx >= 4) {
      setPhase('revealed')
    }
  }, [activeBeatIdx])

  const showNecklace = phase === 'gem' || phase === 'cord' || phase === 'full'
  const showRevealing = phase === 'revealing'
  const showRevealed = phase === 'revealed'

  return (
    <div className="jeweller-scene">
      {/* shop sign */}
      <div className="shop-sign">
        <span>★ EDS PRODUCT TEAM ★</span>
      </div>

      {/* workshop interior — simple silhouettes for atmosphere */}
      <div className="shop-interior">
        <div className="shop-wall shop-wall-1" />
        <div className="shop-wall shop-wall-2" />
        <div className="shop-window shop-window-1" />
        <div className="shop-window shop-window-2" />
      </div>

      {/* jeweller character (left side) */}
      <div className="jeweller-character">
        <Token />
      </div>

      {/* the bench + product display (right side) */}
      <div className="workbench">
        <div className="bench-surface" />

        {/* loose components when beat 1: gem alone, but also show cord
            and clasp as labelled tiny items on the bench */}
        {phase === 'gem' && activeBeatIdx === 1 && (
          <div className="bench-components">
            <span className="component-tag component-tag-gem">gemstone</span>
            <span className="component-tag component-tag-cord">cord</span>
            <span className="component-tag component-tag-clasp">clasp</span>
          </div>
        )}

        {/* necklace stages on the bench (beats 1-2) */}
        {showNecklace && (
          <div className="necklace-display">
            <Necklace state={phase as NecklaceState} />
          </div>
        )}

        {/* fade-out transition (beat 3) */}
        {showRevealing && (
          <div className="necklace-display is-fading">
            <Necklace state="full" />
          </div>
        )}

        {/* the real EDS Button — image-rendering:auto, real font stack,
            real CSS variables. The bookend reveal. */}
        {showRevealed && (
          <div className="real-button-display">
            <button type="button" className="showroom-button">
              Save changes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
