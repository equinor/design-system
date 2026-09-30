'use client'

import { useMemo } from 'react'
import { calcContrast, getApcaFontBreakdown } from '@/utils/palette'
import { Badge } from '@/components/shared/Badge'
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
    <div
      className="rounded-lg border border-neutral-subtle overflow-hidden"
      style={{ minWidth: 200 }}
    >
      <div
        className="flex items-center justify-center"
        style={{ backgroundColor: bgHex, height: 64, padding: '8px 12px' }}
      >
        {previewType === 'text' ? (
          <span
            style={{
              color: fgHex,
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            Aa
          </span>
        ) : (
          <div
            className="rounded"
            style={{
              border: `2px solid ${fgHex}`,
              backgroundColor: bgHex,
              width: 80,
              height: 32,
            }}
          />
        )}
      </div>
      <div className="p-3 flex flex-col gap-1.5 bg-default">
        <div className="text-xs font-semibold text-strong truncate">
          {paletteName}
        </div>
        <div className="text-[11px] text-subtle">{label}</div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono font-semibold text-strong">
            {result.wcag}
          </span>
          <Badge pass={result.aa} label="AA" />
          <Badge pass={result.aaa} label="AAA" />
        </div>
        <div className="text-[11px] text-subtle">
          APCA{' '}
          <span className="font-mono font-semibold text-strong">
            Lc {result.apca}
          </span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {fontBreakdown.map(({ size, minWeight }) => {
            const passes = minWeight !== null
            return (
              <span
                key={size}
                className="rounded text-[10px] font-medium"
                style={{
                  padding: '1px 5px',
                  backgroundColor: passes ? '#dcfce7' : '#f3f4f6',
                  color: passes ? '#166534' : '#9ca3af',
                }}
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
    <section className="rounded-xl border border-neutral-subtle bg-default p-5 flex flex-col gap-5">
      <div>
        <h2 className="text-base font-bold text-strong m-0">
          Semantic pairings
        </h2>
        <p className="text-sm text-subtle m-0 mt-1">
          Tokens Studio role pairs. Each palette below plays{' '}
          <code>&lt;tone&gt;</code>; neutral roles come from{' '}
          <strong>{neutral.name}</strong>
        </p>
      </div>

      {SEMANTIC_PAIRINGS.map((group) => (
        <div key={group.title} className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-strong m-0">
            {group.title}
          </h3>

          {group.pairs.map((pair) => {
            const label = pairLabel(pair)
            return (
              <div key={label} className="flex flex-col gap-1.5">
                <div className="text-xs text-subtle">{label}</div>
                <div
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(200px, 1fr))',
                  }}
                >
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
    </section>
  )
}
