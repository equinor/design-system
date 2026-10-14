'use client'

import { useState } from 'react'
import { add } from '@equinor/eds-icons'
import { stepLabel } from '@/config/config'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { Icon } from '@/components/shared/Icon'
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
    <Card
      title="Same-palette pairings"
      description="Test text & background from the same palette — useful for components where accent colours carry both roles"
    >
      <div className="flex flex-col gap-4">
        {pairings.map(({ fg, bg }, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePairing(idx)}
                >
                  Remove
                </Button>
              )}
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
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

        <Button size="sm" onClick={addPairing} className="self-start">
          <Icon data={add} size={16} />
          Add pairing
        </Button>
      </div>
    </Card>
  )
}
