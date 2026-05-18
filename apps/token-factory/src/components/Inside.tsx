import { Crate } from './Crate'

// Scene 2 — Inside the Factory.
// Transition beat. The crate is now inside; the camera follows it
// while machinery silhouettes parallax past behind. The crate stays
// centred on the belt — the world moves, not the crate.
//
// Beat mapping:
//   0 — Crate visible centred on belt, machinery scrolls past behind.
//   1 — A name tag appears above the crate: "bg-floating".
//   2 — Hold. Narrator says "bg-floating doesn't know what he is yet."

export function Inside({ activeBeatIdx }: { activeBeatIdx: number }) {
  const showNameTag = activeBeatIdx >= 1

  return (
    <div className="inside-scene">
      {/* far-back machinery silhouettes — scroll slowly */}
      <div className="inside-machinery inside-machinery-far">
        <div className="machinery-tower mt-far-1" />
        <div className="machinery-pipe mp-far-1" />
        <div className="machinery-tower mt-far-2" />
        <div className="machinery-pipe mp-far-2" />
        <div className="machinery-tower mt-far-3" />
      </div>

      {/* mid machinery — scroll faster */}
      <div className="inside-machinery inside-machinery-near">
        <div className="machinery-tower mt-near-1" />
        <div className="machinery-pipe mp-near-1" />
        <div className="machinery-tower mt-near-2" />
        <div className="machinery-pipe mp-near-2" />
      </div>

      {/* the conveyor belt running the full width */}
      <div className="inside-belt">
        <div className="belt-strip" />
      </div>

      {/* the crate — fixed centre, name tag appears at beat 1 */}
      <div className="inside-crate">
        <Crate />
        <div className="crate-travel-label">color scheme</div>
        {showNameTag && (
          <div className="crate-name-tag">
            <span className="tag-key">name:</span>
            <span className="tag-value">bg-floating</span>
          </div>
        )}
      </div>
    </div>
  )
}
