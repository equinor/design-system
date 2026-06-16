import { Crate } from '../../sprites/Crate'
import { SceneHeader } from '../../chrome/SceneHeader'
import './foundry-inside.css'

// Typography Scene 2 — Inside the Foundry.
//
// The colour lane's Inside carries the crate "deeper into the factory".
// Here the same belt routes it into the MACHINE SHOP wing — steel
// machinery instead of the gem hall, signalling early that this is a
// different production line. The crate carries the two s&t Figma files;
// we follow ui-body / md.
//
// Not a reuse of the colours-static Inside: that component hardcodes
// colour-specific labels ("static", "Concept.Mode 1.json"). Kept
// separate so the colour scene stays untouched.
//
// Beat mapping:
//   0 — crate on the belt, MACHINE SHOP sign overhead, machinery scrolls
//   1 — part tag pops: "ui-body / md"
//   2 — hold

export function FoundryInside({ activeBeatIdx }: { activeBeatIdx: number }) {
  const showPartTag = activeBeatIdx >= 1

  return (
    <div className="foundry-inside-scene">
      <SceneHeader pkg="@equinor/eds-tokens" title="INSIDE THE FOUNDRY" />

      <div className="foundry-inside-stage">
        <div className="machine-shop-sign">▎ MACHINE SHOP ▎</div>

        {/* Steel machinery silhouettes — two tiles, slow scroll. */}
        <div className="foundry-machinery">
          <div className="foundry-machinery-tile">
            <div className="foundry-rig fr-1" />
            <div className="foundry-rig fr-2" />
            <div className="foundry-rig fr-3" />
          </div>
          <div className="foundry-machinery-tile">
            <div className="foundry-rig fr-1" />
            <div className="foundry-rig fr-2" />
            <div className="foundry-rig fr-3" />
          </div>
        </div>

        <div className="foundry-inside-belt">
          <div className="belt-strip" />
        </div>

        <div className="foundry-inside-crate">
          <Crate />
          <div className="crate-travel-label">s&amp;t tokens</div>
          {showPartTag && (
            <div className="foundry-part-tag">
              <span className="tag-key">part:</span>
              <span className="tag-value">ui-body / md</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
