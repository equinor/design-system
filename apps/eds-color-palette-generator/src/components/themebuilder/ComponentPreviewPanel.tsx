'use client'

import { useState } from 'react'
import { LoginFormPreview } from './LoginFormPreview'
import { DataTablePreview } from './DataTablePreview'
import { CardPreview } from './CardPreview'
import { ButtonPreview } from './ButtonPreview'
import { useColorScheme } from '@/context/ColorSchemeContext'
import type { Scheme } from '@/config/tokensStudio'
import {
  findPaletteForTone,
  paletteForTone,
  resolveSemanticColors,
  toneRamps,
} from '@/utils/semanticTokens'

type GeneratedPalette = {
  name: string
  steps: string[]
}

type ComponentPreviewPanelProps = {
  palettes: GeneratedPalette[]
}

// Default accent: the palette that plays the accent tone in Tokens Studio
// (Moss Green), else the first palette that is not the neutral one.
function defaultAccentIndex(
  palettes: GeneratedPalette[],
  scheme: Scheme,
): number {
  const accent = findPaletteForTone(palettes, 'accent', scheme)
  if (accent) return palettes.indexOf(accent)
  const neutral = findPaletteForTone(palettes, 'neutral', scheme)
  const firstOther = palettes.findIndex((p) => p !== neutral)
  return firstOther >= 0 ? firstOther : 0
}

export function ComponentPreviewPanel({
  palettes,
}: ComponentPreviewPanelProps) {
  const { colorScheme } = useColorScheme()
  const [accentIdx, setAccentIdx] = useState(() =>
    defaultAccentIndex(palettes, colorScheme),
  )

  if (palettes.length === 0) return null

  // Neutral follows Tokens Studio: Gray in light, North Sea in dark. When the
  // user has no palette with that name, the Tokens Studio default is used.
  const neutralPalette = paletteForTone(palettes, 'neutral', colorScheme)
  const neutralIsDefault = !palettes.includes(neutralPalette)
  const neutral = neutralPalette.steps

  const safeAccentIdx =
    accentIdx < palettes.length
      ? accentIdx
      : defaultAccentIndex(palettes, colorScheme)
  const chosen = palettes[safeAccentIdx]

  // The previews read Tokens Studio semantic tokens, resolved against the
  // user's palettes: the chosen palette plays the accent tone, the neutral
  // palette plays neutral, and the status tones use the palettes named after
  // their Tokens Studio hues (or the Tokens Studio defaults).
  const colors = resolveSemanticColors(
    toneRamps(colorScheme, palettes, {
      accent: chosen.steps,
      neutral,
    }),
    colorScheme,
  )

  // All palettes except the neutral and the chosen accent are data colours
  const dataColors = palettes.filter(
    (p, i) => p !== neutralPalette && i !== safeAccentIdx,
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
              {neutralPalette.name}
              {neutralIsDefault ? ' (Tokens Studio default)' : ''}
            </span>
          </div>

          <label className="flex items-center gap-2 text-xs">
            <span className="text-subtle font-medium">Accent</span>
            <select
              value={safeAccentIdx}
              onChange={(e) => setAccentIdx(Number(e.target.value))}
              className="px-2 py-1 text-xs rounded-md border border-neutral-subtle bg-default font-mono"
            >
              {palettes.map((p, i) => (
                <option key={i} value={i}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          {dataColors.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-subtle">
              <span className="font-medium">Data colours:</span>
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
