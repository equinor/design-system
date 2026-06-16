import { Gemstone } from '../../sprites/Gemstone'
import {
  ChainSprite,
  ClaspSprite,
  CordSprite,
  LacquerSprite,
} from '../../sprites/LaneSprites'
import { MetalSort } from '../../sprites/MetalSort'
import { SceneHeader } from '../../chrome/SceneHeader'
import './inspection.css'

// Typography Scene 8 — Final Inspection (colour's Packaging).
//
// The rack meets the other lanes' output, then the inspector runs each
// sort across the surface plate: cap-height ground to seat exactly on the
// 4px baseline grid (the text-box: trim-both step). Box sealed →
// variables.css.
//
// Beat mapping:
//   0 — the other-lane materials arrive alongside our sort
//   1 — surface plate: baseline grid on, the sort snaps to the grid line
//   2 — box sealed, variables.css

export function Inspection({ activeBeatIdx }: { activeBeatIdx: number }) {
  const ground = activeBeatIdx >= 1
  const sealed = activeBeatIdx >= 2

  return (
    <div className="inspection-scene">
      <SceneHeader pkg="@equinor/eds-tokens" title="INSPECTION" />

      <div className="inspection-stage">
        {!sealed && (
          <>
            <div className="inspection-lanes">
              <div className="inspection-lane">
                <Gemstone />
                <span>colours</span>
              </div>
              <div className="inspection-lane">
                <CordSprite />
                <span>s&amp;t prim.</span>
              </div>
              <div className="inspection-lane">
                <ClaspSprite />
                <span>foundations</span>
              </div>
              <div className="inspection-lane">
                <ChainSprite />
                <span>s&amp;t tokens</span>
              </div>
              <div className="inspection-lane">
                <LacquerSprite />
                <span>dynamic</span>
              </div>
            </div>

            <div className={`surface-plate ${ground ? 'is-on' : ''}`}>
              <div className={`inspection-sort ${ground ? 'is-ground' : ''}`}>
                <MetalSort />
              </div>
              {ground && <div className="baseline-line" />}
            </div>

            {ground && (
              <div className="inspection-callout">
                <span className="ic-key">text-box: trim-both</span>
                <span className="ic-note">cap-height → 4px baseline grid</span>
              </div>
            )}
          </>
        )}

        {sealed && (
          <div className="inspection-box">
            <div className="inspection-box-lid" />
            <div className="inspection-box-body">
              <span className="inspection-box-stamp">variables.css</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
