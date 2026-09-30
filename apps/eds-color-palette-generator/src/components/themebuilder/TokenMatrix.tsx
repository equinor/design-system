'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { contrast } from '@/utils/color'
import {
  PALETTE_STEPS,
  categoryLabel,
  stepCategoryRuns,
  stepLabel,
  stepRolesText,
} from '@/config/config'
import { Card } from '@/components/shared/Card'

type GeneratedPalette = {
  name: string
  steps: string[]
}

type TokenMatrixProps = {
  palettes: GeneratedPalette[]
}

// Grouped header runs, e.g. Background (1–3), Border (4), …
const CATEGORY_RUNS = stepCategoryRuns()

function getTextColor(bgHex: string): string {
  const whiteContrast = parseFloat(
    String(
      contrast({
        foreground: '#ffffff',
        background: bgHex,
        algorithm: 'WCAG21',
        silent: true,
      }),
    ),
  )
  return whiteContrast >= 3 ? '#fff' : '#000'
}

export function TokenMatrix({ palettes }: TokenMatrixProps) {
  if (palettes.length === 0) return null

  return (
    <Card title="Token matrix">
      {/* Padding keeps the swatches' focus ring inside the scroll area */}
      <div className="overflow-x-auto p-1">
        <div className="grid grid-cols-[minmax(100px,auto)_repeat(15,minmax(58px,1fr))] gap-0.5">
          {/* Category group headers */}
          {/* Spacer for row label column */}
          <div />
          {CATEGORY_RUNS.map((run, i) => (
            <div
              key={`${run.category}-${i}`}
              className="pb-1 text-center text-xs whitespace-nowrap text-secondary"
              style={{ gridColumn: `span ${run.span}` }}
            >
              {categoryLabel(run.category)}
              <div className="mt-0.5 border-t border-muted" />
            </div>
          ))}

          {/* Step number + label headers */}
          <div />
          {PALETTE_STEPS.map((step) => (
            <div
              key={step.id}
              className="pb-1 text-center text-[8px] leading-[1.2] text-secondary"
              title={`Step ${step.step}: ${stepRolesText(step.step)}`}
            >
              <div className="font-medium">{step.label}</div>
              <div className="opacity-50">{step.step}</div>
            </div>
          ))}

          {/* Palette rows */}
          {palettes.map((palette) => (
            <PaletteRow key={palette.name} palette={palette} />
          ))}
        </div>
      </div>
    </Card>
  )
}

function PaletteRow({ palette }: { palette: GeneratedPalette }) {
  const textColors = useMemo(
    () => palette.steps.map(getTextColor),
    [palette.steps],
  )
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear the pending "Copied!" reset timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleCopy = useCallback(async (hex: string, i: number) => {
    try {
      await navigator.clipboard.writeText(hex)
    } catch {
      // Clipboard unavailable (e.g. non-secure context) — nothing to show
      return
    }
    setCopiedIndex(i)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopiedIndex(null), 1200)
  }, [])

  return (
    <>
      <div className="flex items-center pr-2 text-sm font-medium whitespace-nowrap">
        {palette.name}
      </div>
      {palette.steps.map((hex, i) => {
        const isCopied = copiedIndex === i
        return (
          <button
            type="button"
            key={`${palette.name}-${i}`}
            onClick={() => handleCopy(hex, i)}
            className={[
              'flex h-11 cursor-pointer appearance-none items-center justify-center border-0 px-0.5 font-mono text-[9px] font-medium whitespace-nowrap tabular-nums focus-visible:relative focus-visible:z-10',
              i === 0 ? 'rounded-l' : '',
              i === palette.steps.length - 1 ? 'rounded-r' : '',
            ].join(' ')}
            style={{ backgroundColor: hex, color: textColors[i] }}
            title={`${stepLabel(i + 1)}: ${hex} — click to copy`}
            aria-label={`Copy ${palette.name} step ${stepLabel(i + 1)}: ${hex}`}
          >
            {isCopied ? 'Copied!' : hex}
          </button>
        )
      })}
    </>
  )
}
