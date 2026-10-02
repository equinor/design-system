'use client'

import { useMemo } from 'react'
import { calcContrast, getApcaFontBreakdown } from '@/utils/palette'
import { Badge } from '@/components/shared/Badge'
import { Card } from '@/components/shared/Card'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { collapseTone } from '@/config/tokensStudio'
import { paletteForTone, resolveToken, toneRamps } from '@/utils/semanticTokens'

type Palette = { name: string; steps: string[] }

/**
 * Tokens Studio role pairs. Each palette plays `<tone>` in turn (written as
 * `accent` below and shown as `<tone>`); neutral roles such as `text.primary`
 * and `background.surface` come from the palette that plays neutral.
 */
const SEMANTIC_PAIRINGS: {
  title: string
  preview: 'text' | 'border'
  pairs: { fg: string; bg: string }[]
}[] = [
  {
    title: 'Text on muted fills',
    preview: 'text',
    pairs: (['default', 'hover', 'pressed'] as const).flatMap((state) => [
      {
        fg: 'text.on-muted.accent',
        bg: `background.interactive.accent.muted.${state}`,
      },
      {
        fg: 'text.primary',
        bg: `background.interactive.accent.muted.${state}`,
      },
    ]),
  },
  {
    title: 'text.on-emphasis on emphasis fills',
    preview: 'text',
    pairs: (['default', 'hover', 'pressed'] as const).map((state) => ({
      fg: 'text.on-emphasis.accent',
      bg: `background.interactive.accent.emphasis.${state}`,
    })),
  },
  {
    title: 'Borders on canvas and surface',
    preview: 'border',
    pairs: ['background.canvas', 'background.surface'].flatMap((bg) => [
      { fg: 'border.non-interactive.accent.muted', bg },
      { fg: 'border.non-interactive.accent.default', bg },
    ]),
  },
]

/** `text.on-muted.<tone> on background.interactive.<tone>.muted.default` */
const pairLabel = (pair: { fg: string; bg: string }) =>
  `${collapseTone(pair.fg)} on ${collapseTone(pair.bg)}`

function PairingCard({
  fgHex,
  bgHex,
  label,
  paletteName,
  previewType = 'text',
}: {
  fgHex: string
  bgHex: string
  label: string
  paletteName: string
  previewType?: 'text' | 'border'
}) {
  const result = useMemo(() => calcContrast(fgHex, bgHex), [fgHex, bgHex])
  const absLc = Math.abs(parseFloat(result.apca))
  const fontBreakdown = useMemo(() => getApcaFontBreakdown(absLc), [absLc])

  return (
    <div className="min-w-[200px] overflow-hidden rounded border border-muted">
      {/* Preview area: the colours under test */}
      <div
        className="flex h-16 items-center justify-center px-3 py-2"
        style={{ backgroundColor: bgHex }}
      >
        {previewType === 'text' ? (
          <span
            className="text-[28px] leading-none font-medium"
            style={{ color: fgHex }}
          >
            Aa
          </span>
        ) : (
          <div
            className="h-8 w-20 rounded border-2"
            style={{ borderColor: fgHex, backgroundColor: bgHex }}
          />
        )}
      </div>
      <div className="flex flex-col gap-1.5 bg-surface p-3">
        <div className="truncate text-sm font-medium text-primary">
          {paletteName}
        </div>
        <div className="text-xs text-secondary">{label}</div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-sm font-medium text-primary">
            {result.wcag}
          </span>
          <Badge pass={result.aa} label="AA" />
          <Badge pass={result.aaa} label="AAA" />
        </div>
        <div className="text-xs text-secondary">
          APCA{' '}
          <span className="font-mono font-medium text-primary">
            Lc {result.apca}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {fontBreakdown.map(({ size, minWeight }) => {
            const passes = minWeight !== null
            return (
              <span
                key={size}
                className={[
                  'rounded px-[5px] py-px text-xs font-medium',
                  passes
                    ? 'bg-success-muted text-success-on-muted'
                    : 'bg-neutral-muted text-tertiary',
                ].join(' ')}
              >
                {size}px
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function SemanticPairings({ palettes }: { palettes: Palette[] }) {
  const { colorScheme } = useColorScheme()

  // The neutral palette follows Tokens Studio (Gray in light, North Sea in
  // dark), falling back to the Tokens Studio default. Every other palette
  // plays <tone>.
  const neutral = paletteForTone(palettes, 'neutral', colorScheme)
  const tonePalettes = useMemo(
    () =>
      palettes
        .filter((p) => p !== neutral)
        .map((palette) => ({
          palette,
          ramps: toneRamps(colorScheme, palettes, {
            accent: palette.steps,
            neutral: neutral.steps,
          }),
        })),
    [palettes, neutral, colorScheme],
  )

  if (tonePalettes.length === 0) return null

  return (
    <Card
      title="Semantic pairings"
      description={
        <>
          Tokens Studio role pairs. Each palette below plays{' '}
          <code className="font-mono">&lt;tone&gt;</code>; neutral roles come
          from <strong className="font-medium">{neutral.name}</strong>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {SEMANTIC_PAIRINGS.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <h3 className="m-0 text-base font-medium text-primary">
              {group.title}
            </h3>

            {group.pairs.map((pair) => {
              const label = pairLabel(pair)
              return (
                <div key={label} className="flex flex-col gap-1.5">
                  <div className="font-mono text-sm text-secondary">
                    {label}
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
                    {tonePalettes.map(({ palette, ramps }, i) => {
                      const fgHex = resolveToken(pair.fg, ramps, colorScheme)
                      const bgHex = resolveToken(pair.bg, ramps, colorScheme)
                      if (!fgHex || !bgHex) return null
                      return (
                        <PairingCard
                          key={`${palette.name}-${i}`}
                          fgHex={fgHex}
                          bgHex={bgHex}
                          label={label}
                          paletteName={palette.name}
                          previewType={group.preview}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </Card>
  )
}
