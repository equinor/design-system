'use client'

import { useState } from 'react'
import { PALETTE_STEPS, stepLabel, stepRolesText } from '@/config/config'
import { ContrastCard } from './ContrastCard'

type Palette = { name: string; steps: string[] }

export function InteractivePicker({ palettes }: { palettes: Palette[] }) {
  // 0-based: step 13 (text.primary) on step 1 (background.canvas)
  const [fgStep, setFgStep] = useState(12)
  const [bgStep, setBgStep] = useState(0)

  return (
    <section className="rounded-xl border border-neutral-subtle bg-default p-5 flex flex-col gap-4">
      <div>
        <h2 className="text-base font-bold text-strong m-0">
          Data colour picker
        </h2>
        <p className="text-sm text-subtle m-0 mt-1">
          Test any fg/bg combination for chips, badges, graphs — all palettes
          side by side
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-xs text-strong">
          <span className="font-medium">Foreground</span>
          <select
            value={fgStep}
            onChange={(e) => setFgStep(Number(e.target.value))}
            className="rounded border border-neutral-subtle bg-default text-xs px-2 py-1"
          >
            {PALETTE_STEPS.map((step, i) => (
              <option key={step.id} value={i} title={stepRolesText(step.step)}>
                {stepLabel(step.step)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs text-strong">
          <span className="font-medium">Background</span>
          <select
            value={bgStep}
            onChange={(e) => setBgStep(Number(e.target.value))}
            className="rounded border border-neutral-subtle bg-default text-xs px-2 py-1"
          >
            {PALETTE_STEPS.map((step, i) => (
              <option key={step.id} value={i} title={stepRolesText(step.step)}>
                {stepLabel(step.step)}
              </option>
            ))}
          </select>
        </label>
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
            fgHex={p.steps[fgStep]}
            bgHex={p.steps[bgStep]}
            fgLabel={stepLabel(fgStep + 1)}
            bgLabel={stepLabel(bgStep + 1)}
            paletteName={p.name}
          />
        ))}
      </div>
    </section>
  )
}
