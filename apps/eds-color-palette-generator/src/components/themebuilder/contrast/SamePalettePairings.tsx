'use client'

import { useState } from 'react'
import { stepLabel } from '@/config/config'
import { ContrastCard } from './ContrastCard'
import { StepSelect } from './StepSelect'

type Palette = { name: string; steps: string[] }

// 0-based step indices, one palette at a time, named after the Tokens Studio
// roles each pair stands for.
const DEFAULT_PAIRINGS = [
  { fg: 12, bg: 0, label: 'text.primary (13) on background.canvas (1)' },
  { fg: 12, bg: 14, label: 'text.primary (13) on background.surface (15)' },
  {
    fg: 14,
    bg: 8,
    label: 'text.on-emphasis (15) on the emphasis default fill (9)',
  },
  {
    fg: 6,
    bg: 0,
    label: 'border.non-interactive.default (7) on background.canvas (1)',
  },
]

export function SamePalettePairings({ palettes }: { palettes: Palette[] }) {
  const [pairings, setPairings] = useState(DEFAULT_PAIRINGS)

  const update = (idx: number, field: 'fg' | 'bg', value: number) => {
    setPairings((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)),
    )
  }

  const addPairing = () => {
    setPairings((prev) => [...prev, { fg: 12, bg: 0, label: '' }])
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
          components where accent colours carry both roles
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
                fgLabel={stepLabel(fg + 1)}
                bgLabel={stepLabel(bg + 1)}
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
