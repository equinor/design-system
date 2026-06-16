import { useEffect, useState } from 'react'
import { GaugeRack } from '../../sprites/GaugeRack'
import { SceneHeader } from '../../chrome/SceneHeader'
import './density-dial.css'

// Typography Scene 6 — The Density Dial. The hero scene.
//
// Typography's equivalent of colour's light/dark twist. There isn't one
// size — there's a dial. Turning it from spacious to comfortable drops
// the master measure (16 → 14) and the WHOLE rack re-mills smaller
// (md 14 → 12) from that single change. One dial, nothing else touched.
//
// Beat mapping (deliberate pacing):
//   0 — dial at spacious, full-size rack, master 16 / md 14
//   1 — dial turns to comfortable; master drops to 14
//   2 — the rack re-mills live (oscillates) so the cascade is visible
//   3 — hold

type Density = 'spacious' | 'comfortable'

const SETTINGS: Record<Density, { master: number; md: number; scale: number }> =
  {
    spacious: { master: 16, md: 14, scale: 1 },
    comfortable: { master: 14, md: 12, scale: 0.875 },
  }

const PERIOD_MS = 1600

export function DensityDial({ activeBeatIdx }: { activeBeatIdx: number }) {
  const turned = activeBeatIdx >= 1
  const live = activeBeatIdx >= 2

  const [density, setDensity] = useState<Density>('spacious')

  useEffect(() => {
    if (!live) {
      setDensity(turned ? 'comfortable' : 'spacious')
      return
    }
    const id = setInterval(() => {
      setDensity((d) => (d === 'spacious' ? 'comfortable' : 'spacious'))
    }, PERIOD_MS)
    return () => clearInterval(id)
  }, [live, turned])

  const s = SETTINGS[density]

  return (
    <div className="density-dial-scene">
      <SceneHeader pkg="@equinor/eds-tokens-build" title="THE DENSITY DIAL" />

      <div className="density-dial-stage">
        <div className="dial" data-density={density}>
          <div className="dial-stops">
            <span className="dial-stop" data-on={density === 'spacious'}>
              SPACIOUS
            </span>
            <span className="dial-stop" data-on={density === 'comfortable'}>
              COMFORTABLE
            </span>
            <span className="dial-stop dial-stop-muted">RELAXED</span>
          </div>
          <div className="dial-track">
            <div className="dial-knob" />
          </div>
        </div>

        <div className="dial-readout">
          <span className="dial-readout-key">MASTER</span>
          <span className="dial-readout-val">{s.master}px</span>
        </div>

        <div className="dial-rack">
          <GaugeRack highlight="md" scale={s.scale} />
        </div>

        <div className="dial-md">md = {s.md}px</div>
      </div>
    </div>
  )
}
