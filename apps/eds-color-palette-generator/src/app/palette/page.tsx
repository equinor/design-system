'use client'

import { useState, useEffect, useCallback } from 'react'
import Color from 'colorjs.io'
import Link from 'next/link'
import { contrast, generateColorScale } from '@/utils/color'
import {
  STEP_ROLES,
  setSimulationPalettes,
} from '@/utils/palette'
import type { TokenPalette } from '@/utils/palette'
import { localStorageUtils } from '@/utils/localStorage'
import { paletteConfig } from '@/config/palette'
import { getLightnessValues } from '@/config/helpers'
import { PALETTE_STEPS } from '@/config/config'
import type { ColorDefinition } from '@/types'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CATEGORY_GROUPS = [
  { label: 'Background', span: 2 },
  { label: 'Background Fill Muted', span: 3 },
  { label: 'Border', span: 3 },
  { label: 'Background Fill Emphasis', span: 3 },
  { label: 'Text', span: 4 },
] as const

type ViewMode = 'curve' | 'gradient'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PalettePage() {
  const [palettes, setPalettes] = useState<TokenPalette[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('curve')
  const [hasAutoImported, setHasAutoImported] = useState(false)

  /* ---- Auto-import primitives from generator on first load ---- */
  useEffect(() => {
    if (hasAutoImported) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot client-only hydration from localStorage; a lazy initializer would run during SSR and cause a hydration mismatch
    setHasAutoImported(true)

    const colors = localStorageUtils.getColors(paletteConfig.colors)
    const mean = localStorageUtils.getMeanLight(paletteConfig.meanLight)
    const stdDev = localStorageUtils.getStdDevLight(paletteConfig.stdDevLight)
    const lightnessValues = localStorageUtils.getLightModeValues(
      getLightnessValues('light')(PALETTE_STEPS),
    )

    const generated: TokenPalette[] = colors.map((c: ColorDefinition) => {
      const baseColor = 'anchors' in c ? c.anchors : c.value
      const steps = generateColorScale(
        baseColor,
        lightnessValues,
        mean,
        stdDev,
        'HEX',
      )
      return { name: c.name, steps }
    })

    setPalettes(generated)
  }, [hasAutoImported])

  /* ---- Auto-save to localStorage ---- */
  useEffect(() => {
    if (!hasAutoImported) return
    setSimulationPalettes(palettes)
  }, [palettes, hasAutoImported])

  /* ---- Palette CRUD ---- */
  const addPalette = useCallback(
    (p: TokenPalette) => setPalettes((prev) => [...prev, p]),
    [],
  )

  const removePalette = useCallback(
    (index: number) =>
      setPalettes((prev) => prev.filter((_, i) => i !== index)),
    [],
  )

  const updatePaletteName = useCallback(
    (index: number, name: string) =>
      setPalettes((prev) =>
        prev.map((p, i) => (i === index ? { ...p, name } : p)),
      ),
    [],
  )

  const updateStep = useCallback(
    (paletteIndex: number, stepIndex: number, hex: string) =>
      setPalettes((prev) =>
        prev.map((p, i) =>
          i === paletteIndex
            ? {
                ...p,
                steps: p.steps.map((s, j) => (j === stepIndex ? hex : s)),
              }
            : p,
        ),
      ),
    [],
  )

  /* ---- Re-import from generator (replaces all) ---- */
  const reimportFromGenerator = useCallback(() => {
    const colors = localStorageUtils.getColors(paletteConfig.colors)
    const mean = localStorageUtils.getMeanLight(paletteConfig.meanLight)
    const stdDev = localStorageUtils.getStdDevLight(paletteConfig.stdDevLight)
    const lightnessValues = localStorageUtils.getLightModeValues(
      getLightnessValues('light')(PALETTE_STEPS),
    )

    const newPalettes: TokenPalette[] = colors.map((c: ColorDefinition) => {
      const baseColor = 'anchors' in c ? c.anchors : c.value
      const steps = generateColorScale(
        baseColor,
        lightnessValues,
        mean,
        stdDev,
        'HEX',
      )
      return { name: c.name, steps }
    })

    setPalettes(newPalettes)
  }, [])

  /* ---- Sort for gradient view ---- */
  const getSortedSteps = useCallback(
    (steps: string[]) => {
      if (viewMode === 'curve') return steps.map((hex, i) => ({ hex, i }))
      return steps
        .map((hex, i) => ({ hex, i }))
        .sort((a, b) => getLightness(b.hex) - getLightness(a.hex))
    },
    [viewMode],
  )

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
          <h1 className="text-lg font-bold m-0">Palette Editor</h1>

          <div className="ml-auto flex items-center gap-4">
            {/* View mode toggle */}
            <div
              className="flex rounded-lg overflow-hidden"
              style={{ border: '1.5px solid #d1d5db' }}
            >
              {(['curve', 'gradient'] as const).map((mode) => (
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
                    borderLeft:
                      mode !== 'curve' ? '1px solid #d1d5db' : 'none',
                    background: viewMode === mode ? '#111' : '#fff',
                    color: viewMode === mode ? '#fff' : '#666',
                  }}
                >
                  {mode === 'curve' ? 'Curve' : 'Gradient'}
                </button>
              ))}
            </div>

            {/* Nav links */}
            <Link
              href="/contrast"
              style={{
                fontSize: '13px',
                color: '#6b7280',
                textDecoration: 'none',
              }}
            >
              Contrast
            </Link>
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
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* ---- Actions ---- */}
        <div
          className="flex items-center gap-3 flex-wrap"
          style={{ marginBottom: '24px' }}
        >
          <button
            type="button"
            onClick={() =>
              addPalette({
                name: 'Custom',
                steps: Array(15).fill('#888888'),
              })
            }
            className="cursor-pointer"
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: '8px',
              border: '1.5px solid #d1d5db',
              background: '#fff',
              color: '#111',
            }}
          >
            + Custom HEX
          </button>
          <button
            type="button"
            onClick={reimportFromGenerator}
            className="cursor-pointer"
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 400,
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              color: '#6b7280',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            Re-import from generator
          </button>
        </div>

        {/* ---- Palette list ---- */}
        <div className="flex flex-col" style={{ gap: '32px' }}>
          {palettes.map((pal, palIdx) => {
            const sorted = getSortedSteps(pal.steps)

            return (
              <section
                key={palIdx}
                className="rounded-xl overflow-hidden"
                style={{
                  border: '1px solid #e5e7eb',
                  background: '#fff',
                }}
              >
                {/* Palette header */}
                <div
                  className="flex items-center gap-3"
                  style={{
                    padding: '12px 20px',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  <input
                    type="text"
                    value={pal.name}
                    onChange={(e) => updatePaletteName(palIdx, e.target.value)}
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      padding: '4px 0',
                      width: '200px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removePalette(palIdx)}
                    className="ml-auto cursor-pointer"
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      borderRadius: '6px',
                      border: '1.5px solid #fecaca',
                      background: '#fff',
                      color: '#dc2626',
                    }}
                  >
                    Remove
                  </button>
                </div>

                {/* Color strip */}
                <div style={{ padding: '16px 20px 0' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(15, 1fr)',
                      gap: '2px',
                    }}
                  >
                    {/* Category group headers (curve mode only) */}
                    {viewMode === 'curve' &&
                      CATEGORY_GROUPS.map((group) => (
                        <div
                          key={group.label}
                          className="text-center"
                          style={{
                            gridColumn: `span ${group.span}`,
                            paddingBottom: '6px',
                          }}
                        >
                          <span
                            style={{ fontSize: '10px', color: '#6b7280' }}
                          >
                            {group.label}
                          </span>
                          <div
                            style={{
                              height: '1px',
                              background: '#d1d5db',
                              marginTop: '3px',
                            }}
                          />
                        </div>
                      ))}

                    {/* Swatch cells */}
                    {sorted.map(({ hex, i: origIdx }, displayIdx) => (
                      <div
                        key={`strip-${origIdx}`}
                        className="flex flex-col items-center justify-end"
                        style={{
                          height: '64px',
                          backgroundColor: hex,
                          paddingBottom: '4px',
                          borderRadius:
                            displayIdx === 0
                              ? '10px 0 0 10px'
                              : displayIdx === 14
                                ? '0 10px 10px 0'
                                : undefined,
                        }}
                        title={`${origIdx + 1}. ${STEP_ROLES[origIdx]}: ${hex}`}
                      >
                        <span
                          className="font-bold"
                          style={{
                            fontSize: '10px',
                            color: labelColor(hex),
                            opacity: 0.9,
                          }}
                        >
                          {origIdx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hex input grid */}
                <div
                  style={{
                    padding: '16px 20px 20px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '8px',
                  }}
                >
                  {sorted.map(({ hex, i: origIdx }) => (
                    <div key={`input-${origIdx}`}>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '10px',
                          color: '#6b7280',
                          marginBottom: '3px',
                          lineHeight: 1.3,
                        }}
                      >
                        <strong style={{ color: '#374151' }}>
                          {origIdx + 1}
                        </strong>{' '}
                        {STEP_ROLES[origIdx]}
                      </label>
                      <div className="flex items-center gap-1">
                        <span
                          style={{
                            display: 'inline-block',
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            backgroundColor: hex,
                            border: '1px solid rgba(0,0,0,0.1)',
                            flexShrink: 0,
                          }}
                        />
                        <input
                          type="text"
                          value={hex}
                          onChange={(e) => {
                            const v = e.target.value
                            updateStep(palIdx, origIdx, v)
                          }}
                          style={{
                            fontSize: '12px',
                            fontFamily:
                              'var(--font-geist-mono, monospace)',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            border: `1.5px solid ${isValidHex(hex) ? '#d1d5db' : '#fca5a5'}`,
                            background: '#fff',
                            width: '100%',
                            minWidth: 0,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </main>
    </div>
  )
}
