'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { PALETTES } from '@/utils/palette'
import {
  refreshCustomPalettes,
  useCustomPalettes,
} from '@/utils/customPalettesStore'
import {
  InteractivePicker,
  PredefinedGroups,
  SurfacePreviewSection,
} from '@/components/example'

export default function ExamplePage() {
  const [activePalette, setActivePalette] = useState(0)
  const customPalettes = useCustomPalettes()

  const allPalettes = useMemo(
    () => [...PALETTES, ...customPalettes],
    [customPalettes],
  )

  const palette = allPalettes[activePalette] ?? allPalettes[0]

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
          <h1 className="text-lg font-bold m-0">EDS Palette Examples</h1>

          <div className="ml-auto flex items-center gap-4">
            {/* Palette selector */}
            <div className="flex items-center gap-2">
              {allPalettes.map((p, i) => (
                <button
                  key={`${p.name}-${i}`}
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
              <button
                type="button"
                onClick={refreshCustomPalettes}
                className="cursor-pointer"
                title="Refresh custom palettes from Palette Editor"
                style={{
                  padding: '6px 10px',
                  fontSize: '12px',
                  borderRadius: '8px',
                  border: '1.5px solid #d1d5db',
                  background: '#fff',
                  color: '#6b7280',
                }}
              >
                Refresh
              </button>
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
        <PredefinedGroups palette={palette} />
        <SurfacePreviewSection allPalettes={allPalettes} />
        <InteractivePicker allPalettes={allPalettes} />
      </main>
    </div>
  )
}
