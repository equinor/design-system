import { Gemstone } from '../../sprites/Gemstone'
import {
  ChainSprite,
  ClaspSprite,
  CordSprite,
  LacquerSprite,
} from '../../sprites/LaneSprites'
import { SceneHeader } from '../../chrome/SceneHeader'
import './packaging.css'

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
  shape: 'cord' | 'clasp' | 'chain' | 'lacquer'
  pkg: string
}

// One bin per other-lane from Scene 1. The four siblings to Static
// (our lane): spacing primitives, foundations, spacing modes, dynamic.
// Note: the "spacing modes" Figma file is the home of typography,
// density, border radius, and most modal axes — not just spacing.
const LANES: LaneIcon[] = [
  { label: 'cords', shape: 'cord', pkg: 'spacing primitives' },
  { label: 'clasps', shape: 'clasp', pkg: 'foundations · elevation' },
  { label: 'chains', shape: 'chain', pkg: 'spacing modes · typography' },
  { label: 'lacquer', shape: 'lacquer', pkg: 'dynamic · appearance' },
]

function laneSprite(shape: LaneIcon['shape']) {
  if (shape === 'cord') return <CordSprite />
  if (shape === 'clasp') return <ClaspSprite />
  if (shape === 'chain') return <ChainSprite />
  return <LacquerSprite />
}

// Four scoped declarations the build-dark-scope step appends.
// Same variable name (--eds-color-bg-floating) — different selectors
// resolve it to either the light value or the dark value.
type ScopedDecl = {
  selector: string
  value: string
  isDark: boolean
  note: string
}

const SCOPED_DECLS: ScopedDecl[] = [
  {
    selector: ':root',
    value: '#ffffff',
    isDark: false,
    note: 'fallback (light)',
  },
  {
    selector: '[data-color-scheme="light"]',
    value: '#ffffff',
    isDark: false,
    note: 'explicit light',
  },
  {
    selector: '[data-color-scheme="dark"]',
    value: '#202223',
    isDark: true,
    note: 'explicit dark',
  },
  {
    selector: '@media (prefers-color-scheme: dark)',
    value: '#202223',
    isDark: true,
    note: 'system dark',
  },
]

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
                {sealed && <div className="pkg-box-stamp">variables.css</div>}
              </div>
            </div>
          )}

          {showSplit && !sealed && (
            <div className="pkg-scopes">
              {SCOPED_DECLS.map((d) => (
                <div
                  key={d.selector}
                  className={`pkg-scope ${
                    d.isDark ? 'is-dark-scope' : 'is-light-scope'
                  }`}
                >
                  <div className="pkg-scope-selector">{d.selector}</div>
                  <div
                    className="pkg-scope-swatch"
                    style={{
                      background: d.value,
                      borderColor: d.isDark ? '#3d3d3f' : '#c2c3c7',
                    }}
                  />
                  <div className="pkg-scope-value">{d.value}</div>
                  <div className="pkg-scope-note">{d.note}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right rail: code-card showing the four scoped declarations */}
        <div className="pkg-side">
          {showCodeCard && (
            <div className="pkg-code">
              <div className="pkg-code-key">scoped declarations</div>
              <pre className="pkg-code-pre">
                <span className="decl-fn">:root</span>
                {' {\n  '}
                <span className="decl-prop">--eds-color-bg-floating</span>
                {': '}
                <span className="decl-light">#ffffff</span>
                <span className="decl-semi">;</span>
                {'\n}\n'}
                <span className="decl-fn">[data-color-scheme="light"]</span>
                {' {\n  '}
                <span className="decl-prop">--eds-color-bg-floating</span>
                {': '}
                <span className="decl-light">#ffffff</span>
                <span className="decl-semi">;</span>
                {'\n}\n'}
                <span className="decl-fn">[data-color-scheme="dark"]</span>
                {' {\n  '}
                <span className="decl-prop">--eds-color-bg-floating</span>
                {': '}
                <span className="decl-dark">#202223</span>
                <span className="decl-semi">;</span>
                {'\n}\n'}
                <span className="decl-fn">
                  @media (prefers-color-scheme: dark)
                </span>
                {' { … }'}
              </pre>
              <div className="pkg-code-note">
                same variable name. four scopes resolve it.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
