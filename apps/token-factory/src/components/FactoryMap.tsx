import { LANES } from '../data/lanes'
import { StationLog } from './StationLog'

// Opener scene. Five parallel build lanes converging into the bundle.
// Mirrors the FigJam architecture board so the team can cross-reference.
// Our active lane (color scheme) is highlighted with a star and bright
// colour; sibling lanes are dimmed and labelled "not today."

const LOG_LINES = [
  '> factory map :: five lanes converge at the bundle',
  '> today we walk the color-scheme lane',
  '> sibling lanes exist in parallel — not in scope for this workshop',
]

export function FactoryMap() {
  return (
    <div className="station">
      <header className="station-head">
        <span className="station-id">★</span>
        <span className="station-name">factory map</span>
      </header>

      <div className="station-body map-body">
        <div className="map-lanes">
          {LANES.map((lane) => (
            <div
              key={lane.id}
              className={`map-lane ${lane.active ? 'is-active' : ''}`}
            >
              <span
                className="lane-swatch"
                style={{ background: lane.colorVar }}
              />
              <span className="lane-name">{lane.label}</span>
              <span className="lane-source">{lane.source}</span>
              <span className="lane-arrow">→</span>
              <span className="lane-build">{lane.build}</span>
              <span className="lane-arrow">→</span>
              <span className="lane-output">{lane.output}</span>
              {lane.active && <span className="lane-today">★ TODAY</span>}
            </div>
          ))}
        </div>

        <div className="map-bundle">
          <span className="map-bundle-arrow">→</span>
          <div className="map-bundle-box">
            <span className="map-bundle-label">bundle</span>
            <span className="map-bundle-output">variables.min.css</span>
          </div>
        </div>
      </div>

      <StationLog lines={LOG_LINES} />
    </div>
  )
}
