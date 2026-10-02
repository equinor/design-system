'use client'

import { useState } from 'react'
import { PALETTE_STEPS, stepLabel, stepRolesText } from '@/config/config'
import { Card } from '@/components/shared/Card'
import { ContrastCard } from './ContrastCard'

const SELECT_CLASS =
  'rounded border border-input bg-input px-2 py-1 text-sm text-primary hover:border-input-hover'

type Palette = { name: string; steps: string[] }

export function InteractivePicker({ palettes }: { palettes: Palette[] }) {
  // 0-based: step 13 (text.primary) on step 1 (background.canvas)
  const [fgStep, setFgStep] = useState(12)
  const [bgStep, setBgStep] = useState(0)

  return (
    <Card
      title="Data colour picker"
      description="Test any fg/bg combination for chips, badges, graphs — all palettes side by side"
    >
      <div className="mb-4 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-primary">
          <span className="font-medium">Foreground</span>
          <select
            value={fgStep}
            onChange={(e) => setFgStep(Number(e.target.value))}
            className={SELECT_CLASS}
          >
            {PALETTE_STEPS.map((step, i) => (
              <option key={step.id} value={i} title={stepRolesText(step.step)}>
                {stepLabel(step.step)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-primary">
          <span className="font-medium">Background</span>
          <select
            value={bgStep}
            onChange={(e) => setBgStep(Number(e.target.value))}
            className={SELECT_CLASS}
          >
            {PALETTE_STEPS.map((step, i) => (
              <option key={step.id} value={i} title={stepRolesText(step.step)}>
                {stepLabel(step.step)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
        {palettes.map((p) => (
          <ContrastCard
            key={p.name}
            fgHex={p.steps[fgStep]}
            bgHex={p.steps[bgStep]}
            fgLabel={stepLabel(fgStep + 1)}
            bgLabel={stepLabel(bgStep + 1)}
            paletteName={p.name}
          />
        ))}
      </div>
    </Card>
  )
}
