'use client'

import { useState } from 'react'
import { STEP_ROLES } from '@/utils/palette'
import { ContrastCard } from './ContrastCard'
import { StepSelect } from './StepSelect'

type Palette = { name: string; steps: string[] }

const DEFAULT_PAIRINGS = [
  { fg: 11, bg: 0, label: 'Text on canvas' },
  { fg: 11, bg: 1, label: 'Text on surface' },
  { fg: 14, bg: 8, label: 'White on emphasis' },
  { fg: 6, bg: 0, label: 'Border on canvas' },
]

export function SamePalettePairings({
  palettes,
}: {
  palettes: Palette[]
}) {
  const [pairings, setPairings] = useState(DEFAULT_PAIRINGS)

  const update = (
    idx: number,
    field: 'fg' | 'bg',
    value: number,
  ) => {
    setPairings((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)),
    )
  }

  const addPairing = () => {
    setPairings((prev) => [...prev, { fg: 11, bg: 0, label: '' }])
  }

  const removePairing = (idx: number) => {
    if (pairings.length <= 1) return
    setPairings((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <section className="rounded-xl border border-neutral-subtle bg-default p-5 flex flex-col gap-4">
      <div>
        <h2 className="text-base font-bold text-strong m-0">
          Same-palette pairings
        </h2>
        <p className="text-sm text-subtle m-0 mt-1">
          Test text &amp; background from the same palette — useful for
          components where accent colors carry both roles
        </p>
      </div>

      {pairings.map(({ fg, bg }, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <StepSelect
              label="fg"
              value={fg}
              onChange={(v) => update(idx, 'fg', v)}
            />
            <StepSelect
              label="bg"
              value={bg}
              onChange={(v) => update(idx, 'bg', v)}
            />
            {pairings.length > 1 && (
              <button
                type="button"
                onClick={() => removePairing(idx)}
                className="cursor-pointer px-2 py-1 text-xs rounded border border-neutral-subtle bg-transparent text-subtle hover:text-strong"
              >
                Remove
              </button>
            )}
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
              />
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addPairing}
        className="self-start cursor-pointer px-3 py-1.5 text-xs font-medium rounded-lg border border-dashed border-neutral-subtle bg-transparent text-subtle hover:text-strong transition-colors"
      >
        + Add pairing
      </button>
    </section>
  )
}
