import { MetalSort } from '../../sprites/MetalSort'
import { SceneHeader } from '../../chrome/SceneHeader'
import './milling.css'

// Typography Scene 5 — Milling to Spec.
//
// The colour lane's Peel names each alias ring and stamps the CSS var
// name. Here the mill cuts md to its exact size, then cuts the seat
// (line-height / leading) it sits in, snapped to the 4px baseline grid;
// finally the build engraves the variable name onto the sort.
//
// Beat mapping:
//   0 — the blank billet on the mill bed
//   1 — the mill cuts: a milled sort + "font-size: 14px"
//   2 — the seat is cut: a line-box around the sort + "line-height: 16px"
//   3 — the build engraves --eds-typography-ui-body-md-font-size

export function Milling({ activeBeatIdx }: { activeBeatIdx: number }) {
  const isCutting = activeBeatIdx === 1
  const showSort = activeBeatIdx >= 1
  const showSeat = activeBeatIdx >= 2
  const showStamp = activeBeatIdx >= 3

  return (
    <div className="milling-scene">
      <SceneHeader pkg="@equinor/eds-tokens-build" title="MILLING TO SPEC" />

      <div className="milling-stage">
        <div className={`mill-rig ${isCutting ? 'is-cutting' : ''}`}>
          <div className="mill-arm" />
          <div className="mill-head" />
        </div>

        <div className="mill-bed" />

        <div className="milling-piece">
          <div className={`milling-linebox ${showSeat ? 'is-on' : ''}`}>
            {showSort ? (
              <MetalSort />
            ) : (
              <div className="milling-blank">
                <span>?</span>
              </div>
            )}
          </div>

          {showSort && (
            <div className="milling-callout milling-callout-size">
              <span className="mc-key">font-size</span>
              <span className="mc-val">14px</span>
            </div>
          )}

          {showSeat && (
            <div className="milling-callout milling-callout-leading">
              <span className="mc-key">line-height</span>
              <span className="mc-val">16px</span>
              <span className="mc-note">leading · 4px grid</span>
            </div>
          )}
        </div>

        {showStamp && (
          <div className="milling-stamp">
            --eds-typography-ui-body-md-font-size
          </div>
        )}
      </div>
    </div>
  )
}
