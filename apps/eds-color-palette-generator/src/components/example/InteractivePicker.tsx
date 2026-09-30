'use client'

import { useState } from 'react'
import {
  PALETTE_STEPS,
  stepLabel,
  stepRolesText,
  stepsWithRole,
} from '@/config/config'
import type { TokenPalette } from '@/utils/palette'
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

export function InteractivePicker({
  allPalettes,
}: {
  allPalettes: TokenPalette[]
}) {
  // text.primary (13) on background.canvas (1)
  const [fgStep, setFgStep] = useState(13)
  const [bgStep, setBgStep] = useState(1)

  return (
    <section style={{ marginTop: '48px' }}>
      <h2 className="font-bold" style={{ fontSize: '15px', margin: '0 0 4px' }}>
        Interactive Picker
      </h2>
      <p
        style={{
          fontSize: '12px',
          color: '#6b7280',
          margin: '0 0 16px',
        }}
      >
        Select any foreground and background variable to test contrast
      </p>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid #e5e7eb', background: '#fff' }}
      >
        {/* Selector row */}
        <div
          className="flex items-center gap-4 flex-wrap"
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #f3f4f6',
          }}
        >
          <label
            className="flex items-center gap-2"
            style={{ fontSize: '13px' }}
          >
            <span style={{ color: '#6b7280', fontWeight: 500 }}>
              Foreground
            </span>
            <select
              value={fgStep}
              onChange={(e) => setFgStep(Number(e.target.value))}
              style={{
                padding: '6px 10px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1.5px solid #d1d5db',
                background: '#fff',
                fontFamily: 'var(--font-geist-mono, monospace)',
              }}
            >
              {FG_STEPS.map((step) => (
                <option key={step} value={step} title={stepRolesText(step)}>
                  {stepLabel(step)}
                </option>
              ))}
            </select>
          </label>

          <span style={{ color: '#d1d5db', fontSize: '18px' }}>on</span>

          <label
            className="flex items-center gap-2"
            style={{ fontSize: '13px' }}
          >
            <span style={{ color: '#6b7280', fontWeight: 500 }}>
              Background
            </span>
            <select
              value={bgStep}
              onChange={(e) => setBgStep(Number(e.target.value))}
              style={{
                padding: '6px 10px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1.5px solid #d1d5db',
                background: '#fff',
                fontFamily: 'var(--font-geist-mono, monospace)',
              }}
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
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${allPalettes.length}, 1fr)`,
            gap: '1px',
            background: '#f3f4f6',
          }}
        >
          {allPalettes.map((pal, i) => {
            const fgHex = pal.steps[fgStep - 1]
            const bgHex = pal.steps[bgStep - 1]

            return (
              <div
                key={`${pal.name}-${i}`}
                style={{ background: '#fff', padding: '16px 20px' }}
              >
                <div
                  className="font-semibold"
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '12px',
                  }}
                >
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
      </div>
    </section>
  )
}
