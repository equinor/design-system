import { Crate } from './Crate'
import { SceneHeader } from './SceneHeader'

// Scene 2 — Inside the Factory.
// Transition beat. Camera follows the crate; machinery silhouettes
// parallax past behind on two layers. The crate stays centred — the
// world moves.
//
// Parallax loop trick: each machinery layer renders TWO identical tiles
// side-by-side. The container animates translateX(-50%) per loop, so
// when tile-1 has shifted fully off-screen left, tile-2 occupies its
// exact starting position. Snap back to 0% is visually identical.
//
// Beat mapping:
//   0 — Crate visible centred on belt, machinery scrolls past.
//   1 — Name tag pops in: "NAME: BG-FLOATING".
//   2 — Hold. Narrator says "bg-floating doesn't know what he is yet."

function FarMachineryTile() {
  return (
    <div className="machinery-tile">
      <div className="machinery-tower mt-far-1" />
      <div className="machinery-pipe mp-far-1" />
      <div className="machinery-tower mt-far-2" />
      <div className="machinery-pipe mp-far-2" />
      <div className="machinery-tower mt-far-3" />
    </div>
  )
}

function NearMachineryTile() {
  return (
    <div className="machinery-tile">
      <div className="machinery-tower mt-near-1" />
      <div className="machinery-pipe mp-near-1" />
      <div className="machinery-tower mt-near-2" />
      <div className="machinery-pipe mp-near-2" />
    </div>
  )
}

export function Inside({ activeBeatIdx }: { activeBeatIdx: number }) {
  const showNameTag = activeBeatIdx >= 1

  return (
    <div className="inside-scene">
      <SceneHeader pkg="@equinor/eds-tokens" title="INSIDE THE FACTORY" />
      {/* far-back machinery silhouettes — two tiles, slow scroll */}
      <div className="inside-machinery inside-machinery-far">
        <FarMachineryTile />
        <FarMachineryTile />
      </div>

      {/* mid machinery — two tiles, faster scroll */}
      <div className="inside-machinery inside-machinery-near">
        <NearMachineryTile />
        <NearMachineryTile />
      </div>

      {/* the conveyor belt running the full width */}
      <div className="inside-belt">
        <div className="belt-strip" />
      </div>

      {/* the crate — fixed centre, name tag appears at beat 1 */}
      <div className="inside-crate">
        <Crate />
        <div className="crate-travel-label">static</div>
        {showNameTag && (
          <div className="crate-name-tag">
            <span className="tag-key">file:</span>
            <span className="tag-value">Concept.Mode 1.json</span>
          </div>
        )}
      </div>
    </div>
  )
}
