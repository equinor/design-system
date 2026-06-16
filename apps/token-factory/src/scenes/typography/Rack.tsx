import { MetalSort } from '../../sprites/MetalSort'
import { SceneHeader } from '../../chrome/SceneHeader'
import './rack.css'

// Typography Scene 7 — The Rack. Lane output as a file (colour's Tray).
//
// The md sort joins the full milled range — ui-body (Inter) and the
// header row (Equinor). Each sort carries its facets (weights, tracking,
// two line-heights). The build emits the rack to the typography CSS.
//
// Beat mapping:
//   0 — the rack: ui-body + header rows, md highlighted
//   1 — facet chips appear
//   2 — the typography CSS file label

const UI_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
const HEADER_SIZES = ['sm', 'md', 'lg', 'xl']

export function Rack({ activeBeatIdx }: { activeBeatIdx: number }) {
  const showFacets = activeBeatIdx >= 1
  const showFile = activeBeatIdx >= 2

  return (
    <div className="rack-scene">
      <SceneHeader pkg="@equinor/eds-tokens-build" title="THE RACK" />

      <div className="rack-stage">
        <div className="rack-shelf">
          <div className="rack-row">
            <span className="rack-row-label">ui-body · Inter</span>
            <div className="rack-row-sorts">
              {UI_SIZES.map((s) => (
                <div
                  key={s}
                  className={`rack-slot ${s === 'md' ? 'rack-hero' : ''}`}
                >
                  <MetalSort size={s} />
                </div>
              ))}
            </div>
          </div>

          <div className="rack-row">
            <span className="rack-row-label">header · Equinor</span>
            <div className="rack-row-sorts rack-row-header">
              {HEADER_SIZES.map((s) => (
                <div key={s} className="rack-slot">
                  <MetalSort size={s} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {showFacets && (
          <div className="rack-facets">
            <span className="rack-facet">weights</span>
            <span className="rack-facet">tracking</span>
            <span className="rack-facet">line-height ×2</span>
          </div>
        )}

        {showFile && (
          <div className="rack-file">typography CSS · --eds-typography-*</div>
        )}
      </div>
    </div>
  )
}
