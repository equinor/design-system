import { GaugeRack } from '../../sprites/GaugeRack'
import { SceneHeader } from '../../chrome/SceneHeader'
import './master-gauge.css'

// Typography Scene 4 — The Master Gauge.
//
// The colour lane's Reveal cracks the geode into three concentric alias
// rings. Typography has no alias rings to peel — the size is milled from
// one master measure. The rack of gauge blocks IS the modular scale:
// ten sizes, each a fixed ratio (2^(n/5)) up from the last. md is one
// rung, not a hand-typed value.
//
// Beat mapping:
//   0 — the master gauge (base) stands on the reference plate
//   1 — the rack mills out: ten blocks, xs..6xl
//   2 — md highlighted; the formula card explains the ratio

export function MasterGauge({ activeBeatIdx }: { activeBeatIdx: number }) {
  const showRack = activeBeatIdx >= 1
  const showFormula = activeBeatIdx >= 2

  return (
    <div className="master-gauge-scene">
      <SceneHeader pkg="@equinor/eds-tokens-build" title="THE MASTER GAUGE" />

      <div className="master-gauge-stage">
        {showFormula && (
          <div className="gauge-formula">
            <span className="gauge-formula-line">
              <span className="gf-out">size</span> ={' '}
              <span className="gf-base">base</span> ×{' '}
              <span className="gf-ratio">2^(n/5)</span>
            </span>
            <span className="gauge-formula-note">
              md = base × 2^(-1/5) ≈ 14px
            </span>
          </div>
        )}

        <div className="gauge-plate" />

        <div className="gauge-assembly">
          <div className="master-rod">
            <div className="master-rod-bar" />
            <span className="master-rod-label">BASE</span>
          </div>

          {showRack && (
            <GaugeRack highlight={showFormula ? 'md' : undefined} animate />
          )}
        </div>
      </div>
    </div>
  )
}
