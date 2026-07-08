'use client'

import { useState } from 'react'
import { STEP_ROLES } from '@/utils/palette'
import { ContrastCard } from './ContrastCard'
import { StepSelect } from './StepSelect'

type Palette = { name: string; steps: string[] }

const DEFAULT_PAIRINGS = [
  { fg: 5, bg: 0 },
  { fg: 7, bg: 1 },
]

export function BordersOnBackgrounds({
  palettes,
}: {
  palettes: Palette[]
}) {
  const [pairings, setPairings] = useState(DEFAULT_PAIRINGS)

  const update = (idx: number, field: 'fg' | 'bg', value: number) => {
    setPairings((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)),
    )
  }

  return (
    <section className="rounded-xl border border-neutral-subtle bg-default p-5 flex flex-col gap-4">
      <div>
        <h2 className="text-base font-bold text-strong m-0">
          Borders on backgrounds
        </h2>
        <p className="text-sm text-subtle m-0 mt-1">
          Border visibility against canvas and surface backgrounds
        </p>
      </div>

      {pairings.map(({ fg, bg }, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <StepSelect
              label="border"
              value={fg}
              onChange={(v) => update(idx, 'fg', v)}
              recommended={[1, 3, 4, 6, 7]}
            />
            <StepSelect
              label="bg"
              value={bg}
              onChange={(v) => update(idx, 'bg', v)}
              recommended={[0, 1, 2, 5, 14]}
            />
          </div>

          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            }}
          >
            {palettes.map((p) => (
              <ContrastCard
                key={p.name}
                fgHex={p.steps[fg]}
                bgHex={p.steps[bg]}
                fgLabel={STEP_ROLES[fg]}
                bgLabel={STEP_ROLES[bg]}
                paletteName={p.name}
                previewType="border"
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
