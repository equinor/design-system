import { useState } from 'react'
import { StationLog } from './StationLog'

// The payoff. After the token has been synced, resolved, transformed,
// emitted in 4 formats, bundled, and dark-scope-rewritten — what was
// the point? *This.* A real, themable component driven by real EDS
// CSS variables, reacting to ancestor data-* attributes the way
// consumers ship it.
//
// The pixel-art chrome of the factory gives way here: the button uses
// real EDS variables and the real EDS font stack. That tonal shift IS
// the reveal — "this is your design system."

type Scheme = 'light' | 'dark'
type Appearance =
  | 'neutral'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
type Density = 'comfortable' | 'spacious'

const APPEARANCES: Appearance[] = [
  'neutral',
  'accent',
  'info',
  'success',
  'warning',
  'danger',
]

export function Showroom() {
  const [scheme, setScheme] = useState<Scheme>('light')
  const [appearance, setAppearance] = useState<Appearance>('accent')
  const [density, setDensity] = useState<Density>('comfortable')

  const log = [
    '> ★ showroom :: real eds button driven by real tokens',
    `> data-color-scheme="${scheme}"`,
    `> data-color-appearance="${appearance}"`,
    `> data-density="${density}"`,
  ]

  return (
    <div className="station">
      <header className="station-head">
        <span className="station-id">★</span>
        <span className="station-name">showroom</span>
      </header>

      <div className="station-body showroom-body">
        <div
          className="showroom-stage"
          data-color-scheme={scheme}
          data-color-appearance={appearance}
          data-density={density}
        >
          <button className="showroom-button" type="button">
            Save changes
          </button>
        </div>

        <div className="showroom-controls">
          <div className="control-row">
            <div className="control-label">scheme</div>
            <div className="control-group">
              {(['light', 'dark'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`segment ${scheme === s ? 'is-active' : ''}`}
                  onClick={() => setScheme(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="control-row">
            <div className="control-label">appearance</div>
            <div className="control-group">
              {APPEARANCES.map((a) => (
                <button
                  key={a}
                  type="button"
                  className={`segment ${appearance === a ? 'is-active' : ''}`}
                  onClick={() => setAppearance(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="control-row">
            <div className="control-label">density</div>
            <div className="control-group">
              {(['comfortable', 'spacious'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`segment ${density === d ? 'is-active' : ''}`}
                  onClick={() => setDensity(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <StationLog lines={log} />
    </div>
  )
}
