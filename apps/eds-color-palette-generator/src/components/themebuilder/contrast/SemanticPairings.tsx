'use client'

import { useMemo } from 'react'
import { calcContrast, getApcaFontBreakdown } from '@/utils/palette'
import { Badge } from '@/components/Badge'

type Palette = { name: string; steps: string[] }

/**
 * Figma semantic pairings — text/border always from Gray, bg from accent.
 * These are fixed combinations defined by the design system variables.
 */
const SEMANTIC_PAIRINGS = [
  {
    title: 'Text on surfaces',
    pairings: [
      { grayStep: 11, accentStep: 0, label: 'text/primary on bg/canvas' },
      { grayStep: 11, accentStep: 1, label: 'text/primary on bg/surface' },
      { grayStep: 11, accentStep: 2, label: 'text/primary on bg/surface-hover' },
    ],
  },
  {
    title: 'Text on emphasis',
    pairings: [
      { grayStep: 14, accentStep: 8, label: 'bg/card on fill/emphasis', invert: true },
      { grayStep: 14, accentStep: 9, label: 'bg/card on fill/emphasis-hover', invert: true },
      { grayStep: 14, accentStep: 10, label: 'bg/card on fill/emphasis-pressed', invert: true },
      { grayStep: 13, accentStep: 8, label: 'fg/on-emphasis on fill/emphasis' },
    ],
  },
  {
    title: 'Borders on surfaces',
    pairings: [
      { grayStep: 6, accentStep: 0, label: 'border/subtle on bg/canvas' },
      { grayStep: 7, accentStep: 0, label: 'border/default on bg/canvas' },
      { grayStep: 6, accentStep: 1, label: 'border/subtle on bg/surface' },
      { grayStep: 7, accentStep: 1, label: 'border/default on bg/surface' },
    ],
  },
] as const

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
          <span style={{ color: fgHex, fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
            Aa
          </span>
        ) : (
          <div
            className="rounded"
            style={{ border: `2px solid ${fgHex}`, backgroundColor: bgHex, width: 80, height: 32 }}
          />
        )}
      </div>
      <div className="p-3 flex flex-col gap-1.5 bg-default">
        <div className="text-xs font-semibold text-strong truncate">{paletteName}</div>
        <div className="text-[11px] text-subtle">{label}</div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono font-semibold text-strong">{result.wcag}</span>
          <Badge pass={result.aa} label="AA" />
          <Badge pass={result.aaa} label="AAA" />
        </div>
        <div className="text-[11px] text-subtle">
          APCA <span className="font-mono font-semibold text-strong">Lc {result.apca}</span>
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
  // Find Gray/neutral palette
  const grayIdx = palettes.findIndex(
    (p) => p.name.toLowerCase().includes('gray') || p.name.toLowerCase().includes('grey'),
  )
  const neutralIdx = grayIdx >= 0 ? grayIdx : 0
  const gray = palettes[neutralIdx]

  // Accent palettes = everything except Gray
  const accentPalettes = palettes.filter((_, i) => i !== neutralIdx)

  if (accentPalettes.length === 0) return null

  return (
    <section className="rounded-xl border border-neutral-subtle bg-default p-5 flex flex-col gap-5">
      <div>
        <h2 className="text-base font-bold text-strong m-0">
          Semantic pairings
        </h2>
        <p className="text-sm text-subtle m-0 mt-1">
          Fixed combinations from the design system — text &amp; borders from{' '}
          <strong>{gray.name}</strong>, backgrounds from each accent palette
        </p>
      </div>

      {SEMANTIC_PAIRINGS.map((group) => (
        <div key={group.title} className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-strong m-0">{group.title}</h3>

          {group.pairings.map((pairing) => {
            const isBorder = group.title.toLowerCase().includes('border')
            return (
              <div key={pairing.label} className="flex flex-col gap-1.5">
                <div className="text-xs text-subtle">{pairing.label}</div>
                <div
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  }}
                >
                  {accentPalettes.map((accent) => (
                    <PairingCard
                      key={accent.name}
                      fgHex={
                        'invert' in pairing && pairing.invert
                          ? gray.steps[pairing.grayStep]
                          : gray.steps[pairing.grayStep]
                      }
                      bgHex={accent.steps[pairing.accentStep]}
                      label={pairing.label}
                      paletteName={accent.name}
                      previewType={isBorder ? 'border' : 'text'}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </section>
  )
}
