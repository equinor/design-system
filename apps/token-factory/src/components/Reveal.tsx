import { Geode } from './Geode'
import { NestedStones } from './NestedStones'

// Scene 4 — The Reveal.
// Camera close-up on the geode. On beat 1 it cracks open, revealing
// three concentric stones inside. Beat 2 holds while the narrator
// teases "this token has three names" — sets up Scene 5 (The Peel)
// which names each layer.
//
// Beat mapping:
//   0 — Closed geode large in centre, gentle pulse.
//   1 — Geode shell fades away, three concentric stones visible.
//   2 — Hold. Soft glow pulse on the stones.

export function Reveal({ activeBeatIdx }: { activeBeatIdx: number }) {
  const opened = activeBeatIdx >= 1

  return (
    <div className="reveal-scene">
      <div className="reveal-title">★ INSPECTION ★</div>

      <div className="reveal-stage">
        {!opened && (
          <div className="reveal-geode-closed">
            <Geode />
          </div>
        )}
        {opened && (
          <div className="reveal-stones">
            <NestedStones highlight="none" />
            <div className="stones-label">three nested stones</div>
          </div>
        )}
      </div>
    </div>
  )
}
