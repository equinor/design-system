'use client'

import { useState } from 'react'
import { LoginFormPreview } from './LoginFormPreview'
import { DataTablePreview } from './DataTablePreview'
import { CardPreview } from './CardPreview'
import { ButtonPreview } from './ButtonPreview'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { getSemanticColors } from '@/config/semanticColors'

type GeneratedPalette = {
  name: string
  steps: string[]
}

type ComponentPreviewPanelProps = {
  palettes: GeneratedPalette[]
}

// Gray is always the neutral — find it by name
function findNeutralIndex(palettes: GeneratedPalette[]): number {
  const grayIdx = palettes.findIndex(
    (p) =>
      p.name.toLowerCase().includes('gray') ||
      p.name.toLowerCase().includes('grey'),
  )
  return grayIdx >= 0 ? grayIdx : 0
}

// Default accent: first non-gray palette, else the neutral itself
function defaultAccentIndex(palettes: GeneratedPalette[]): number {
  if (palettes.length === 0) return 0
  const neutralIdx = findNeutralIndex(palettes)
  const firstNonNeutral = palettes.findIndex((_, i) => i !== neutralIdx)
  return firstNonNeutral >= 0 ? firstNonNeutral : neutralIdx
}

export function ComponentPreviewPanel({
  palettes,
}: ComponentPreviewPanelProps) {
  const [accentIdx, setAccentIdx] = useState(() => defaultAccentIndex(palettes))
  const { colorScheme } = useColorScheme()
  // Canonical EDS semantic colours (from Figma Color Map) — the previews use
  // these directly so they render like real EDS variable usage.
  const colors = getSemanticColors(colorScheme)

  if (palettes.length === 0) return null

  const neutralIdx = findNeutralIndex(palettes)
  const neutral = palettes[neutralIdx].steps

  // Non-gray palettes are candidates for accent
  const accentCandidates = palettes
    .map((p, i) => ({ ...p, idx: i }))
    .filter((_, i) => i !== neutralIdx)

  // All palettes except Gray and the selected accent are data colors
  const dataColors = palettes.filter(
    (_, i) => i !== neutralIdx && i !== accentIdx,
  )

  return (
    <div className="flex flex-col gap-8">
      {/* Role selector */}
      <section className="rounded-xl border border-neutral-subtle bg-default p-5">
        <h2 className="font-semibold text-sm mb-3">Palette Roles</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-3 items-center">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-subtle font-medium">Neutral</span>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono"
              style={{
                backgroundColor: neutral[2],
                color: neutral[12],
                border: `1px solid ${neutral[5]}`,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '3px',
                  backgroundColor: neutral[8],
                }}
              />
              {palettes[neutralIdx].name}
            </span>
          </div>

          <label className="flex items-center gap-2 text-xs">
            <span className="text-subtle font-medium">Accent</span>
            <select
              value={accentIdx}
              onChange={(e) => setAccentIdx(Number(e.target.value))}
              className="px-2 py-1 text-xs rounded-md border border-neutral-subtle bg-default font-mono"
            >
              {accentCandidates.map((p) => (
                <option key={p.idx} value={p.idx}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          {dataColors.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-subtle">
              <span className="font-medium">Data colors:</span>
              {dataColors.map((p) => (
                <span
                  key={p.name}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs"
                  style={{
                    backgroundColor: p.steps[2],
                    color: p.steps[12],
                    border: `1px solid ${p.steps[5]}`,
                  }}
                >
                  {p.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="font-semibold text-sm mb-3">Buttons</h2>
        <ButtonPreview colors={colors} />
      </section>

      {/* Login Form */}
      <section>
        <h2 className="font-semibold text-sm mb-3">Login Form</h2>
        <LoginFormPreview colors={colors} />
      </section>

      {/* Data Table */}
      <section>
        <h2 className="font-semibold text-sm mb-3">Data Table</h2>
        <DataTablePreview colors={colors} />
      </section>

      {/* Cards */}
      <section>
        <h2 className="font-semibold text-sm mb-3">Article Cards</h2>
        <CardPreview colors={colors} />
      </section>
    </div>
  )
}
