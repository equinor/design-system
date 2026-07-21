'use client'

import { useState } from 'react'
import { STEP_ROLES, roleIndex, type StepRole, type TokenPalette } from '@/utils/palette'
import { PairingCard } from './PairingCard'

const FG_ROLES = STEP_ROLES.filter(
  (r) => r.startsWith('text-') || r.startsWith('border-'),
)
const BG_ROLES = STEP_ROLES.filter((r) => r.startsWith('bg-'))

export function InteractivePicker({
  allPalettes,
}: {
  allPalettes: TokenPalette[]
}) {
  const [fgRole, setFgRole] = useState<StepRole>('12 · fg/strong')
  const [bgRole, setBgRole] = useState<StepRole>('1 · bg/canvas')

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
          <label className="flex items-center gap-2" style={{ fontSize: '13px' }}>
            <span style={{ color: '#6b7280', fontWeight: 500 }}>Foreground</span>
            <select
              value={fgRole}
              onChange={(e) => setFgRole(e.target.value as StepRole)}
              style={{
                padding: '6px 10px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1.5px solid #d1d5db',
                background: '#fff',
                fontFamily: 'var(--font-geist-mono, monospace)',
              }}
            >
              {FG_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <span style={{ color: '#d1d5db', fontSize: '18px' }}>on</span>

          <label className="flex items-center gap-2" style={{ fontSize: '13px' }}>
            <span style={{ color: '#6b7280', fontWeight: 500 }}>Background</span>
            <select
              value={bgRole}
              onChange={(e) => setBgRole(e.target.value as StepRole)}
              style={{
                padding: '6px 10px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1.5px solid #d1d5db',
                background: '#fff',
                fontFamily: 'var(--font-geist-mono, monospace)',
              }}
            >
              {BG_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
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
            const fgHex = pal.steps[roleIndex(fgRole)]
            const bgHex = pal.steps[roleIndex(bgRole)]

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
                  fgRole={fgRole}
                  bgRole={bgRole}
                  fgHex={fgHex}
                  bgHex={bgHex}
                  type={fgRole.startsWith('border-') ? 'border' : 'text'}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
