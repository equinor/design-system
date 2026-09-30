'use client'

import { useId } from 'react'
import Color from 'colorjs.io'
import { delete_to_trash } from '@equinor/eds-icons'
import { contrast } from '@/utils/color'
import {
  PALETTE_STEPS,
  categoryLabel,
  stepCategoryRuns,
  stepLabel,
  stepRolesText,
} from '@/config/config'
import type { TokenPalette } from '@/utils/palette'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { Icon } from '@/components/shared/Icon'

export type PaletteViewMode = 'curve' | 'gradient'

// Grouped header runs, e.g. Background (1–3), Border (4), …
const CATEGORY_RUNS = stepCategoryRuns()

function getLightness(hex: string): number {
  try {
    return new Color(hex).to('oklch').l ?? 0
  } catch {
    return 0
  }
}

function labelColor(hex: string): string {
  try {
    const wcag = parseFloat(
      String(
        contrast({
          foreground: '#ffffff',
          background: hex,
          algorithm: 'WCAG21',
          silent: true,
        }),
      ),
    )
    return wcag >= 3 ? '#fff' : '#000'
  } catch {
    return '#000'
  }
}

function isValidHex(v: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(v)
}

export function PaletteCard({
  palette,
  index,
  viewMode,
  onNameChange,
  onRemove,
  onStepChange,
}: {
  palette: TokenPalette
  index: number
  viewMode: PaletteViewMode
  onNameChange: (index: number, name: string) => void
  onRemove: (index: number) => void
  onStepChange: (paletteIndex: number, stepIndex: number, hex: string) => void
}) {
  const inputId = useId()
  const sorted =
    viewMode === 'curve'
      ? palette.steps.map((hex, i) => ({ hex, i }))
      : palette.steps
          .map((hex, i) => ({ hex, i }))
          .sort((a, b) => getLightness(b.hex) - getLightness(a.hex))

  return (
    <Card padded={false} className="overflow-hidden">
      {/* Palette header */}
      <div className="flex items-center gap-3 border-b border-muted px-5 py-3">
        <input
          type="text"
          value={palette.name}
          onChange={(e) => onNameChange(index, e.target.value)}
          aria-label="Palette name"
          className="w-52 rounded border border-transparent bg-transparent px-1 py-1 text-lg font-medium text-primary hover:border-input"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          aria-label={`Remove ${palette.name || 'palette'}`}
          className="ml-auto"
        >
          <Icon data={delete_to_trash} size={16} />
          Remove
        </Button>
      </div>

      {/* Color strip */}
      <div className="px-5 pt-4">
        <div className="grid grid-cols-15 gap-0.5">
          {/* Category group headers (curve mode only) */}
          {viewMode === 'curve' &&
            CATEGORY_RUNS.map((run, i) => (
              <div
                key={`${run.category}-${i}`}
                className="pb-1.5 text-center"
                style={{ gridColumn: `span ${run.span}` }}
              >
                <span className="text-xs text-secondary">
                  {categoryLabel(run.category)}
                </span>
                <div className="mt-0.5 border-t border-default" />
              </div>
            ))}

          {/* Swatch cells */}
          {sorted.map(({ hex, i: origIdx }, displayIdx) => (
            <div
              key={`strip-${origIdx}`}
              className={[
                'flex h-16 flex-col items-center justify-end pb-1',
                displayIdx === 0 ? 'rounded-l' : '',
                displayIdx === 14 ? 'rounded-r' : '',
              ].join(' ')}
              style={{ backgroundColor: hex }}
              title={`${stepLabel(origIdx + 1)}: ${hex}\n${stepRolesText(origIdx + 1)}`}
            >
              {/* Label colour picked for contrast with the swatch */}
              <span
                className="text-xs font-medium opacity-90"
                style={{ color: labelColor(hex) }}
              >
                {origIdx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hex input grid */}
      <div className="grid grid-cols-5 gap-2 px-5 pt-4 pb-5">
        {sorted.map(({ hex, i: origIdx }) => {
          const valid = isValidHex(hex)
          return (
            <div key={`input-${origIdx}`}>
              <label
                htmlFor={`${inputId}-${origIdx}`}
                className="mb-0.5 block text-xs leading-snug text-secondary"
              >
                <strong className="font-medium text-primary">
                  {origIdx + 1}
                </strong>{' '}
                {PALETTE_STEPS[origIdx]?.label}
              </label>
              <div className="flex items-center gap-1">
                <span
                  className="inline-block size-4 shrink-0 rounded border border-muted"
                  style={{ backgroundColor: hex }}
                />
                <input
                  id={`${inputId}-${origIdx}`}
                  type="text"
                  value={hex}
                  onChange={(e) => {
                    const v = e.target.value
                    onStepChange(index, origIdx, v)
                  }}
                  aria-invalid={!valid}
                  className={[
                    'w-full min-w-0 rounded border bg-input px-1.5 py-1 font-mono text-sm text-primary',
                    valid
                      ? 'border-input hover:border-input-hover'
                      : 'border-danger',
                  ].join(' ')}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
