import { LANES } from '../data/lanes'
import { StationLog } from './StationLog'

// Opener scene. Three labelled stages — Sources, Builds, Bundle —
// matching the FigJam architecture board. Five lanes flow through
// the first two stages and converge in the third.
//
// Our active lane (color scheme) is highlighted; sibling lanes are
// dimmed and labelled "sibling — not today."

const LOG_LINES = [
  '> factory map :: three stages, five lanes',
  '> stage 1 :: source files in tokens/{fileKey}/',
  '> stage 2 :: a build script per lane',
  '> stage 3 :: lightningcss bundles everything into variables.min.css',
  '> today we walk the color-scheme lane (★)',
]

export function FactoryMap() {
  return (
    <div className="station">
      <header className="station-head">
        <span className="station-id">★</span>
        <span className="station-name">factory map</span>
      </header>

      <div className="station-body map-body">
        <div className="map-stages">
          <div className="map-stage">
            <div className="map-stage-title">stage 1 :: sources</div>
            <div className="map-stage-sub">tokens/{'{fileKey}'}/*.json</div>
          </div>
          <div className="map-stage">
            <div className="map-stage-title">stage 2 :: builds</div>
            <div className="map-stage-sub">style dictionary</div>
          </div>
          <div className="map-stage">
            <div className="map-stage-title">stage 3 :: bundle</div>
            <div className="map-stage-sub">lightningcss</div>
          </div>
        </div>

        <div className="map-grid">
          {LANES.map((lane) => (
            <div
              key={lane.id}
              className={`map-row ${lane.active ? 'is-active' : ''}`}
            >
              {/* Stage 1 cell */}
              <div className="map-cell map-cell-source">
                <span
                  className="lane-swatch"
                  style={{ background: lane.colorVar }}
                />
                <span className="cell-text">{lane.source}</span>
              </div>
              <span className="cell-arrow">→</span>
              {/* Stage 2 cell */}
              <div className="map-cell map-cell-build">
                <span className="cell-text">{lane.build}</span>
              </div>
              <span className="cell-arrow">→</span>
              {/* Output (feeds into Stage 3) */}
              <div className="map-cell map-cell-output">
                <span className="cell-text">{lane.output}</span>
              </div>
              {lane.active && <span className="lane-today">★ TODAY</span>}
              {!lane.active && <span className="lane-sibling">sibling</span>}
            </div>
          ))}

          {/* Stage 3 — the bundle box that all lanes converge into */}
          <div className="map-bundle-rail" aria-hidden="true" />
          <div className="map-bundle-final">
            <div className="map-bundle-final-arrow">→</div>
            <div className="map-bundle-final-box">
              <div className="bundle-final-title">variables.min.css</div>
              <div className="bundle-final-sub">+ ts / js / json</div>
            </div>
            <div className="map-bundle-final-arrow">→</div>
            <div className="map-bundle-final-consumers">consumers</div>
          </div>
        </div>
      </div>

      <StationLog lines={LOG_LINES} />
    </div>
  )
}
