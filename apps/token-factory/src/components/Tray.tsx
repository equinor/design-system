import { Gemstone, type GemstoneColors, HERO_GEM } from './Gemstone'
import { SceneHeader } from './SceneHeader'

// Scene 7 — The Tray.
// The newly-cut gemstone joins a tray of other concept-colour gemstones.
// The tray is the lane's actual file output: color-scheme.css.
//
// Beat mapping:
//   0 — empty hero slot in the tray; our gemstone hovers above.
//   1 — gemstone drops into its slot; file label appears.

type Slot = {
  name: string
  colors: GemstoneColors
  isHero?: boolean
}

// Other concept-layer tokens (rough representative values).
// Real values aren't important here — the point is "this is a collection."
const SLOTS: Slot[] = [
  {
    name: 'bg-default',
    colors: {
      light: '#ffffff',
      lightHighlight: '#fff1e8',
      lightShadow: '#c2c3c7',
      dark: '#0a0a0b',
      darkHighlight: '#2a2a2c',
      darkShadow: '#000000',
    },
  },
  {
    name: 'bg-subtle',
    colors: {
      light: '#f7f7f7',
      lightHighlight: '#ffffff',
      lightShadow: '#c2c3c7',
      dark: '#1a1a1c',
      darkHighlight: '#3d3d3f',
      darkShadow: '#000000',
    },
  },
  {
    name: 'bg-floating',
    isHero: true,
    colors: HERO_GEM,
  },
  {
    name: 'text-default',
    colors: {
      light: '#0a0a0b',
      lightHighlight: '#3d3d3f',
      lightShadow: '#000000',
      dark: '#ffffff',
      darkHighlight: '#fff1e8',
      darkShadow: '#c2c3c7',
    },
  },
  {
    name: 'text-subtle',
    colors: {
      light: '#5f5f60',
      lightHighlight: '#83769c',
      lightShadow: '#3d3d3f',
      dark: '#c2c3c7',
      darkHighlight: '#fff1e8',
      darkShadow: '#83769c',
    },
  },
  {
    name: 'border-default',
    colors: {
      light: '#c2c3c7',
      lightHighlight: '#fff1e8',
      lightShadow: '#83769c',
      dark: '#3d3d3f',
      darkHighlight: '#5f5f60',
      darkShadow: '#0a0a0b',
    },
  },
]

export function Tray({ activeBeatIdx }: { activeBeatIdx: number }) {
  const placed = activeBeatIdx >= 1
  const showLabel = activeBeatIdx >= 1

  return (
    <div className="tray-scene">
      <SceneHeader pkg="@equinor/eds-tokens-build" title="THE TRAY" />

      <div className="tray-stage">
        {!placed && (
          <div className="tray-hero-hover">
            <Gemstone colors={HERO_GEM} />
            <div className="tray-hero-tag">bg-floating</div>
          </div>
        )}

        <div className="tray-bench">
          <div className="tray-label-strip">CONCEPT TOKENS · light-dark()</div>
          <div className="tray-slots">
            {SLOTS.map((slot) => (
              <div
                key={slot.name}
                className={`tray-slot ${slot.isHero ? 'is-hero' : ''} ${
                  slot.isHero && !placed ? 'is-empty' : ''
                }`}
              >
                <div className="tray-slot-well">
                  {(!slot.isHero || placed) && (
                    <div
                      className={`tray-slot-gem ${
                        slot.isHero && placed ? 'is-dropping' : ''
                      }`}
                    >
                      <Gemstone colors={slot.colors} />
                    </div>
                  )}
                </div>
                <div className="tray-slot-name">{slot.name}</div>
              </div>
            ))}
          </div>
        </div>

        {showLabel && (
          <div className="tray-file-label">
            <div className="tray-file-key">file output</div>
            <div className="tray-file-name">color-scheme.css</div>
            <div className="tray-file-note">
              one file per lane. our lane's output is this tray.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
