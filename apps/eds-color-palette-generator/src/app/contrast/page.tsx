'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { PALETTES } from '@/utils/palette'
import {
  buildPatternGroups,
  buildStepData,
  getLightness,
  type ViewMode,
} from '@/utils/contrastPageData'
import { CombinedPatternView, SinglePaletteView } from '@/components/contrast'

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
    <div className="min-h-screen" style={{ background: '#fafafa', color: '#111' }}>
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
                    borderLeft:
                      mode !== 'semantic' ? '1px solid #d1d5db' : 'none',
                    background: viewMode === mode ? '#111' : '#fff',
                    color: viewMode === mode ? '#fff' : '#666',
                  }}
                >
                  {mode === 'semantic'
                    ? 'Curve'
                    : mode === 'gradient'
                      ? 'Gradient'
                      : 'Combined'}
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
        {viewMode === 'combined' && (
          <CombinedPatternView patternGroups={patternGroups} />
        )}

        {viewMode !== 'combined' && (
          <SinglePaletteView displayData={displayData} mode={viewMode} />
        )}
      </main>
    </div>
  )
}
