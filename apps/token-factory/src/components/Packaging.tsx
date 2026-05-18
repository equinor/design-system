import { Gemstone, HERO_GEM } from './Gemstone'
import { SceneHeader } from './SceneHeader'

// Scene 8 — The Packaging.
// Final pipeline stage. Our tray meets materials from the four other
// lanes. Inspector (build-dark-scope) adds three explicit faces before
// the box is sealed as `variables.min.css`.
//
// Beat mapping:
//   0 — shipping bench. our tray + empty box. other lane bins labelled.
//   1 — cords/clasps/chains flow into the box from the side bins.
//   2 — inspector arrives. magnifier hovers over the tray.
//   3 — focus on the two-facet gemstone. "consumers might not support
//       light-dark()."
//   4 — gemstone splits into THREE explicit faces (light / dark / fused).
//   5 — `build-dark-scope` label. CSS declarations card shows the trio.
//   6 — box closed. stamp lands: `variables.min.css`.

type LaneIcon = {
  label: string
  shape: 'cord' | 'clasp' | 'chain'
  pkg: string
}

const LANES: LaneIcon[] = [
  { label: 'cords', shape: 'cord', pkg: 'spacing' },
  { label: 'clasps', shape: 'clasp', pkg: 'density' },
  { label: 'chains', shape: 'chain', pkg: 'typography' },
]

function CordSprite() {
  return (
    <svg
      className="lane-sprite"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
    >
      <rect x={2} y={3} width={2} height={2} fill="#83769c" />
      <rect x={4} y={5} width={2} height={2} fill="#83769c" />
      <rect x={6} y={7} width={2} height={2} fill="#83769c" />
      <rect x={8} y={9} width={2} height={2} fill="#83769c" />
      <rect x={10} y={11} width={2} height={2} fill="#83769c" />
      <rect x={12} y={9} width={2} height={2} fill="#83769c" />
      <rect x={10} y={7} width={2} height={2} fill="#83769c" />
      <rect x={8} y={5} width={2} height={2} fill="#83769c" />
    </svg>
  )
}

function ClaspSprite() {
  return (
    <svg
      className="lane-sprite"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
    >
      <rect x={5} y={3} width={6} height={2} fill="#ffa300" />
      <rect x={3} y={5} width={2} height={6} fill="#ffa300" />
      <rect x={11} y={5} width={2} height={6} fill="#ffa300" />
      <rect x={5} y={11} width={6} height={2} fill="#ffa300" />
      <rect x={6} y={6} width={4} height={4} fill="#ffec27" />
    </svg>
  )
}

function ChainSprite() {
  return (
    <svg
      className="lane-sprite"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
    >
      <rect x={3} y={3} width={4} height={3} fill="#c2c3c7" />
      <rect x={4} y={4} width={2} height={1} fill="#202223" />
      <rect x={6} y={7} width={4} height={3} fill="#c2c3c7" />
      <rect x={7} y={8} width={2} height={1} fill="#202223" />
      <rect x={9} y={11} width={4} height={3} fill="#c2c3c7" />
      <rect x={10} y={12} width={2} height={1} fill="#202223" />
    </svg>
  )
}

function laneSprite(shape: LaneIcon['shape']) {
  if (shape === 'cord') return <CordSprite />
  if (shape === 'clasp') return <ClaspSprite />
  return <ChainSprite />
}

// Three explicit faces (the dark-scope output).
// - fused: the light-dark() declaration (full hero gem)
// - light only: top half (use light colours throughout)
// - dark only: bottom half (use dark colours throughout)
const LIGHT_ONLY_GEM = {
  ...HERO_GEM,
  dark: HERO_GEM.light,
  darkHighlight: HERO_GEM.lightHighlight,
  darkShadow: HERO_GEM.lightShadow,
}
const DARK_ONLY_GEM = {
  ...HERO_GEM,
  light: HERO_GEM.dark,
  lightHighlight: HERO_GEM.darkHighlight,
  lightShadow: HERO_GEM.darkShadow,
}

export function Packaging({ activeBeatIdx }: { activeBeatIdx: number }) {
  const showMaterials = activeBeatIdx >= 1
  const showInspector = activeBeatIdx >= 2
  const showSplit = activeBeatIdx >= 4
  const showCodeCard = activeBeatIdx >= 5
  const sealed = activeBeatIdx >= 6

  return (
    <div className="pkg-scene">
      <SceneHeader pkg="@equinor/eds-tokens-build" title="THE PACKAGING" />

      <div className="pkg-stage">
        {/* Left rail: other-lane bins feeding the box */}
        <div className={`pkg-bins ${showMaterials ? 'is-flowing' : ''}`}>
          {LANES.map((lane) => (
            <div key={lane.label} className="pkg-bin">
              <div className="pkg-bin-sprite">{laneSprite(lane.shape)}</div>
              <div className="pkg-bin-label">
                <div className="pkg-bin-label-name">{lane.label}</div>
                <div className="pkg-bin-label-pkg">{lane.pkg}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Center: the shipping box (or three-face split) */}
        <div className="pkg-center">
          {showInspector && !sealed && (
            <div className="pkg-inspector">
              <span className="pkg-inspector-mag">@</span>
              <span className="pkg-inspector-tag">build-dark-scope</span>
            </div>
          )}

          {(!showSplit || sealed) && (
            <div className={`pkg-box ${sealed ? 'is-sealed' : ''}`}>
              <div className="pkg-box-lid" />
              <div className="pkg-box-body">
                {!sealed && (
                  <div className="pkg-box-contents">
                    <div className="pkg-box-gem">
                      <Gemstone />
                    </div>
                  </div>
                )}
                {sealed && (
                  <div className="pkg-box-stamp">variables.min.css</div>
                )}
              </div>
            </div>
          )}

          {showSplit && !sealed && (
            <div className="pkg-split">
              <div className="pkg-split-gem">
                <Gemstone colors={LIGHT_ONLY_GEM} />
                <div className="pkg-split-tag pkg-split-tag-light">-light</div>
              </div>
              <div className="pkg-split-gem">
                <Gemstone colors={HERO_GEM} />
                <div className="pkg-split-tag pkg-split-tag-fused">
                  light-dark()
                </div>
              </div>
              <div className="pkg-split-gem">
                <Gemstone colors={DARK_ONLY_GEM} />
                <div className="pkg-split-tag pkg-split-tag-dark">-dark</div>
              </div>
            </div>
          )}
        </div>

        {/* Right rail: code-card showing the three explicit faces */}
        <div className="pkg-side">
          {showCodeCard && (
            <div className="pkg-code">
              <div className="pkg-code-key">three explicit faces</div>
              <pre className="pkg-code-pre">
                <span className="decl-prop">--eds-color-bg-floating</span>
                {':\n  '}
                <span className="decl-fn">light-dark</span>
                <span className="decl-paren">(</span>
                <span className="decl-light">#ffffff</span>
                <span className="decl-comma">, </span>
                <span className="decl-dark">#202223</span>
                <span className="decl-paren">)</span>
                <span className="decl-semi">;</span>
                {'\n'}
                <span className="decl-prop">--eds-color-bg-floating-light</span>
                {': '}
                <span className="decl-light">#ffffff</span>
                <span className="decl-semi">;</span>
                {'\n'}
                <span className="decl-prop">--eds-color-bg-floating-dark</span>
                {':  '}
                <span className="decl-dark">#202223</span>
                <span className="decl-semi">;</span>
              </pre>
              <div className="pkg-code-note">
                consumers without light-dark() use -light or -dark.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
