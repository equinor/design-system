import { Crate } from '../../sprites/Crate'
import { SceneHeader } from '../../chrome/SceneHeader'
import './billet.css'

// Typography Scene 3 — The Billet.
//
// The colour lane's Crack reveals a glowing geode — the value already
// inside, waiting to be peeled to. Here the crate opens to a dull, blank
// billet: raw stock with no dimensions. The visual anticlimax IS the
// teach — typography's value doesn't exist yet, it gets machined.
//
// Beat mapping:
//   0 — crate under the press, belt still
//   1 — SLAM: press head drops
//   2 — crate splits; a blank billet sits inside (no glow), "no
//       dimensions yet" tag

export function Billet({ activeBeatIdx }: { activeBeatIdx: number }) {
  const isSlamming = activeBeatIdx === 1
  const isOpen = activeBeatIdx >= 2

  return (
    <div className="billet-scene">
      <SceneHeader pkg="@equinor/eds-tokens-build" title="THE BILLET" />

      <div className="billet-stage">
        <div className={`billet-press ${isSlamming ? 'is-slamming' : ''}`}>
          <div className="billet-press-arm" />
          <div className="billet-press-head" />
        </div>

        <div className="billet-floor">
          {!isOpen ? (
            <div className={`billet-crate ${isSlamming ? 'is-hit' : ''}`}>
              <Crate />
            </div>
          ) : (
            <div className="billet-open">
              <div className="billet-crate-half billet-crate-half-left" />
              <div className="billet-block">
                <span className="billet-block-face">?</span>
              </div>
              <div className="billet-crate-half billet-crate-half-right" />
            </div>
          )}

          {isOpen && (
            <div className="billet-tag">
              <span className="billet-tag-name">ui-body / md</span>
              <span className="billet-tag-note">no dimensions yet</span>
            </div>
          )}
        </div>

        <div className="billet-belt">
          <div className="belt-strip billet-belt-still" />
        </div>
      </div>
    </div>
  )
}
