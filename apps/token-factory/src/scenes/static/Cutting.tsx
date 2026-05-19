import { Gemstone } from '../../sprites/Gemstone'
import { SceneHeader } from '../../chrome/SceneHeader'
import './cutting.css'

// Scene 6 — The Cutting.
// The geode arrives at the cutter with a CSS variable name attached.
// Here it gets cut into a two-facet gemstone: one facet for the light
// value, one for the dark. The result is the `light-dark()` CSS
// declaration that powers theming.
//
// Beat mapping:
//   0 — two raw values visible side-by-side (#ffffff and #202223).
//   1 — same. Narrator names the dark value.
//   2 — the cutter fires. Values merge.
//   3 — single two-facet gemstone visible. CSS declaration appears.
//   4 — hold. Final summary beat.

export function Cutting({ activeBeatIdx }: { activeBeatIdx: number }) {
  const fused = activeBeatIdx >= 3
  const showFusion = activeBeatIdx === 2
  const showDeclaration = activeBeatIdx >= 3

  return (
    <div className="cutting-scene">
      <SceneHeader pkg="@equinor/eds-tokens-build" title="THE CUTTING" />

      <div className="cutting-stage">
        <div className="cutting-bench">
          {!fused ? (
            <div className={`cutting-pair ${showFusion ? 'is-fusing' : ''}`}>
              <div className="raw-value raw-value-light">
                <div className="raw-swatch" style={{ background: '#ffffff' }} />
                <div className="raw-label">
                  <span className="raw-label-key">light</span>
                  <span className="raw-label-value">#ffffff</span>
                </div>
              </div>

              <div className="cutting-arrow">+</div>

              <div className="raw-value raw-value-dark">
                <div
                  className="raw-swatch"
                  style={{ background: '#202223', borderColor: '#3d3d3f' }}
                />
                <div className="raw-label">
                  <span className="raw-label-key">dark</span>
                  <span className="raw-label-value">#202223</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="cutting-gem">
              <Gemstone />
            </div>
          )}
        </div>

        {showDeclaration && (
          <div className="cutting-declaration">
            <div className="declaration-key">css declaration</div>
            <pre className="declaration-value">
              <span className="decl-prop">--eds-color-bg-floating</span>
              <span className="decl-colon">: </span>
              <span className="decl-fn">light-dark</span>
              <span className="decl-paren">(</span>
              <span className="decl-light">#ffffff</span>
              <span className="decl-comma">, </span>
              <span className="decl-dark">#202223</span>
              <span className="decl-paren">)</span>
              <span className="decl-semi">;</span>
            </pre>
            <div className="declaration-note">
              one token. two values. one declaration.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
