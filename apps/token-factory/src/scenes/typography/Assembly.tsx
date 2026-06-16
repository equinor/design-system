import { useEffect, useState } from 'react'
import { Gemstone } from '../../sprites/Gemstone'
import { SceneHeader } from '../../chrome/SceneHeader'
import './assembly.css'

// Typography lane payoff — the bookend, built first to validate the
// end-state (mirrors how the colours-static lane built its Jeweller
// first in Phase C).
//
// The two factory wings meet here: colour's gem (from the gem hall)
// drops into the seat the machine shop milled, and the result is a real
// EDS <Button>. Its TEXT is the protagonist token —
// --eds-typography-ui-body-md-font-size, the real Inter font stack — and
// its FILL is the colour token. Both lanes converge on one component.
//
// The live density dial is typography's equivalent of colour's
// light/dark moment: toggling [data-density] re-resolves the eds-tokens
// typography variables and the real button visibly resizes. eds-tokens
// variables.css ships static per-density values, so this is the genuine
// shipped behaviour, not a simulation.
//
// Beat mapping:
//   0 — sealed variables.css box on the bench
//   1 — gem + milled sort appear and converge toward the seat
//   2 — flash; the real <Button> reveals (spacious)
//   3 — the density dial oscillates the button live
//   4 — held, closing beat (dial keeps running)

const DENSITY_PERIOD_MS = 1400

export function Assembly({ activeBeatIdx }: { activeBeatIdx: number }) {
  const showBox = activeBeatIdx === 0
  const showMaterials = activeBeatIdx === 1
  const showFlash = activeBeatIdx === 2
  const showButton = activeBeatIdx >= 2
  const dialActive = activeBeatIdx >= 3

  const [density, setDensity] = useState<'spacious' | 'comfortable'>('spacious')

  useEffect(() => {
    if (!dialActive) {
      setDensity('spacious')
      return
    }
    const id = setInterval(() => {
      setDensity((d) => (d === 'spacious' ? 'comfortable' : 'spacious'))
    }, DENSITY_PERIOD_MS)
    return () => clearInterval(id)
  }, [dialActive])

  return (
    <div className="assembly-scene">
      <SceneHeader pkg="@equinor/eds-core-react" title="ASSEMBLY" />

      <div className="assembly-stage">
        <div className="assembly-bench">
          <div className="assembly-bench-surface" />

          {showBox && (
            <div className="assembly-arrived-box">
              <div className="assembly-arrived-box-lid" />
              <div className="assembly-arrived-box-body">
                <div className="assembly-arrived-box-stamp">variables.css</div>
              </div>
            </div>
          )}

          {showMaterials && (
            <div className="assembly-materials is-converging">
              <div className="assembly-material assembly-material-gem">
                <div className="assembly-material-sprite">
                  <Gemstone />
                </div>
                <div className="assembly-material-meta">
                  <span className="assembly-material-label">gem</span>
                  <span className="assembly-material-pkg">
                    colours · static
                  </span>
                </div>
              </div>

              <div className="assembly-material assembly-material-sort">
                <div className="assembly-material-sprite">
                  <div className="metal-sort">
                    <span className="metal-sort-face">md</span>
                  </div>
                </div>
                <div className="assembly-material-meta">
                  <span className="assembly-material-label">sort</span>
                  <span className="assembly-material-pkg">s&amp;t tokens</span>
                </div>
              </div>
            </div>
          )}

          {showFlash && <div className="assembly-flash" />}

          {showButton && (
            <div className="assembly-render" data-density={density}>
              <button type="button" className="assembly-button">
                Save changes
              </button>
              <div className="assembly-baseline-rail" />
              <span className="assembly-density-tag">density: {density}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
