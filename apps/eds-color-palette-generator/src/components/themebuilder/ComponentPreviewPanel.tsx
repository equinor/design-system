'use client'

import { useState } from 'react'
import { LoginFormPreview } from './LoginFormPreview'
import { DataTablePreview } from './DataTablePreview'
import { CardPreview } from './CardPreview'
import { ButtonPreview } from './ButtonPreview'
import { Card } from '@/components/shared/Card'
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

const SELECT_CLASS =
  'rounded border border-input bg-input px-2 py-1 text-sm text-primary hover:border-input-hover'

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
    <div className="flex flex-col gap-6">
      {/* Role selector */}
      <Card title="Palette roles">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-secondary">Neutral</span>
            <span
              className="inline-flex items-center gap-1.5 rounded border px-2 py-1 text-sm"
              style={{
                backgroundColor: neutral[2],
                color: neutral[12],
                borderColor: neutral[5],
              }}
            >
              <span
                className="inline-block size-2.5 rounded-sm"
                style={{ backgroundColor: neutral[8] }}
              />
              {neutralPalette.name}
              {neutralIsDefault ? ' (Tokens Studio default)' : ''}
            </span>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <span className="font-medium text-secondary">Accent</span>
            <select
              value={safeAccentIdx}
              onChange={(e) => setAccentIdx(Number(e.target.value))}
              className={SELECT_CLASS}
            >
              {palettes.map((p, i) => (
                <option key={i} value={i}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          {dataColors.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-sm text-secondary">
              <span className="font-medium">Data colours:</span>
              {dataColors.map((p) => (
                <span
                  key={p.name}
                  className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-sm"
                  style={{
                    backgroundColor: p.steps[2],
                    color: p.steps[12],
                    borderColor: p.steps[5],
                  }}
                >
                  {p.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card title="Buttons">
        <ButtonPreview colors={colors} />
      </Card>

      <Card title="Login form">
        <LoginFormPreview colors={colors} />
      </Card>

      <Card title="Data table">
        <DataTablePreview colors={colors} />
      </Card>

      <Card title="Article cards">
        <CardPreview colors={colors} />
      </Card>
    </div>
  )
}
