'use client'

import { useState, useMemo, useCallback } from 'react'
import Color from 'colorjs.io'
import Link from 'next/link'
import { contrast } from '@/utils/color'
import {
  STEP_ROLES,
  PALETTES,
  getApcaFontBreakdown,
  calcContrast,
} from '@/utils/palette'
import type { ContrastResult } from '@/utils/palette'
import { Badge } from '@/components/shared/Badge'
import { CATEGORY_GROUPS } from '@/config/categories'

function getLightness(hex: string): number {
  try {
    return new Color(hex).to('oklch').l ?? 0
  } catch {
    return 0
  }
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TextChoice = ContrastResult & { color: string; label: string }

type StepData = {
  step: number
  role: string
  hex: string
  recommended: TextChoice
  paletteText: TextChoice
}

type SortOrder = 'semantic' | 'gradient'

type ViewMode = 'semantic' | 'gradient' | 'combined'

/* ------------------------------------------------------------------ */
/*  Combined view — real cross-palette interaction patterns            */
/* ------------------------------------------------------------------ */

type Pairing = {
  state: string
  type: 'text' | 'border' | 'fill'
  fg: { label: string; hex: string }
  bg: { label: string; hex: string }
  contrast: ContrastResult
}

type PatternGroup = {
  title: string
  description: string
  pairings: Pairing[]
}

function buildPatternGroups(): PatternGroup[] {
  const g = PALETTES[1].steps // Gray
  const a = PALETTES[0].steps // Moss Green (Accent)

  function p(
    state: string,
    fgLabel: string, fgHex: string,
    bgLabel: string, bgHex: string,
    type: 'text' | 'border' | 'fill' = 'text',
  ): Pairing {
    return {
      state,
      type,
      fg: { label: fgLabel, hex: fgHex },
      bg: { label: bgLabel, hex: bgHex },
      contrast: calcContrast(fgHex, bgHex),
    }
  }

  return [
    {
      title: 'Border: Neutral → Accent on selection',
      description: 'Border starts Gray, switches to Accent on focus/selected',
      pairings: [
        p('Default',  `Gray/6 border-subtle`,  g[5],  `Gray/1 bg-canvas`, g[0], 'border'),
        p('Hover',    `Gray/7 border-medium`,   g[6],  `Gray/1 bg-canvas`, g[0], 'border'),
        p('Selected', `Accent/8 border-strong`, a[7],  `Gray/1 bg-canvas`, g[0], 'border'),
        p('Default',  `Gray/6 border-subtle`,  g[5],  `Gray/2 bg-surface`, g[1], 'border'),
        p('Hover',    `Gray/7 border-medium`,   g[6],  `Gray/2 bg-surface`, g[1], 'border'),
        p('Selected', `Accent/8 border-strong`, a[7],  `Gray/2 bg-surface`, g[1], 'border'),
      ],
    },
    {
      title: 'Accent text on Neutral backgrounds',
      description: 'Accent-colored text and icons on Gray surfaces',
      pairings: [
        p('Subtle',  `Accent/12 text-subtle`, a[11], `Gray/1 bg-canvas`,  g[0]),
        p('Strong',  `Accent/13 text-strong`, a[12], `Gray/1 bg-canvas`,  g[0]),
        p('Subtle',  `Accent/12 text-subtle`, a[11], `Gray/2 bg-surface`, g[1]),
        p('Strong',  `Accent/13 text-strong`, a[12], `Gray/2 bg-surface`, g[1]),
        p('Subtle',  `Accent/12 text-subtle`, a[11], `Gray/3 bg-fill-muted`, g[2]),
        p('Strong',  `Accent/13 text-strong`, a[12], `Gray/3 bg-fill-muted`, g[2]),
      ],
    },
    {
      title: 'Accent fills on Neutral canvas',
      description: 'Accent muted/emphasis fills visible on Gray backgrounds',
      pairings: [
        p('Muted',    `Accent/3 fill-muted`,    a[2],  `Gray/1 bg-canvas`,  g[0], 'fill'),
        p('Muted',    `Accent/3 fill-muted`,    a[2],  `Gray/2 bg-surface`, g[1], 'fill'),
        p('Emphasis', `Accent/9 fill-emphasis`,  a[8],  `Gray/1 bg-canvas`,  g[0], 'fill'),
        p('Emphasis', `Accent/9 fill-emphasis`,  a[8],  `Gray/2 bg-surface`, g[1], 'fill'),
      ],
    },
    {
      title: 'Text on Accent emphasis fills',
      description: 'Readable text on Accent dark backgrounds',
      pairings: [
        p('White',       `White`,                       '#ffffff', `Accent/9 emphasis-default`,  a[8]),
        p('On-emphasis', `Accent/15 strong-on-emphasis`, a[14],   `Accent/9 emphasis-default`,  a[8]),
        p('On-emphasis', `Accent/14 subtle-on-emphasis`, a[13],   `Accent/9 emphasis-default`,  a[8]),
        p('Gray strong', `Gray/13 text-strong`,          g[12],   `Accent/9 emphasis-default`,  a[8]),
      ],
    },
    {
      title: 'Neutral text on Accent muted fills',
      description: 'Text readability on light Accent backgrounds',
      pairings: [
        p('Gray strong',   `Gray/13 text-strong`, g[12], `Accent/3 fill-muted-default`, a[2]),
        p('Accent strong', `Accent/13 text-strong`, a[12], `Accent/3 fill-muted-default`, a[2]),
        p('Gray strong',   `Gray/13 text-strong`, g[12], `Accent/5 fill-muted-active`,  a[4]),
        p('Accent strong', `Accent/13 text-strong`, a[12], `Accent/5 fill-muted-active`,  a[4]),
      ],
    },
  ]
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function findBestPaletteText(
  bgIndex: number,
  steps: string[],
): TextChoice {
  const textStepIndices = [11, 12, 13, 14]
  const candidates = steps
    .map((hex, idx) => {
      if (idx === bgIndex) return null
      const result = calcContrast(hex, steps[bgIndex])
      return {
        idx, hex, result,
        wcagNum: parseFloat(result.wcag),
        isTextStep: textStepIndices.includes(idx),
      }
    })
    .filter((c): c is NonNullable<typeof c> => c !== null)

  const find = (filter: (c: (typeof candidates)[0]) => boolean) =>
    candidates.filter(filter).sort((a, b) => b.wcagNum - a.wcagNum)[0]

  const pick =
    find((c) => c.isTextStep && c.wcagNum >= 7) ??
    find((c) => c.wcagNum >= 7) ??
    find((c) => c.isTextStep && c.wcagNum >= 4.5) ??
    find((c) => c.wcagNum >= 4.5) ??
    [...candidates].sort((a, b) => b.wcagNum - a.wcagNum)[0]

  return {
    ...pick.result,
    color: pick.hex,
    label: `Step ${pick.idx + 1} · ${STEP_ROLES[pick.idx]} (${pick.hex})`,
  }
}

function buildStepData(
  steps: string[],
  mode: SortOrder,
  primitiveIndices?: number[],
): StepData[] {
  return steps.map((hex, index) => {
    const white = calcContrast('#ffffff', hex)
    const black = calcContrast('#000000', hex)
    const useWhite = parseFloat(white.wcag) >= parseFloat(black.wcag)
    const recommended: TextChoice = useWhite
      ? { ...white, color: '#ffffff', label: 'White (#ffffff)' }
      : { ...black, color: '#000000', label: 'Black (#000000)' }

    const paletteText = findBestPaletteText(index, steps)
    const stepNumber = primitiveIndices ? primitiveIndices[index] : index + 1

    return {
      step: stepNumber,
      role: mode === 'semantic' ? STEP_ROLES[index] : '',
      hex,
      recommended,
      paletteText,
    }
  })
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ContrastCell({
  data,
  fgColor,
  bgColor,
  label,
}: {
  data: ContrastResult
  fgColor: string
  bgColor: string
  label: string
}) {
  const lc = parseFloat(data.apca)
  const fontBreakdown = useMemo(() => getApcaFontBreakdown(lc), [lc])

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="rounded-lg text-center"
        style={{
          backgroundColor: bgColor,
          color: fgColor,
          padding: '8px 12px',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <span
          style={{
            fontSize: '20px',
            fontWeight: 700,
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          Aa
        </span>
      </div>

      <div
        className="font-medium"
        style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '0.03em' }}
      >
        {label}
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        <span
          className="font-semibold"
          style={{
            fontFamily: 'var(--font-geist-mono, monospace)',
            fontSize: '12px',
          }}
        >
          {data.wcag}:1
        </span>
        <Badge pass={data.aa} label="AA" />
        <Badge pass={data.aaa} label="AAA" />
      </div>

      <div style={{ marginTop: '4px' }}>
        <div className="flex items-center gap-1" style={{ marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', color: '#6b7280' }}>APCA</span>
          <span
            className="font-semibold"
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '12px',
            }}
          >
            Lc&nbsp;{data.apca}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {fontBreakdown.map(({ size, minWeightName }) => (
            <span
              key={size}
              className="inline-flex items-center rounded font-medium"
              style={{
                padding: '2px 6px',
                fontSize: '10px',
                lineHeight: '16px',
                fontFamily: 'var(--font-geist-mono, monospace)',
                backgroundColor: minWeightName ? '#dbeafe' : '#f3f4f6',
                color: minWeightName ? '#1e40af' : '#c0c0c0',
                textDecoration: minWeightName ? 'none' : 'line-through',
              }}
            >
              {size}px{minWeightName ? ` ${minWeightName}` : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }, [text])

  return (
    <button
      type="button"
      onClick={copy}
      className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      style={{
        background: 'none',
        border: 'none',
        padding: '2px 6px',
        fontSize: '11px',
        color: 'inherit',
        borderRadius: '4px',
      }}
      title={`Copy ${text}`}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ContrastPage() {
  const [activePalette, setActivePalette] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('semantic')

  const palette = PALETTES[activePalette]

  const displayData = useMemo(() => {
    if (viewMode === 'combined') return []
    if (viewMode === 'semantic') {
      return buildStepData(palette.steps, 'semantic')
    }
    const sorted = palette.steps
      .map((hex, i) => ({ hex, i }))
      .sort((a, b) => getLightness(b.hex) - getLightness(a.hex))
    return buildStepData(
      sorted.map((s) => s.hex),
      'gradient',
      sorted.map((s) => s.i + 1),
    )
  }, [palette, viewMode])

  const patternGroups = useMemo(() => {
    if (viewMode !== 'combined') return []
    return buildPatternGroups()
  }, [viewMode])

  return (
    <div
      className="min-h-screen"
      style={{ background: '#fafafa', color: '#111' }}
    >
      {/* ---- Header ---- */}
      <header
        className="sticky top-0 z-10"
        style={{
          background: 'rgba(250,250,250,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <h1 className="text-lg font-bold m-0">EDS Palette Contrast</h1>

          <div className="ml-auto flex items-center gap-4">
            {/* Palette selector — hidden in combined */}
            {viewMode !== 'combined' && (
              <div className="flex items-center gap-2">
                {PALETTES.map((p, i) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setActivePalette(i)}
                    className="cursor-pointer"
                    style={{
                      padding: '6px 14px',
                      fontSize: '13px',
                      fontWeight: activePalette === i ? 600 : 400,
                      borderRadius: '8px',
                      border:
                        activePalette === i
                          ? '1.5px solid #111'
                          : '1.5px solid #d1d5db',
                      background: activePalette === i ? '#111' : '#fff',
                      color: activePalette === i ? '#fff' : '#111',
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            {/* View mode toggle */}
            <div
              className="flex rounded-lg overflow-hidden"
              style={{ border: '1.5px solid #d1d5db' }}
            >
              {(['semantic', 'gradient', 'combined'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className="cursor-pointer"
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: viewMode === mode ? 600 : 400,
                    border: 'none',
                    borderLeft: mode !== 'semantic' ? '1px solid #d1d5db' : 'none',
                    background: viewMode === mode ? '#111' : '#fff',
                    color: viewMode === mode ? '#fff' : '#666',
                  }}
                >
                  {mode === 'semantic' ? 'Curve' : mode === 'gradient' ? 'Gradient' : 'Combined'}
                </button>
              ))}
            </div>

            {/* Nav links */}
            <Link
              href="/example"
              style={{
                fontSize: '13px',
                color: '#6b7280',
                textDecoration: 'none',
              }}
            >
              Example
            </Link>
            <Link
              href="/palette"
              style={{
                fontSize: '13px',
                color: '#6b7280',
                textDecoration: 'none',
              }}
            >
              Palette
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* ============================================================ */}
        {/*  COMBINED VIEW                                                */}
        {/* ============================================================ */}
        {viewMode === 'combined' && (
          <div className="flex flex-col" style={{ gap: '32px' }}>
            {patternGroups.map((group) => (
              <section key={group.title}>
                <h2
                  className="font-bold"
                  style={{ fontSize: '15px', margin: '0 0 4px' }}
                >
                  {group.title}
                </h2>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: '0 0 16px',
                  }}
                >
                  {group.description}
                </p>

                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {group.pairings.map((p, i) => {
                    const lc = parseFloat(p.contrast.apca)
                    const fontBreakdown = getApcaFontBreakdown(lc)

                    return (
                      <div
                        key={`${group.title}-${i}`}
                        className="rounded-xl overflow-hidden"
                        style={{
                          border: '1px solid #e5e7eb',
                          background: '#fff',
                        }}
                      >
                        {/* State label */}
                        <div
                          style={{
                            padding: '6px 12px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#6b7280',
                            borderBottom: '1px solid #f3f4f6',
                          }}
                        >
                          {p.state}
                        </div>

                        {/* Visual preview — adapts to pairing type */}
                        <div
                          style={{
                            backgroundColor: p.bg.hex,
                            padding: p.type === 'border' ? '16px 20px' : '16px 12px',
                          }}
                        >
                          {p.type === 'border' ? (
                            /* Border: show an input-like box */
                            <div
                              style={{
                                border: `2px solid ${p.fg.hex}`,
                                borderRadius: '8px',
                                padding: '10px 12px',
                                fontSize: '13px',
                                color: '#9ca3af',
                                backgroundColor: p.bg.hex,
                              }}
                            >
                              Placeholder
                            </div>
                          ) : p.type === 'fill' ? (
                            /* Fill: show a filled rectangle on the canvas */
                            <div
                              style={{
                                backgroundColor: p.fg.hex,
                                borderRadius: '8px',
                                height: '44px',
                              }}
                            />
                          ) : (
                            /* Text: show Aa */
                            <div className="text-center">
                              <span
                                style={{
                                  fontSize: '24px',
                                  fontWeight: 700,
                                  fontFamily: 'Georgia, serif',
                                  color: p.fg.hex,
                                }}
                              >
                                Aa
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div
                          style={{
                            padding: '10px 12px',
                            fontSize: '10px',
                            color: '#6b7280',
                          }}
                        >
                          {/* Variable labels */}
                          <div style={{ marginBottom: '6px', lineHeight: 1.5 }}>
                            <div>
                              fg: <strong style={{ color: '#111' }}>{p.fg.label}</strong>
                            </div>
                            <div>
                              bg: <strong style={{ color: '#111' }}>{p.bg.label}</strong>
                            </div>
                          </div>

                          {/* WCAG */}
                          <div
                            className="flex items-center gap-1 flex-wrap"
                            style={{ marginBottom: '4px' }}
                          >
                            <span
                              className="font-semibold"
                              style={{
                                fontFamily: 'var(--font-geist-mono, monospace)',
                                fontSize: '12px',
                                color: '#111',
                              }}
                            >
                              {p.contrast.wcag}:1
                            </span>
                            <Badge pass={p.contrast.aa} label="AA" />
                            <Badge pass={p.contrast.aaa} label="AAA" />
                          </div>

                          {/* APCA */}
                          <div className="flex items-center gap-1" style={{ marginBottom: '4px' }}>
                            <span style={{ color: '#9ca3af' }}>APCA</span>
                            <span
                              className="font-semibold"
                              style={{
                                fontFamily: 'var(--font-geist-mono, monospace)',
                                fontSize: '12px',
                                color: '#111',
                              }}
                            >
                              Lc&nbsp;{p.contrast.apca}
                            </span>
                          </div>

                          {/* Font sizes */}
                          <div className="flex flex-wrap gap-1">
                            {fontBreakdown.map(({ size, minWeightName }) => (
                              <span
                                key={size}
                                className="inline-flex items-center rounded font-medium"
                                style={{
                                  padding: '1px 4px',
                                  fontSize: '9px',
                                  lineHeight: '14px',
                                  fontFamily: 'var(--font-geist-mono, monospace)',
                                  backgroundColor: minWeightName ? '#dbeafe' : '#f3f4f6',
                                  color: minWeightName ? '#1e40af' : '#c0c0c0',
                                  textDecoration: minWeightName ? 'none' : 'line-through',
                                }}
                              >
                                {size}px{minWeightName ? ` ${minWeightName}` : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/*  SINGLE PALETTE VIEW (Curve / Gradient)                       */}
        {/* ============================================================ */}
        {viewMode !== 'combined' && (
        <>
        {/* ---- Category legend + palette strip (shared 15-col grid) ---- */}
        <div
          className="mb-8"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(15, 1fr)',
            gap: '2px',
          }}
        >
          {viewMode === 'semantic' &&
            CATEGORY_GROUPS.map((group) => (
              <div
                key={group.label}
                className="text-center"
                style={{
                  gridColumn: `span ${group.span}`,
                  paddingBottom: '6px',
                }}
              >
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  {group.label}
                </span>
                <div
                  style={{
                    height: '1px',
                    background: '#d1d5db',
                    marginTop: '4px',
                  }}
                />
              </div>
            ))}

          {displayData.map((s, i) => {
            const labelColor =
              parseFloat(
                String(
                  contrast({
                    foreground: '#ffffff',
                    background: s.hex,
                    algorithm: 'WCAG21',
                    silent: true,
                  }),
                ),
              ) >= 3
                ? '#fff'
                : '#000'
            return (
              <div
                key={`strip-${s.step}`}
                className="flex flex-col items-center justify-end cursor-default"
                style={{
                  height: '72px',
                  backgroundColor: s.hex,
                  paddingBottom: '4px',
                  borderRadius:
                    i === 0
                      ? '12px 0 0 12px'
                      : i === displayData.length - 1
                        ? '0 12px 12px 0'
                        : undefined,
                }}
                title={`${s.step}${s.role ? `. ${s.role}` : ''}: ${s.hex}`}
              >
                <span
                  className="font-bold"
                  style={{ fontSize: '11px', color: labelColor, opacity: 0.9 }}
                >
                  {s.step}
                </span>
              </div>
            )
          })}
        </div>

        {/* ---- Step detail cards ---- */}
        <div className="flex flex-col" style={{ gap: '12px' }}>
          {displayData.map((s) => {
            const labelColor = s.recommended.color

            return (
              <div
                key={s.step}
                className="rounded-xl overflow-hidden group"
                style={{
                  border: '1px solid #e5e7eb',
                  background: '#fff',
                }}
              >
                <div
                  className="flex items-center justify-between"
                  style={{
                    backgroundColor: s.hex,
                    color: labelColor,
                    padding: '12px 20px',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold">{s.step}</span>
                    {s.role && (
                      <span style={{ fontSize: '13px', opacity: 0.85 }}>
                        {s.role}
                      </span>
                    )}
                    <span
                      style={{
                        fontFamily: 'var(--font-geist-mono, monospace)',
                        fontSize: '12px',
                        opacity: 0.65,
                      }}
                    >
                      {s.hex}
                    </span>
                    <CopyButton text={s.hex} />
                  </div>
                </div>

                <div
                  className="grid grid-cols-2"
                  style={{ padding: '16px 20px', gap: '16px' }}
                >
                  <ContrastCell
                    data={s.recommended}
                    fgColor={s.recommended.color}
                    bgColor={s.hex}
                    label={s.recommended.label}
                  />
                  <ContrastCell
                    data={s.paletteText}
                    fgColor={s.paletteText.color}
                    bgColor={s.hex}
                    label={s.paletteText.label}
                  />
                </div>
              </div>
            )
          })}
        </div>
        </>
        )}
      </main>
    </div>
  )
}
