import { Gemstone } from './Gemstone'
import {
  ChainSprite,
  ClaspSprite,
  CordSprite,
  LacquerSprite,
} from './LaneSprites'
import { SceneHeader } from './SceneHeader'
import { Token } from './Token'

// Scene 9 — the payoff. The sealed box from Scene 8 arrives at the EDS
// product team's workshop. The team opens it, recognises the same
// materials we watched the factory produce (gemstones, cords, clasps,
// chains), and from those raw materials a real EDS <Button> emerges.
//
// The pixel-to-real shift IS the bookend. Everything before it is
// pixel-art chrome; the Button uses real EDS CSS variables and the
// real font stack — image-rendering: auto overrides the global rule.
//
// Beat mapping:
//   0 — sealed `variables.min.css` box sits on the bench, jeweller waits
//   1 — box opens; the four materials fan out across the bench
//   2 — materials converge toward the bench centre (the assembly)
//   3 — flash transition: pixel assembly fades, real Button fades in
//   4 — Button held, closing beat

type Material = {
  key: string
  label: string
  pkg: string
  render: () => React.ReactElement
}

// pkg labels match Scene 1's Figma-file lanes. The gem is our
// protagonist Bg.Floating — its identity lives in Static
// (Concept.Mode 1.json); the value resolves through Foundations.
const MATERIALS: Material[] = [
  {
    key: 'gem',
    label: 'gemstone',
    pkg: 'static',
    render: () => <Gemstone />,
  },
  {
    key: 'cord',
    label: 'cord',
    pkg: 'spacing primitives',
    render: () => <CordSprite />,
  },
  {
    key: 'clasp',
    label: 'clasp',
    pkg: 'foundations',
    render: () => <ClaspSprite />,
  },
  {
    key: 'chain',
    label: 'chain',
    pkg: 'design tokens',
    render: () => <ChainSprite />,
  },
  {
    key: 'lacquer',
    label: 'lacquer',
    pkg: 'dynamic',
    render: () => <LacquerSprite />,
  },
]

export function Jeweller({ activeBeatIdx }: { activeBeatIdx: number }) {
  const showBox = activeBeatIdx === 0
  const showMaterials = activeBeatIdx === 1 || activeBeatIdx === 2
  const isAssembling = activeBeatIdx === 2
  const showFlash = activeBeatIdx === 3
  const showButton = activeBeatIdx >= 4

  return (
    <div className="jeweller-scene">
      <SceneHeader pkg="@equinor/eds-core-react" title="EDS PRODUCT TEAM" />

      <div className="jeweller-stage">
        <div className="shop-interior">
          <div className="shop-wall shop-wall-1" />
          <div className="shop-wall shop-wall-2" />
          <div className="shop-window shop-window-1" />
          <div className="shop-window shop-window-2" />
        </div>

        <div className="jeweller-character">
          <Token />
        </div>

        <div className="jeweller-bench">
          <div className="jeweller-bench-surface" />

          {showBox && (
            <div className="jeweller-arrived-box">
              <div className="jeweller-arrived-box-lid" />
              <div className="jeweller-arrived-box-body">
                <div className="jeweller-arrived-box-stamp">variables.css</div>
              </div>
            </div>
          )}

          {showMaterials && (
            <div
              className={`jeweller-materials ${
                isAssembling ? 'is-assembling' : ''
              }`}
            >
              {MATERIALS.map((m) => (
                <div
                  key={m.key}
                  className={`jeweller-material jeweller-material-${m.key}`}
                >
                  <div className="jeweller-material-sprite">{m.render()}</div>
                  <div className="jeweller-material-meta">
                    <span className="jeweller-material-label">{m.label}</span>
                    <span className="jeweller-material-pkg">{m.pkg}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showFlash && <div className="jeweller-flash" />}

          {showButton && (
            <div className="real-button-display">
              <button type="button" className="showroom-button">
                Save changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
