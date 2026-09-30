'use client'

import { useState } from 'react'
import {
  PALETTE_STEPS,
  stepLabel,
  stepRolesText,
  stepsWithRole,
} from '@/config/config'
import type { TokenPalette } from '@/utils/palette'
import { Card } from '@/components/shared/Card'
import { PairingCard } from './PairingCard'

// Steps some Tokens Studio text, icon or border role uses, and steps some
// background role uses (1-based)
const FG_STEPS = PALETTE_STEPS.filter((step) =>
  [...stepsWithRole('text'), ...stepsWithRole('border')].includes(step),
).map((step) => step.step)
const BG_STEPS = stepsWithRole('background').map((step) => step.step)

/** Preview a step as a border when its main Tokens Studio role is a border. */
const previewType = (step: number): 'text' | 'border' =>
  PALETTE_STEPS[step - 1]?.category === 'border' ? 'border' : 'text'

const SELECT_CLASS =
  'rounded border border-input bg-input px-2 py-1 font-mono text-sm text-primary hover:border-input-hover'

export function InteractivePicker({
  allPalettes,
}: {
  allPalettes: TokenPalette[]
}) {
  // text.primary (13) on background.canvas (1)
  const [fgStep, setFgStep] = useState(13)
  const [bgStep, setBgStep] = useState(1)

  return (
    <Card
      title="Interactive picker"
      description="Select any foreground and background variable to test contrast"
      className="mt-12"
      padded={false}
    >
      {/* Selector row */}
      <div className="flex flex-wrap items-center gap-4 border-y border-muted px-5 py-4">
        <label className="flex items-center gap-2 text-base">
          <span className="font-medium text-secondary">Foreground</span>
          <select
            value={fgStep}
            onChange={(e) => setFgStep(Number(e.target.value))}
            className={SELECT_CLASS}
          >
            {FG_STEPS.map((step) => (
              <option key={step} value={step} title={stepRolesText(step)}>
                {stepLabel(step)}
              </option>
            ))}
          </select>
        </label>

        <span className="text-lg text-tertiary">on</span>

        <label className="flex items-center gap-2 text-base">
          <span className="font-medium text-secondary">Background</span>
          <select
            value={bgStep}
            onChange={(e) => setBgStep(Number(e.target.value))}
            className={SELECT_CLASS}
          >
            {BG_STEPS.map((step) => (
              <option key={step} value={step} title={stepRolesText(step)}>
                {stepLabel(step)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Results for each palette */}
      <div
        className="grid divide-x divide-muted"
        style={{
          gridTemplateColumns: `repeat(${allPalettes.length}, 1fr)`,
        }}
      >
        {allPalettes.map((pal, i) => {
          const fgHex = pal.steps[fgStep - 1]
          const bgHex = pal.steps[bgStep - 1]

          return (
            <div key={`${pal.name}-${i}`} className="px-5 py-4">
              <div className="mb-3 text-sm font-medium text-secondary">
                {pal.name}
              </div>
              <PairingCard
                fgRole={stepLabel(fgStep)}
                bgRole={stepLabel(bgStep)}
                fgHex={fgHex}
                bgHex={bgHex}
                type={previewType(fgStep)}
              />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
