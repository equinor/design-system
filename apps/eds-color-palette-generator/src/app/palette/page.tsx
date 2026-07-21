'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { setSimulationPalettes, type TokenPalette } from '@/utils/palette'
import { generatePalettesFromGenerator } from '@/utils/generatorImport'
import { PaletteCard, type PaletteViewMode } from '@/components/palette'

export default function PalettePage() {
  const [palettes, setPalettes] = useState<TokenPalette[]>([])
  const [viewMode, setViewMode] = useState<PaletteViewMode>('curve')
  const [hasAutoImported, setHasAutoImported] = useState(false)

  /* ---- Auto-import primitives from generator on first load ---- */
  useEffect(() => {
    if (hasAutoImported) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot client-only hydration from localStorage; a lazy initializer would run during SSR and cause a hydration mismatch
    setHasAutoImported(true)
    setPalettes(generatePalettesFromGenerator())
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
    setPalettes(generatePalettesFromGenerator())
  }, [])

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
                    borderLeft: mode !== 'curve' ? '1px solid #d1d5db' : 'none',
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
          {palettes.map((pal, palIdx) => (
            <PaletteCard
              key={palIdx}
              palette={pal}
              index={palIdx}
              viewMode={viewMode}
              onNameChange={updatePaletteName}
              onRemove={removePalette}
              onStepChange={updateStep}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
